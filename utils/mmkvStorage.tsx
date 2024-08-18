import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'dayta-storage',
});

// Function to store a test activity
const saveTestActivity = (activity: string) => {
    storage.set('testActivity', activity);
  };
  
  // Function to retrieve the test activity
  const getTestActivity = (): string | undefined => {
    return storage.getString('testActivity');
  };