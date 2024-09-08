import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { setDoc, doc, getDoc, updateDoc, deleteDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/firebase/firebase';
import { useAuth } from './AuthContext'; // Assume you have a context for auth
import { DateTime } from 'luxon';
import {Activity, ButtonState, DatedActivities, ActivitySummary, StatisticsState, Routine} from '@/Types/ActivityTypes'
import {ActivityButtons, shuffle} from '@/Data/FetchCustomActivities';
import { storage } from '@/utils/mmkvStorage';
import {useCustomSet} from '@/Data/CustomSet'
import FetchDayActivities from '@/Data/FetchDayActivities';

type UpdateState = (newState: Partial<StatisticsState>) => void;
interface AppContextProps {
  justActivities: Activity[];
  allActivities: DatedActivities[];
  dateIncrement: number;
  setDateIncrement: React.Dispatch<React.SetStateAction<number>>;
  updateActivity: (activity: Activity, updates: Partial<Activity>) => void;
  updateCustomActivities: (customAct: ButtonState, updates: Partial<ButtonState>) => void;
  updateRoutine: (routine: Routine, updates: Partial<Routine>) => void;
  customActivities: ButtonState[];
  removeCustomAct: (customAct: ButtonState) => void;
  setUpdateLocalStorage: React.Dispatch<React.SetStateAction<boolean>>;
  moveActivity: (activity: Activity, updates: Partial<Activity>) => void;
  addActivity: (activity: Activity) => void;
  addCustomActivity: (button: ButtonState) => void;
  addCustomRoutine: (routine: Routine) => void;
  addRoutineActivities: (activities: Activity[]) => void;
  customRoutines: Routine[];
  removeActivity: (activ: Activity) => void;
  removeRoutine: (rout: Routine) => void;
  // durationSummary: ActivitySummary[];
  // setDurationSummary: React.Dispatch<React.SetStateAction<ActivitySummary[]>>;
  finalArray: ButtonState[];
  setFinalArray: React.Dispatch<React.SetStateAction<ButtonState[]>>;
  state: StatisticsState;
  updateState: UpdateState;
}

interface AppProviderProps {
  children: ReactNode;
}


const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [justActivities, setJustActivities] = useState<Activity[]>([]);
  const [dayActivities, setDayActivities] = useState<Activity[]>([]);
  const [allActivities, setAllActivities] = useState<DatedActivities[]>([]);
  const [customActivities, setCustomActivities] = useState<ButtonState[]>([]);
  const [customRoutines, setCustomRoutines] = useState<Routine[]>([]);
  const [dateIncrement, setDateIncrement] = useState(0);
  const [updateLocalStorage, setUpdateLocalStorage] = useState(false);
  const [finalArray, setFinalArray] = useState<ButtonState[]>([])

  const initialState: StatisticsState = {
    durationSummary: [] as ActivitySummary[],
    avgSleepTime: 0.111,
    avgWakeTime: 0.111,
    weekDurationSummary: [] as ActivitySummary[],
    sleepSum: [] as any[],
    tagDurationSum: [] as ActivitySummary[],
    avgTimeByTag: [] as ActivitySummary[],
    todayTagDurationSum: [] as ActivitySummary[],
    summaryDurs: [] as [string, number][],
    avgLoggedTimeDaily: 0.111
  };

  const [state, setState] = useState(initialState);
  const updateState = (newState: Partial<typeof initialState>) => {
    setState(prevState => ({ ...prevState, ...newState }));
  };
  
  // const [durationSummary, setDurationSummary] = useState<ActivitySummary[]>([]);
  // const [avgSleepTime, setAvgSleepTime] = useState<number>(0.111)
  // const [avgWakeTime, setAvgWakeTime] = useState<number>(0.111)
  // const [weekDurationSummary, setWeekDurationSummary] = useState<ActivitySummary[]>([]);
  // const [sleepSum, setSleepSum] = useState<any[]>([])
  const { user } = useAuth(); // Get the authenticated user from your auth context

// Function to update an activity
const updateActivity = async (activity: Activity, updates: Partial<Activity>) => {
  //if start time's date is different, then after updating the times, call a diff function, moveactivity and pass in the updated one to change date ref.
  try {
    if(user) {
    // Update the timeBlock of the relevant activity
      const updatedActivities = justActivities.map((act) => {
        if (act.id === activity.id) {
          return {
            ...act,
            ...updates, // Spread the input properties to update the matching activity
          };
        }
        return act;
      });
      // Set the updated array
      setJustActivities(updatedActivities);
      storage.set('JustActivities', JSON.stringify(updatedActivities))
    // Convert the start time to the date format used in Firestore
    const startDate = new Date(activity.timeBlock.startTime * 1000).toISOString().split('T')[0];
    const dateRef = doc(firestore, 'users', user.uid, 'dates', startDate);
    const activityRef = doc(dateRef, 'activities', activity.id);
    
    // Add a timestamp to the updates
    const updatedFields = {
      ...updates,
      updatedAt: serverTimestamp(), // Optional: add an update timestamp
    };

    // Update the activity document
    await updateDoc(activityRef, updatedFields);
  }
  } catch (error) {
    console.error('Error updating activity: ', error);
  }
};

const updateRoutine = async (routine: Routine, updates: Partial<Routine>) => {
  //if start time's date is different, then after updating the times, call a diff function, moveactivity and pass in the updated one to change date ref.
  try {
    
    // Update the timeBlock of the relevant activity
    
      const updatedRoutines = customRoutines.map((rout) => {
        if (rout.name === routine.name) {
          return {
            ...routine,
            ...updates, // Spread the input properties to update the matching activity
          };
        }
        return rout;
      });
      // Set the updated array
      setCustomRoutines(updatedRoutines);
      storage.set('CustomRoutines', JSON.stringify(updatedRoutines))
    // Convert the start time to the date format used in Firestore
    
    if(user) {
      const routineRef = doc(firestore, 'users', user.uid, 'customRoutines', routine.name)

    const updatedFields = {
      ...updates,
      updatedAt: serverTimestamp(), // Optional: add an update timestamp
    };

    // Update the activity document
    await updateDoc(routineRef, updatedFields);
  }
  } catch (error) {
    console.error('Error updating activity: ', error);
  }
};

const updateCustomActivities = async (customAct: ButtonState, updates: Partial<ButtonState>) => {
  try {
    if(user) {
    // Update the timeBlock of the relevant activity
      const updatedActs = customActivities.map((act) => {

        if (act === customAct) {
          return {
            ...act,
            ...updates, // Spread the input properties to update the matching activity
          };
        }
        return act;
      });
      // Set the updated array
      setCustomActivities(updatedActs);
      storage.set('CustomActivities', JSON.stringify(updatedActs))

    const activityRef = doc(firestore, 'users', user.uid, 'customActivities', customAct.text);
    
    // Add a timestamp to the updates
    const updatedFields = {
      ...updates,
      updatedAt: serverTimestamp(), // Optional: add an update timestamp
    };

    // Update the activity document
    await updateDoc(activityRef, updatedFields);
  }
  } catch (error) {
    console.error('Error updating activity: ', error);
  }
}

const moveActivity = async (
  activity: Activity,
  updates: Partial<Activity>
) => {
  if (!user) {
    console.log('User is not authenticated.');
    return;
  }

  try {
    const updatedActivities = justActivities.map((act) => {
      if (act.id === activity.id) {
        return {
          ...act,
          ...updates, // Spread the input properties to update the matching activity
        };
      }
      return act;
    });
    // Set the updated array
    setJustActivities(updatedActivities);
    storage.set('JustActivities', JSON.stringify(updatedActivities))
    const currentStartDate = new Date(activity.timeBlock.startTime * 1000).toISOString().split('T')[0];
    
    if (updates.timeBlock && updates.timeBlock.startTime) {
      const newStartDate = new Date(updates.timeBlock.startTime * 1000).toISOString().split('T')[0];

      // References to the current and new date documents
      const currentDateRef = doc(firestore, 'users', user.uid, 'dates', currentStartDate);
      const newDateRef = doc(firestore, 'users', user.uid, 'dates', newStartDate);

      // References to the current and new activity documents
      const currentActivityRef = doc(currentDateRef, 'activities', activity.id);
      const newActivityRef = doc(newDateRef, 'activities', activity.id);

      // Fetch the current activity data
      const activityDoc = await getDoc(currentActivityRef);
      if (!activityDoc.exists()) {
        console.error('Activity does not exist!');
        return;
      }

      const activityData = activityDoc.data();

      // Add the updated timeBlock to the activity data
      const updatedActivityData = {
        ...activityData,
        timeBlock: {
          startTime: updates.timeBlock.startTime,
          duration: updates.timeBlock.duration,
          endTime: updates.timeBlock.endTime,
        },
        updatedAt: serverTimestamp(), // Optional: add an update timestamp
      };

      // Copy the activity data to the new location
      await setDoc(newActivityRef, updatedActivityData);

      // Delete the original activity document
      await deleteDoc(currentActivityRef);

      // Update or create the new date document with a timestamp
      await setDoc(newDateRef, { createdAt: serverTimestamp() }, { merge: true });
      if(updateLocalStorage) {
        setUpdateLocalStorage(false)}
    } else {
      console.log('No valid timeBlock update provided!');
    }
  } catch (error) {
    console.error('Error moving activity: ', error);
  }
};

useEffect(() => {

  const initializeActivityData = async () => {
    
    if(user) {
        if(storage.getString('JustActivities') && !updateLocalStorage) {
          if(justActivities.length==0) {
          const justActivitiesTemp = JSON.parse(storage.getString('JustActivities') as string)
          setJustActivities(justActivitiesTemp as Activity[])
          }
        }
        else {
        // Step 1: Get all dates
        const datesRef = collection(firestore, 'users', user.uid, 'dates');
        const datesSnapshot = await getDocs(datesRef);
        const dates = datesSnapshot.docs.map(doc => doc.id);
        const filteredDates = dates.filter(date => date > '2024-08-07');
        // console.log(filteredDates)
        const activityTemp: Activity[] = [];
        // Step 2: Get activities for each date and group them
        for (const date of filteredDates) {
          const activitiesRef = collection(firestore, 'users', user.uid, 'dates', date, 'activities');
          const activitiesSnapshot = await getDocs(activitiesRef);
          // const activities: Activity[] = activitiesSnapshot.docs.map(doc => doc.data() as Activity);
          
          activitiesSnapshot.docs.forEach(doc => {
            // Adjust the type casting if your activity has a different structure
            activityTemp.push(doc.data() as Activity);
          });
          // Add each activity to the context, grouped by date
          // activities.forEach(activity => {
          //   addActivityToDate(date, activity);
          // });
        }

        setJustActivities(activityTemp)
        storage.set('JustActivities', JSON.stringify(activityTemp))
        if(updateLocalStorage) {
        setUpdateLocalStorage(false)}
        }
  }
  };

  const initializeCustomActivities = async () => {
    if(user) {
      if(storage.getString('CustomActivities') && !updateLocalStorage) {
        if(customActivities.length==0) {
        const customActivitiesTemp = JSON.parse(storage.getString('CustomActivities') as string)
        setCustomActivities(customActivitiesTemp as ButtonState[])
        }
      }
      else {
        const activitiesRef = collection(firestore, `users/${user.uid}/customActivities`);
        const snapshot = await getDocs(activitiesRef);
  
        const databaseCustom: ButtonState[] = snapshot.docs.map(doc => doc.data() as ButtonState);
        let activityButtons: ButtonState[] = ActivityButtons
        if(databaseCustom.length>0) {
        activityButtons = [...activityButtons, ...databaseCustom]
        activityButtons = shuffle(activityButtons)
        }
        setCustomActivities(activityButtons)
        storage.set('CustomActivities', JSON.stringify(activityButtons))
      }
    }
  }

  const initializeCustomRoutines = async () => {
    if(user) {
      if(storage.getString('CustomRoutines') && !updateLocalStorage) {
        if(customRoutines.length==0) {
        const customRoutinesTemp = JSON.parse(storage.getString('CustomRoutines') as string)
        setCustomRoutines(customRoutinesTemp as Routine[])
        }
      }
      else {
        const routinesRef = collection(firestore, `users/${user.uid}/customRoutines`);
        const routinesSnapshot = await getDocs(routinesRef);
        const tempCustomRoutines: Routine[] = routinesSnapshot.docs.map(doc => doc.data() as Routine);
        setCustomRoutines(tempCustomRoutines);
        storage.set('CustomRoutines', JSON.stringify(tempCustomRoutines))
      }
    }
  }
 
  initializeActivityData();
  initializeCustomActivities();
  initializeCustomRoutines();
}, [user, updateLocalStorage]);

  const addActivity = async (activity: Activity) => {
    try {
      setJustActivities(prevActivities =>
        prevActivities.some(act => act.id === activity.id)
          ? prevActivities // Avoid adding duplicates
          : [...prevActivities, activity] // Add new activity
      );
      storage.set('JustActivities', JSON.stringify([...justActivities, activity]))
      if (user) {
        const startDate = new Date(activity.timeBlock.startTime * 1000).toISOString().split('T')[0];
        const dateRef = doc(firestore, 'users', user.uid, 'dates', startDate);
        const activityRef = doc(dateRef, 'activities', activity.id);
  
        // Update or create the date document with a timestamp
        await setDoc(dateRef, { createdAt: serverTimestamp() }, { merge: true });
  
        // Save the activity to the activities subcollection
        await setDoc(activityRef, {
          ...activity,
          createdAt: serverTimestamp(), // Optional: add timestamp to the activity
        });
      }

    } catch (error) {
      console.error('Error adding activity to Firestore:', error);
    }
  };  
  const addRoutineActivities = async (activities: Activity[]) => {
    try {
      for(let i=0; i< activities.length; i++) {
      const tempAct = activities[i]
      setJustActivities(prevActivities => {
        const prev = prevActivities.some(act => act.id === tempAct.id)
        if(prev) {
          alert("duplicate!")
        }
        return (prev
          ? prevActivities // Avoid adding duplicates
          : [...prevActivities, tempAct])} // Add new activity
      );
    }
    storage.set('JustActivities', JSON.stringify([...justActivities, activities[0], activities[1], activities[2], activities[3]]))
    if (user) {
         // Get the start date from the first activity
        const startDate = new Date(activities[0].timeBlock.startTime * 1000).toISOString().split('T')[0];
          
        // Reference to the date document
        const dateRef = doc(firestore, 'users', user.uid, 'dates', startDate);

        // Update or create the date document with a timestamp
        await setDoc(dateRef, { createdAt: serverTimestamp() }, { merge: true });

        // Iterate over the activities array and save each one to the activities subcollection
        for (const activity of activities) {
          const activityRef = doc(dateRef, 'activities', activity.id);
          await setDoc(activityRef, {
            ...activity,
            createdAt: serverTimestamp(), // Optional: add timestamp to the activity
          });
        }
    }
    }
    catch {

    }
  }

  const addCustomActivity = async (button: ButtonState) => {
    try {
      setCustomActivities((prevButtons: ButtonState[]) => {
        const prev = prevButtons.some(oldButton => oldButton.text === button.text)
        if(prev) {
          alert("duplicate!")
        }
        if(!prev) {
          storage.set('CustomActivities', JSON.stringify([...customActivities, button]))
        }
        return (!prev ?
          [...prevButtons, button] : [...prevButtons])});
        if (user) {
        // storage.set('ShuffledActivities', JSON.stringify(newActivities))
        // storage.set('CustomActivities', JSON.stringify([...customActivities, button]))
        //first add to context, in background add to local storage/database
        const activityRef = doc(firestore, 'users', user.uid, 'customActivities', button.text); // Using activity name as ID, or you can generate a random ID
        const newActivity = {
          ...button,
        };
  
        await setDoc(activityRef, newActivity);
        
        // await fetchActivities();
        // console.log('Activities Fetched')
      }

      } catch (error) {
      console.error("Error adding custom activity: ", error);
      }
  };

  const addCustomRoutine = async (routine: Routine) => {
    try {
      setCustomRoutines((prevRouts: Routine[]) => {
        const prev = prevRouts.some(rout => rout.name === routine.name)
        if(prev) {
          alert("duplicate!")
        }
        if(!prev) {
          storage.set('CustomRoutines', JSON.stringify([...customRoutines, routine]))
        }
        return (!prev ?
          [...prevRouts, routine] : [...prevRouts])});
        if (user) {
        //first add to context, in background add to local storage/database
        const routineRef = doc(firestore, 'users', user.uid, 'customRoutines', routine.name); // Using routine name as ID
        const newRoutine = {
          ...routine,
        };
        await setDoc(routineRef, newRoutine);
        
        // await fetchActivities();
        // console.log('Activities Fetched')
      }

      } catch (error) {
      console.error("Error adding custom routine: ", error);
      }
  };

  const removeCustomAct = async (customAct: ButtonState) => {
    try {
      setCustomActivities(prevCustomActs => prevCustomActs.filter(button => button.text !== customAct.text));
      storage.set('CustomActivities', JSON.stringify(customActivities.filter(button => button.text !== customAct.text)))
      if(user) {

        await deleteDoc(doc(firestore, 'users', user.uid, 'customActivities', customAct.text));

    }
    } catch (error) {
    console.error('Error adding activity to Firestore:', error);
    }
  };

  const removeRoutine = async (rout: Routine) => {
    try {
      setCustomRoutines(prevRouts => prevRouts.filter(prevRoutine => prevRoutine.name !== rout.name));
      storage.set('CustomRoutines', JSON.stringify(customRoutines.filter(routine => routine.name !== rout.name)))
      if(user) {

        await deleteDoc(doc(firestore, 'users', user.uid, 'customRoutines', rout.name));

      }
    } catch (error) {
    console.error('Error removing routine:', error);
    }
  };

  const removeActivity = async (activ: Activity) => {
    try {
      setJustActivities(prevActivities => prevActivities.filter(act => act.id !== activ.id));
      storage.set('JustActivities', JSON.stringify(justActivities.filter(act => act.id !== activ.id)))
      if(user) {
        const startDate = new Date(activ.timeBlock.startTime * 1000).toISOString().split('T')[0];
        await deleteDoc(doc(firestore, 'users', user.uid, 'dates', startDate, 'activities', activ.id));

    }
    } catch (error) {
    console.error('Error adding activity to Firestore:', error);
    }
  };
  return (
    <AppContext.Provider value={{ justActivities, allActivities, dateIncrement, customActivities, setDateIncrement, setUpdateLocalStorage, addActivity, addCustomActivity, removeCustomAct, addCustomRoutine, customRoutines, addRoutineActivities, updateActivity, updateRoutine, moveActivity, removeActivity, removeRoutine, updateCustomActivities, state, updateState, finalArray, setFinalArray }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
