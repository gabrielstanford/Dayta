import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';

interface ButtonState {
  text: string;
  pressed: boolean;
}

interface AppContextProps {
  activities: ButtonState[];
  addActivity: (activity: ButtonState) => void;
}

interface AppProviderProps {
  children: ReactNode;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [activities, setActivities] = useState<ButtonState[]>([]);

  //I had to create useeffect and be a little clever here. The idea is:
  //it only updates the state AFTER mymodal is done rendering, not at the same time.
  const pendingActivityRef = useState<ButtonState | null>(null);

  const addActivity = (activity: ButtonState) => {
    setTimeout(() => {
      setActivities(prevActivities => [...prevActivities, activity]);
    }, 0); // Delay the state update
  };

  return (
    <AppContext.Provider value={{ activities, addActivity }}>
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
