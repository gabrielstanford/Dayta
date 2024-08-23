import getAllActivitiesForUser from '@/Data/GetAllActivities'
import {useEffect, useState} from 'react'
import {useAuth} from '@/contexts/AuthContext'
import { useAppContext } from '@/contexts/AppContext'
import {ButtonState, ActivitySummary, Activity} from '@/Types/ActivityTypes'
import getFiltered from './HandleTime'
import { act } from 'react-test-renderer'
import { DateTime } from 'luxon'
import { normalize } from '@rneui/themed'
import FetchDayActivities from './FetchDayActivities'

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
  const {customActivities, justActivities, updateState, setFinalArray, state, dateIncrement} = useAppContext();
  const {user} = useAuth();
  const [todayActs, setTodayActs] = useState<Activity[]>([])
  const {tagDurationSum} = state
  const [textKeys, setTextKeys] = useState<string[]>([])
  //this function performs two main things: 
  //1. It creates an array containing just the text and tags of all the activities
  //3. It calculates statistics based on this
  //2. it fetches the 9 buttons to display based on this as well
  const createDurationSummary = () => {    
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
      updateState({durationSummary: result});

      const activityCounts = countValues(activityText);
      const entries = Object.entries(activityCounts);
      entries.sort(([, valueA], [, valueB]) => valueB - valueA);
      const topEntries = entries.slice(0, 9);
      const sortedDictTop = Object.fromEntries(topEntries);
      const textKeys = Object.keys(sortedDictTop);
      setTextKeys(textKeys)

  };

  const createTagDurationSum = () => {
      const activityTags = justActivities.map((activity) => activity.button.tags);
      // console.log(activityTags)
        // Step 1: Group activities by name and sum durations

          const totalDurationPerTag = justActivities.reduce<Record<string, number>>((acc, activity) => {
            // Iterate over each tag in the current activity
            
            if(activity.button.tags) {
              
            activity.button.tags.forEach(tag => {
              const normalizedTag = tag.trim().toLowerCase();
              if(normalizedTag=='Other') {
                console.log('Normalized tag: ', normalizedTag)
              }
              if (acc[normalizedTag] && normalizedTag!=="null") {
                // If the tag already exists, add the duration to the existing value
                acc[normalizedTag] += activity.timeBlock.duration / 3600; // Convert seconds to hours
              } else {
                // If the tag does not exist, initialize it with the duration
                if(normalizedTag!=="null")
                acc[normalizedTag] = activity.timeBlock.duration / 3600; // Convert seconds to hours
              }
            });
            return acc;
            }
            else {
              console.log("No Tags: ", activity)
              return acc
            }
          }, {});

        const result: ActivitySummary[] = Object.entries(totalDurationPerTag).map(([text, totalDuration]) => ({
          text,
          totalDuration,
        }));
        updateState({tagDurationSum: result});

  }

  const createFinalArray = () => {
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
    updateState({weekDurationSummary: result});
  }

  const createDailyAverageStats = () => {
    const startTimes = justActivities.map(act => act.timeBlock.startTime)
    const minStart = Math.min(...startTimes)
    let maxStart = Math.max(...startTimes)
    const now = (Math.floor(Date.now() / 1000))
    if(maxStart>now) {
      maxStart = now
    }
    const minStartDate = DateTime.fromSeconds(minStart);
    const maxStartDate = DateTime.fromSeconds(maxStart);
    let emptyDayCount: number = 0
    
    for(let x = minStart; x < maxStart; x += 86400) {
      if(startTimes.filter(time => time>x && time<x+86400).length<2) {
        emptyDayCount=emptyDayCount+1
      }
    }
    const diffInDays = maxStartDate.startOf('day').diff(minStartDate.startOf('day'), 'days').days;
    const daysToAvgBy = diffInDays-emptyDayCount;
    const avgDailyTimeByTag = tagDurationSum.map(item => ({
      text: item.text,
      totalDuration: item.totalDuration / daysToAvgBy,
    }));
    updateState({avgTimeByTag: avgDailyTimeByTag})
  }

  const analyzeTodayStats = () => {
    console.log('analyzing')
    console.log('Today Activities:', todayActs);

    const totalDurationPerTag = todayActs.reduce<Record<string, number>>((acc, activity) => {
      // Iterate over each tag in the current activity
      
      if(activity.button.tags) {
      activity.button.tags.forEach(tag => {
        console.log(tag)
        const normalizedTag = tag.trim().toLowerCase();
        if (acc[normalizedTag] && normalizedTag!=="null") {
          // If the tag already exists, add the duration to the existing value
          acc[normalizedTag] += activity.timeBlock.duration / 3600; // Convert seconds to hours
        } else {

          // If the tag does not exist, initialize it with the duration
          if(normalizedTag!=="null") {
          acc[normalizedTag] = activity.timeBlock.duration / 3600; // Convert seconds to hours
          }
        }
      });
      return acc;
      }
      else {
        console.log("No Tags: ", activity)
        return acc
      }
    }, {});
  const result: ActivitySummary[] = Object.entries(totalDurationPerTag).map(([text, totalDuration]) => ({
    text,
    totalDuration,
  }));
  console.log('Result: ', result);
  updateState({todayTagDurationSum: result})
  }

  const createSleepStats = () => {
    const allSleepSlots = justActivities.filter(act => act.button.text=="Went To Bed" )
    const allWakeSlots = justActivities.filter(act => act.button.text=="Woke Up")


    const sleepInfo = allSleepSlots.map(sleepSlot => sleepSlot.timeBlock.startTime)
    const wakeInfo = allWakeSlots.map(wakeSlot => wakeSlot.timeBlock.startTime)

    const sleepHours = sleepInfo.map(slot => (new Date(slot * 1000)).getHours())
    const wakeHours = wakeInfo.map(slot => (new Date(slot * 1000)).getHours())
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

  const generateDateArray = () => {
    //get earliest date in sleep, turn that into a date increment
    // let startDate = -12
    let elements: any[] = [];
    let summaryStats: any[] = []
    for (let startDate = -12 ; startDate <= 0; startDate++) {
      let element = getFiltered(startDate);
      const filteredSleep = sleepInfo.filter(num => (num>element[2] && num<element[3]))
      const filteredWake = wakeInfo.filter(num => (num>element[2] && num<element[3]))
      element = [...element, filteredWake, filteredSleep]
      elements = [...elements, element]
      summaryStats = [...summaryStats, [element[0], element[4], element[5]]]
    }
    
    return summaryStats
    }
    const sumStats = generateDateArray();
    updateState({sleepSum: sumStats})

    const averageSleepTime = avg(sleepHours)
    const averageWakeTime = avg(wakeHours)
    updateState({avgSleepTime: averageSleepTime})
    updateState({avgWakeTime: averageWakeTime})
  }
  useEffect(() => {
    if(justActivities.length>0) {
    createDurationSummary();
    createWeekDurationStats();
    createTagDurationSum();
    createDailyAverageStats();
    }
  }, [justActivities]);

  useEffect(() => {
    createFinalArray();
  }, [textKeys])
  useEffect(() => {
    if(justActivities.length>0) {
    createSleepStats();
    }
  }, [])
  useEffect(() => {
    setTimeout(() => {
      if(justActivities)
      FetchDayActivities(user, dateIncrement, justActivities, setTodayActs)
    }, 50)
  }, [dateIncrement, justActivities])
  useEffect(() => {
    if (todayActs.length > 0) {
      console.log('rerun')
      analyzeTodayStats();
    }
  }, [todayActs]); // This will re-run whenever todayActs changes

  return {finalArray: useAppContext().finalArray, state: useAppContext().state}
};


export {useCustomSet}