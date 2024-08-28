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
  const [textKeys, setTextKeys] = useState<string[]>([]);
  const [morningKeys, setMorningKeys] = useState<string[]>([])
  const [afternoonKeys, setAfternoonKeys] = useState<string[]>([])
  const [eveningKeys, setEveningKeys] = useState<string[]>([])
  //this function performs two main things: 
  //1. It creates an array containing just the text and tags of all the activities
  //3. It calculates statistics based on this
  //2. it fetches the 9 buttons to display based on this as well
  const getLocalHours = (time: number) => {
    const date = new Date(time*1000);
    const hours = date.getHours();
    return hours;
  }

  const createTODStats = () => {
    const relevantActivities = justActivities.filter(act => act!==null && act.timeBlock.startTime>1722988800)
    const morningActs = relevantActivities.filter(act => getLocalHours(act.timeBlock.startTime)>=4 && getLocalHours(act.timeBlock.startTime)<12)
    const afternoonActs = relevantActivities.filter(act => getLocalHours(act.timeBlock.startTime)>=12 && getLocalHours(act.timeBlock.startTime)<19)
    const eveningActs = relevantActivities.filter(act => (getLocalHours(act.timeBlock.startTime)>=19 && getLocalHours(act.timeBlock.startTime)<24) || (getLocalHours(act.timeBlock.startTime)>=0 && getLocalHours(act.timeBlock.startTime)<4))
    const morningText = morningActs.map((activity) => activity.button.text);
    const afternoonText = afternoonActs.map((activity) => activity.button.text);
    const eveningText = eveningActs.map((activity) => activity.button.text);
      //create value counts for each phase of the day and give it its own text key values
      const morningCounts = countValues(morningText);
      const morningEntries = Object.entries(morningCounts);
      morningEntries.sort(([, valueA], [, valueB]) => valueB - valueA);
      const topMorning = morningEntries.slice(0, 9);
      const morningSortedTop = Object.fromEntries(topMorning);
      const morningTextKeys = Object.keys(morningSortedTop);
      //set morning keys so I'll be able to access it when fetching final array
      setMorningKeys(morningTextKeys)
      const afternoonCounts = countValues(afternoonText);
      const afternoonEntries = Object.entries(afternoonCounts);
      afternoonEntries.sort(([, valueA], [, valueB]) => valueB - valueA);
      const topAfternoon = afternoonEntries.slice(0, 9);
      const afternoonSortedTop = Object.fromEntries(topAfternoon);
      const afternoonTextKeys = Object.keys(afternoonSortedTop);
      //set morning keys so I'll be able to access it when fetching final array
      setAfternoonKeys(afternoonTextKeys)
      const eveningCounts = countValues(eveningText);
      const eveningEntries = Object.entries(eveningCounts);
      eveningEntries.sort(([, valueA], [, valueB]) => valueB - valueA);
      const topEvening = eveningEntries.slice(0, 9);
      const eveningSortedTop = Object.fromEntries(topEvening);
      const eveningTextKeys = Object.keys(eveningSortedTop);
      //set morning keys so I'll be able to access it when fetching final array

      setEveningKeys(eveningTextKeys)
  }
  const createDurationSummary = () => {   

      const relevantActivities = justActivities.filter(act =>  act!==null && act.timeBlock.startTime>1722988800 && act.timeBlock.duration!==undefined)
      //maybe tinker with what the cutoff is; perhaps it should be lunch
      
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
      const relevantActs = justActivities.filter((activity) => activity!==null && activity.timeBlock.duration!==undefined);
        // Step 1: Group activities by name and sum durations

          const totalDurationPerTag = relevantActs.reduce<Record<string, number>>((acc, activity) => {
            // Iterate over each tag in the current activity
            
            if(activity.button.tags) {
              const tag = activity.button.tags[0]
            // activity.button.tags.forEach(tag => {
              const normalizedTag = tag.trim().toLowerCase();
              if (acc[normalizedTag] && normalizedTag!=="null") {
                // If the tag already exists, add the duration to the existing value
                acc[normalizedTag] += activity.timeBlock.duration / 3600; // Convert seconds to hours
              } else {
                // If the tag does not exist, initialize it with the duration
                if(normalizedTag!=="null")
                acc[normalizedTag] = activity.timeBlock.duration / 3600; // Convert seconds to hours
              }
            // });
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
    let correspondingKeys: string[] = textKeys
    const currentDate = new Date();
    const hours = currentDate.getHours();

    //note that this runs once prematurely (before the text keys initialize, though it shouldn't cause any glitches)
    if(hours>=4 && hours<12) {
      if(morningKeys.length>0) {
        correspondingKeys = morningKeys;
      }
    }
    else if(hours>=12 && hours<19) {
      if(afternoonKeys.length>0) {
        correspondingKeys = afternoonKeys;
      }

    }
    else if((hours>=19 && hours<24) || (hours>=0 && hours<4)) {
      if(eveningKeys.length>0) {
        correspondingKeys = eveningKeys;
      }
    }
    else {
      alert("Error fetching phase of day")
    }
    const correspondingButtons = customActivities.filter((button) =>
      correspondingKeys.includes(button.text)
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
    const relevantActivities = justActivities.filter(act => act!==null && act.timeBlock.startTime>getUnixTimestampMinusOneWeek() && act.timeBlock.duration!==undefined)
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
    const relevantActivities = justActivities.filter(act => act!==null && act.timeBlock.duration!==undefined)
    const startTimes = relevantActivities.map(act => act.timeBlock.startTime)
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
  
    const relevantActs = todayActs.filter(act => act!==null && act.timeBlock.duration!==undefined)
    const totalDurationPerTag = relevantActs.reduce<Record<string, number>>((acc, activity) => {
      // Iterate over each tag in the current activity
      
      if(activity.button.tags) {
        const tag = activity.button.tags[0];
      // activity.button.tags.forEach(tag => {
        const normalizedTag = tag.trim().toLowerCase();
        // if(normalizedTag=="work/study") {
        //   console.log('work activity: ', activity)
        // }
        // else {
        //   console.log('activity: ', activity.button.text, 'tag: ', normalizedTag)
        // }
        if (acc[normalizedTag] && normalizedTag!=="null") {
          // If the tag already exists, add the duration to the existing value
          acc[normalizedTag] += activity.timeBlock.duration / 3600; // Convert seconds to hours
        } else {

          // If the tag does not exist, initialize it with the duration
          if(normalizedTag!=="null") {
          acc[normalizedTag] = activity.timeBlock.duration / 3600; // Convert seconds to hours
          }
        }
      // });
      return acc;
      }
      else {
        return acc
      }
    }, {});
  const result: ActivitySummary[] = Object.entries(totalDurationPerTag).map(([text, totalDuration]) => ({
    text,
    totalDuration,
  }));
  updateState({todayTagDurationSum: result})
  }

  const createSleepStats = () => {
    const relevantActivities = justActivities.filter(act => act!==null && act.timeBlock.startTime>1722988800)

    const allSleepSlots = justActivities.filter(act => act.button.text=="Went To Bed" )
    const allWakeSlots = justActivities.filter(act => act.button.text=="Woke Up")


    const sleepInfo = allSleepSlots.map(sleepSlot => sleepSlot.timeBlock.startTime)
    const wakeInfo = allWakeSlots.map(wakeSlot => wakeSlot.timeBlock.startTime)

    const sleepHours = sleepInfo.map(slot => (new Date(slot * 1000)).getHours())
    const wakeHours = wakeInfo.map(slot => (new Date(slot * 1000)).getHours())
    // const allSlots = justActivities.filter(act => act.button.text=="Went To Bed" || act.button.text=="Woke Up")
    // allSlots.sort((a, b) => b.timeBlock.startTime-a.timeBlock.startTime)
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
    let sumElements: any[]=[]
    let summaryStats: any[] = [];
    let summaryDurs: any[] = [];
    for (let startDate = -12 ; startDate <= 0; startDate++) {

      let element = getFiltered(startDate);
      const filteredSleep = sleepInfo.filter(num => (num>element[2] && num<element[3]))
      const filteredWake = wakeInfo.filter(num => (num>element[2] && num<element[3]))
      const filteredActs = relevantActivities.filter(act => act.timeBlock.startTime>element[2] && act.timeBlock.startTime<element[3] && act.timeBlock.duration!==undefined)
      const justDurs = filteredActs.map(act => act.timeBlock.duration)
      const sum = justDurs.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      const summedElement = [...element, sum]
      element = [...element, filteredWake, filteredSleep ]
      elements = [...elements, element]
      sumElements = [...sumElements, summedElement]
      summaryStats = [...summaryStats, [element[0], element[4], element[5]]]
      summaryDurs = [...summaryDurs, [summedElement[0], summedElement[4]]]

    }
    
    return {summaryStats, summaryDurs}
    }
    const {summaryStats, summaryDurs} = generateDateArray();
    const averageSleepTime = avg(sleepHours)
    const averageWakeTime = avg(wakeHours)
    updateState({sleepSum: summaryStats, summaryDurs: summaryDurs, avgSleepTime: averageSleepTime, avgWakeTime: averageWakeTime})
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
  }, [eveningKeys])
  useEffect(() => {
    if(justActivities.length>0) {
    createSleepStats();
    }
    
  }, [])
  useEffect(() => {
    createTODStats();
  }, [justActivities])
  useEffect(() => {
    setTimeout(() => {
      if(justActivities)
      FetchDayActivities(user, dateIncrement, justActivities, setTodayActs, true)
    }, 50)
  }, [dateIncrement, justActivities])
  useEffect(() => {
    if (todayActs.length > 0) {
      analyzeTodayStats();
    }
  }, [todayActs]); // This will re-run whenever todayActs changes

  return {finalArray: useAppContext().finalArray, state: useAppContext().state}
};


export {useCustomSet}