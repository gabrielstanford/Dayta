import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { setDoc, doc, getDoc, updateDoc, deleteDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/firebase/firebase';
import { useAuth } from './AuthContext'; // Assume you have a context for auth
import { DateTime } from 'luxon';
import {Activity, ButtonState, DatedActivities, ActivitySummary} from '@/Types/ActivityTypes'
import {ActivityButtons, shuffle} from '@/Data/FetchCustomActivities';
import { storage } from '@/utils/mmkvStorage';
import {useCustomSet} from '@/Data/CustomSet'

interface AppContextProps {
  justActivities: Activity[];
  allActivities: DatedActivities[];
  dateIncrement: number;
  setDateIncrement: React.Dispatch<React.SetStateAction<number>>;
  updateActivity: (activity: Activity, updates: Partial<Activity>) => void;
  customActivities: ButtonState[];
  setUpdateLocalStorage: React.Dispatch<React.SetStateAction<boolean>>;
  moveActivity: (activity: Activity, updates: Partial<Activity>) => void;
  addActivity: (activity: Activity) => void;
  addCustomActivity: (button: ButtonState) => void;
  removeActivity: (activ: Activity) => void;
  durationSummary: ActivitySummary[];
  setDurationSummary: React.Dispatch<React.SetStateAction<ActivitySummary[]>>;
  finalArray: ButtonState[];
  setFinalArray: React.Dispatch<React.SetStateAction<ButtonState[]>>;
  weekDurationSummary: ActivitySummary[];
  avgSleepTime: number;
  setAvgSleepTime: React.Dispatch<React.SetStateAction<number>>;
  avgWakeTime: number;
  setAvgWakeTime: React.Dispatch<React.SetStateAction<number>>
  setWeekDurationSummary: React.Dispatch<React.SetStateAction<ActivitySummary[]>>;
}

interface AppProviderProps {
  children: ReactNode;
}


const AppContext = createContext<AppContextProps | undefined>(undefined);
console.log('running context')
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [justActivities, setJustActivities] = useState<Activity[]>([]);
  const [allActivities, setAllActivities] = useState<DatedActivities[]>([]);
  const [customActivities, setCustomActivities] = useState<ButtonState[]>([]);
  const [dateIncrement, setDateIncrement] = useState(0);
  const [updateLocalStorage, setUpdateLocalStorage] = useState(false);
  const [finalArray, setFinalArray] = useState<ButtonState[]>([])
  const [durationSummary, setDurationSummary] = useState<ActivitySummary[]>([]);
  const [avgSleepTime, setAvgSleepTime] = useState<number>(0.111)
  const [avgWakeTime, setAvgWakeTime] = useState<number>(0.111)
  const [weekDurationSummary, setWeekDurationSummary] = useState<ActivitySummary[]>([])
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

const moveActivity = async (
  activity: Activity,
  updates: Partial<Activity>
) => {
  if (!user) {
    console.log('User is not authenticated.');
    return;
  }

  try {
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
          endTime: updates.timeBlock.endTime,
        },
        updatedAt: serverTimestamp(), // Optional: add an update timestamp
      };

      // Copy the activity data to the new location
      await setDoc(newActivityRef, updatedActivityData);
      console.log('Activity moved successfully!');

      // Delete the original activity document
      await deleteDoc(currentActivityRef);
      console.log('Original activity document deleted successfully!');

      // Update or create the new date document with a timestamp
      await setDoc(newDateRef, { createdAt: serverTimestamp() }, { merge: true });
      console.log('New date document updated successfully!');
      if(updateLocalStorage) {
        setUpdateLocalStorage(false)}
    } else {
      console.log('No valid timeBlock update provided!');
    }
  } catch (error) {
    console.error('Error moving activity: ', error);
  }
};

// useEffect(() => {
//   console.log('customActivities in AppProvider: ', customActivities);
// }, [customActivities]);
  const addActivityToDate = (date: string, activity: Activity) => {
    // setAllActivities(prevDates => {
    //   const existingDate = prevDates.find(d => d.date === date);
    //   if (existingDate) {
    //     return prevDates.map(d => 
    //       d.date === date
    //         ? { ...d, activities: [...d.activities, activity] }
    //         : d
    //     );
    //   } else {
    //     return [...prevDates, { date, activities: [activity] }];
    //   }
    // });
  };

useEffect(() => {

  const initializeActivityData = async () => {
    
    if(user) {
        console.log('Initializing Activities')
        if(storage.getString('JustActivities') && !updateLocalStorage) {
          console.log('Found storage immediately')
          if(justActivities.length==0) {
            console.log('justActivities length=0')
          const justActivitiesTemp = JSON.parse(storage.getString('JustActivities') as string)
          console.log('setting activities')
          setJustActivities(justActivitiesTemp as Activity[])
          }
          console.log('justActivities length>0')
        }
        else {
          console.log('Didnt find local storage')
        // Step 1: Get all dates
        const datesRef = collection(firestore, 'users', user.uid, 'dates');
        const datesSnapshot = await getDocs(datesRef);
        const dates = datesSnapshot.docs.map(doc => doc.id);
        const activityTemp: Activity[] = [];
        // Step 2: Get activities for each date and group them
        for (const date of dates) {
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
        console.log('Local Storage Not Found')
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
 
  initializeActivityData();
  initializeCustomActivities();
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

  const addCustomActivity = async (button: ButtonState) => {
    try {
      setCustomActivities(prevButtons => [...prevButtons, button] // Add new activity
      );
      storage.set('CustomActivities', JSON.stringify([...customActivities, button]))
      console.log('completed setting custom activities')
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
    <AppContext.Provider value={{ justActivities, allActivities, dateIncrement, customActivities, setDateIncrement, setUpdateLocalStorage, addActivity, addCustomActivity, updateActivity, moveActivity, removeActivity, durationSummary, setDurationSummary, weekDurationSummary, setWeekDurationSummary, avgSleepTime, setAvgSleepTime, avgWakeTime, setAvgWakeTime, finalArray, setFinalArray }}>
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
