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
  const {customActivities, justActivities, setDurationSummary, setWeekDurationSummary, setAvgSleepTime, setAvgWakeTime, setFinalArray} = useAppContext();
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
    const getUnixTimestampMinusOneWeek = (): number => {
      const currentTimestamp = Math.floor(Date.now() / 1000); // Current Unix timestamp in seconds
      const oneWeekInSeconds = 7 * 24 * 60 * 60; // One week in seconds
      return currentTimestamp - oneWeekInSeconds;
    };
    const relevantActivities = justActivities.filter(act => act.timeBlock.startTime>getUnixTimestampMinusOneWeek())
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
    setWeekDurationSummary(result);
  }

  const createDayDurationStats = () => {

  }

  const createSleepStats = () => {
    const allSleepSlots = justActivities.filter(act => act.button.text=="Went To Bed" )
    const allWakeSlots = justActivities.filter(act => act.button.text=="Woke Up")


    const sleepInfo = allSleepSlots.map(sleepSlot => sleepSlot.timeBlock.startTime)
    const wakeInfo = allWakeSlots.map(wakeSlot => wakeSlot.timeBlock.startTime)

    const sleepHours = sleepInfo.map(slot => (new Date(slot * 1000)).getHours())
    const wakeHours = wakeInfo.map(slot => (new Date(slot * 1000)).getHours())
    console.log(sleepHours)
    // const allSlots = justActivities.filter(act => act.button.text=="Went To Bed" || act.button.text=="Woke Up")
    // allSlots.sort((a, b) => b.timeBlock.startTime-a.timeBlock.startTime)
    // console.log(allSlots)
// Function to calculate the average of numbers
  function avg(arr: number[]) {
    let sum = 0;

    // Iterate the elements of the array
    arr.forEach(function (item, idx) {
      if(item<4) {
        item = item+24
      }
        sum += item;
    });
    let average = sum/arr.length
    if(average>24) {
      average = average-24
    }
    // Returning the average of the numbers
    return average;
  }
    const averageSleepTime = avg(sleepHours)
    const averageWakeTime = avg(wakeHours)
    console.log(averageSleepTime, averageWakeTime)
    setAvgSleepTime(averageSleepTime)
    setAvgWakeTime(averageWakeTime)
  }
  useEffect(() => {
    console.log('Use Effect hook triggered; custom activities changed from CustomSet')
    createDurationSummary();
    createWeekDurationStats();
  }, [justActivities]);
  useEffect(() => {
    createFinalArray();
  }, [justActivities])
  useEffect(() => {
    createSleepStats();
  }, [])
  return {finalArray: useAppContext().finalArray, durationSummary: useAppContext().durationSummary, weekDurationSummary: useAppContext().weekDurationSummary, avgSleepTime: useAppContext().avgSleepTime, avgWakeTime: useAppContext().avgWakeTime}
};


export {useCustomSet}