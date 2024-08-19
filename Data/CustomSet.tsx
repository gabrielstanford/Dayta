import getAllActivitiesForUser from '@/Data/GetAllActivities'
import {useEffect, useState} from 'react'
import {useAuth} from '@/contexts/AuthContext'
import { useAppContext } from '@/contexts/AppContext'
import {ButtonState, ActivitySummary} from '@/Types/ActivityTypes'

interface ValueCounts {
  [key: string]: number;
}

const countValues = (array: string[]): ValueCounts => {
  return array.reduce((acc: ValueCounts, value: string) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
};

function useCustomSet() {
  const {customActivities, justActivities, setDurationSummary, setFinalArray} = useAppContext();
  const [textKeys, setTextKeys] = useState<string[]>([])
  //this function performs two main things: 
  //1. It creates an array containing just the text and tags of all the activities
  //3. It calculates statistics based on this
  //2. it fetches the 9 buttons to display based on this as well
  const createDurationSummary = () => {
    console.log('Fetching Activities in CustomSet')
    
      const relevantActivities = justActivities.filter(act => act.timeBlock.startTime>1722988800)
      const activityText = relevantActivities.map((activity) => activity.button.text);

      // Step 1: Group activities by name and sum durations
      const totalTimePerActivity = relevantActivities.reduce<Record<string, number>>((acc, activity) => {
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
      entries.sort(([, valueA], [, valueB]) => valueB - valueA);
      const topEntries = entries.slice(0, 9);
      const sortedDictTop = Object.fromEntries(topEntries);
      const textKeys = Object.keys(sortedDictTop);
      setTextKeys(textKeys)

  };

  const createFinalArray = () => {
    console.log('Creating Final Array')
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
  }

  const createWeekDurationStats = () => {
    const relevantActivities = justActivities.filter(act => act.timeBlock.startTime>1722988800)
    const activityText = relevantActivities.map((activity) => activity.button.text);

    // Step 1: Group activities by name and sum durations
    const totalTimePerActivity = relevantActivities.reduce<Record<string, number>>((acc, activity) => {
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
  }

  const createDayDurationStats = () => {

  }

  const createSleepStats = () => {

  }
  useEffect(() => {
    console.log('Use Effect hook triggered; custom activities changed from CustomSet')
    createDurationSummary();
  }, [justActivities]);
  useEffect(() => {
    createFinalArray();
  }, [justActivities])
  return {finalArray: useAppContext().finalArray, durationSummary: useAppContext().durationSummary}
};


export {useCustomSet}