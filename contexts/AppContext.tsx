import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { setDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/firebase/firebase';
import { useAuth } from './AuthContext'; // Assume you have a context for auth

interface ButtonState {
  text: string;
  pressed: boolean;
}
interface TimeBlock {
  startTime: number,   // Unix timestamp for the start time
  duration: number,    // Duration in seconds
  endTime: number      // Unix timestamp for the end time (startTime + duration)
}
interface Activity {
  id: string;
  button: ButtonState;
  timeBlock: TimeBlock;
}

interface AppContextProps {
  activities: Activity[];
  addActivity: (activity: Activity) => void;
  removeActivity: (id: string | null, activ: Activity | null) => void;
}

interface AppProviderProps {
  children: ReactNode;
}


const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const { user } = useAuth(); // Get the authenticated user from your auth context

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
    <AppContext.Provider value={{ activities, addActivity, removeActivity }}>
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
