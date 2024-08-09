import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { setDoc, doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/firebase/firebase';
import { useAuth } from './AuthContext'; // Assume you have a context for auth
import { DateTime } from 'luxon';
import {Activity, ButtonState} from '@/Types/ActivityTypes'

interface AppContextProps {
  activities: Activity[];
  dateIncrement: number;
  setDateIncrement: React.Dispatch<React.SetStateAction<number>>;
  updateActivity: (activity: Activity, updates: Partial<Activity>) => void;
  moveActivity: (activity: Activity, updates: Partial<Activity>) => void;
  addActivity: (activity: Activity) => void;
  addCustomActivity: (button: ButtonState) => void;
  removeActivity: (id: string | null, activ: Activity | null) => void;
}

interface AppProviderProps {
  children: ReactNode;
}


const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [dateIncrement, setDateIncrement] = useState(0);
  const { user } = useAuth(); // Get the authenticated user from your auth context
// Function to update an activity
const updateActivity = async (activity: Activity, updates: Partial<Activity>) => {
  //if start time's date is different, then after updating the times, call a diff function, moveactivity and pass in the updated one to change date ref.
  try {
    if(user) {
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
    console.log('Activity updated successfully!');
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
    } else {
      console.log('No valid timeBlock update provided!');
    }
  } catch (error) {
    console.error('Error moving activity: ', error);
  }
};
const addCustomActivity = async (button: ButtonState) => {
  if (user) {
    try {
      const activityRef = doc(firestore, `users/${user.uid}/customActivities`, button.text); // Using activity name as ID, or you can generate a random ID
      const newActivity = {
        ...button,
      };

      await setDoc(activityRef, newActivity);
      console.log("Custom activity added successfully");
    } catch (error) {
      console.error("Error adding custom activity: ", error);
    }
  } else {
    console.log("No user logged in");
  }
};
  const addActivity = async (activity: Activity) => {
    try {
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
  
      setTimeout(() => {
        setActivities(prevActivities =>
          prevActivities.some(act => act.id === activity.id)
            ? prevActivities // Avoid adding duplicates
            : [...prevActivities, activity] // Add new activity
        );
      }, 0); // Delay the state update to avoid updating during rendering
    } catch (error) {
      console.error('Error adding activity to Firestore:', error);
    }
  };  

  const removeActivity = async (id: string | null, activ: Activity | null) => {
    try {
      if(user) {
        if(id) {
        const activity = activities.find(act => act.id===id)
        if(activity) {
        const startDate = new Date(activity.timeBlock.startTime * 1000).toISOString().split('T')[0];
        await deleteDoc(doc(firestore, 'users', user.uid, 'dates', startDate, 'activities', id));
        }
        setTimeout(() => {
          setActivities(prevActivities => 
            prevActivities.filter(act => act.id !== id)
          );
          }, 0); // Delay the state update to avoid updating during rendering
      }
      else if(activ ){
        const startDate = new Date(activ.timeBlock.startTime * 1000).toISOString().split('T')[0];
        console.log(startDate)
        await deleteDoc(doc(firestore, 'users', user.uid, 'dates', startDate, 'activities', activ.id));

        setTimeout(() => {
        // Update state with a filler
        setActivities(prevActivities => {
          const filteredActivities = prevActivities.filter(act => act.id !== activ.id);
          // Add a filler entry to force a re-render
          return [...filteredActivities, { button: {icon: "car", iconLibrary: "antDesign", id: 'filler-', keywords: ["stroll"], pressed: false, text: "Driving"}, id: "filler2", timeBlock: {duration: 0, endTime: 2, startTime: 3} }];
        });

          }, 0); // Delay the state update to avoid updating during rendering
      }

    }
    } catch (error) {
    console.error('Error adding activity to Firestore:', error);
    }
  };

  return (
    <AppContext.Provider value={{ activities, dateIncrement, setDateIncrement, addActivity, addCustomActivity, updateActivity, moveActivity, removeActivity }}>
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
