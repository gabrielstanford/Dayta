import { collection, onSnapshot, getDocs } from 'firebase/firestore';
import {firestore} from '@/firebase/firebase'
import { ButtonState } from '@/Types/ActivityTypes';

const fetchCustomActivities = async (user: any, setActivityButtons: any) => {
    if (user) {
      try {
        const activitiesRef = collection(firestore, `users/${user.uid}/customActivities`);
        const snapshot = await getDocs(activitiesRef);
  
        const customActivities = snapshot.docs.map(doc => doc.data() as ButtonState[]);
        setActivityButtons((prevButtons: ButtonState[]) => [...prevButtons, ...customActivities]);
      } catch (error) {
        console.error("Error fetching custom activities: ", error);
      }
    } else {
      console.log("No user logged in");
    }
  };
  