import { collection, getDocs } from 'firebase/firestore';
import {firestore} from '@/firebase/firebase'

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

const getAllActivitiesForUser = async (user: any): Promise<Activity[]> => {

    // try {
    //   // Step 1: Get all dates
    //   if(user) {
    //   const datesRef = collection(firestore, 'users', user.uid, 'dates');
    //   const datesSnapshot = await getDocs(datesRef);
    //   const dates = datesSnapshot.docs.map(doc => doc.id);
  
    //   // Step 2: Get activities for each date
    //   const activities: Activity[] = [];
    //   for (const date of dates) {
    //     const activitiesRef = collection(firestore, 'users', user.uid, 'dates', date, 'activities');
    //     const activitiesSnapshot = await getDocs(activitiesRef);
    //     activitiesSnapshot.docs.forEach(doc => {
    //       // Adjust the type casting if your activity has a different structure
    //       activities.push(doc.data() as Activity);
    //     });
    //   }
    //   return activities;
    //   }
    //   else {
    //     return []
    //   }
    // } catch (error) {
    //   console.error("Error fetching activities:", error);
    //   throw error;
    // }
    console.log('tried to reference database in getAllActivitiesForUser')
    return []
  }

  export default getAllActivitiesForUser