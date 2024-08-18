import getAllActivitiesForUser from '@/Data/GetAllActivities'
import {useEffect, useState} from 'react'
import {useAuth} from '@/contexts/AuthContext'
import { useAppContext } from '@/contexts/AppContext'
import {ButtonState} from '@/Types/ActivityTypes'
  

interface ValueCounts {
  [key: string]: number;
}
// Define the type for the summary result
interface ActivitySummary {
  text: string;
  totalDuration: number;
}

const countValues = (array: string[]): ValueCounts => {
  return array.reduce((acc: ValueCounts, value: string) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
};

const useCustomSet = (): any => {
  const { user } = useAuth();
  const {customActivities, justActivities} = useAppContext()
  const [finalArray, setFinalArray] = useState<ButtonState[]>([]);
  const [entries, setEntries] = useState<[string, number][]>([]);
  const [durationSummary, setDurationSummary] = useState<ActivitySummary[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      console.log('preparing to get users activities from activitybutton')
      try {
        const activityText = justActivities.map((activity) => activity.button.text);

        // Step 1: Group activities by name and sum durations
        const totalTimePerActivity = justActivities.reduce<Record<string, number>>((acc, activity) => {
          if (acc[activity.button.text]) {
            acc[activity.button.text] += activity.timeBlock.duration / 3600;
          } else {
            acc[activity.button.text] = activity.timeBlock.duration / 3600;
          }
          return acc;
        }, {});

        // Step 2: Convert the result into an array of ActivitySummary objects
        const result: ActivitySummary[] = Object.entries(totalTimePerActivity).map(([text, totalDuration]) => ({
          text,
          totalDuration,
        }));
        setDurationSummary(result);

        const activityCounts = countValues(activityText);
        const entries = Object.entries(activityCounts);
        setEntries(entries);
        entries.sort(([, valueA], [, valueB]) => valueB - valueA);
        const topEntries = entries.slice(0, 9);
        const sortedDictTop = Object.fromEntries(topEntries);
        const textKeys = Object.keys(sortedDictTop);

        const correspondingButtons = customActivities.filter((button) =>
          textKeys.includes(button.text)
        );

        let updatedArray: ButtonState[] = [...correspondingButtons];

        if (updatedArray.length < 9) {
          const remainingSlots = 9 - updatedArray.length;
          const additionalButtons = customActivities.filter(
            (button) => !textKeys.includes(button.text)
          ).slice(0, remainingSlots);
          updatedArray = [...updatedArray, ...additionalButtons];
        }

        setFinalArray(updatedArray);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchActivities();
  }, [user, customActivities]);

  return { finalArray, entries, durationSummary };
};


export {useCustomSet}