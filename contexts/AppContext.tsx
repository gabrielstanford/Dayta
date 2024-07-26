import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';

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
  removeActivity: (id: string) => void;
}

interface AppProviderProps {
  children: ReactNode;
}


const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>([]);

  const addActivity = (activity: Activity) => {
    setTimeout(() => {
      setActivities(prevActivities =>
        prevActivities.some(act => act.id === activity.id)
          ? prevActivities // Avoid adding duplicates
          : [...prevActivities, activity] // Add new activity
      );
    }, 0); // Delay the state update to avoid updating while page is rendering
  };

  const removeActivity = (id: string) => {
    setTimeout(() => {
    setActivities(prevActivities => 
      prevActivities.filter(act => act.id !== id)
    );
  }, 0);
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
