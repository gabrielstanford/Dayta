import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextProps {
  text: string;
  setText: (text: string) => void;
}

interface AppProviderProps {
  children: ReactNode;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [text, setText] = useState('');

  console.log('AppProvider rendered');

  return (
    <AppContext.Provider value={{ text, setText }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    console.error('useAppContext must be used within an AppProvider');
    throw new Error('useAppContext must be used within an AppProvider');
  }
  console.log('useAppContext accessed');
  return context;
};
