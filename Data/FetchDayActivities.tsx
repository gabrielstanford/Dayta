import { collection, onSnapshot, getDocs } from 'firebase/firestore';
import {firestore} from '@/firebase/firebase'
import getFilteredActivityRefs from '@/Data/HandleTime'
import { storage } from '@/utils/mmkvStorage';
import { Activity, ActivityWithEnd } from '@/Types/ActivityTypes';

function FetchDayActivities(user: any, dateIncrement: number, justActivities: Activity[], setDbActivities: any, ends: boolean) {
    if (user) {
      if(justActivities.length>0) {
                // Function to get filtered activity references
                const filtActivities = getFilteredActivityRefs(dateIncrement);
                const relevant = justActivities.filter(act => act!==null &&  act.timeBlock != null)
                if(!ends) {

                  const arrayEnd: ActivityWithEnd[] = relevant.filter((act): act is Activity & {timeBlock: {endTime: number}} => act.timeBlock.endTime!=null) 
                const dayActivitiesWithEnd: ActivityWithEnd[] = arrayEnd.filter(act => (act.timeBlock.startTime>=filtActivities[2] && act.timeBlock.startTime<=filtActivities[3]))
                  // Sort by startTime
                  
                  dayActivitiesWithEnd.sort((a, b) => a.timeBlock.endTime - b.timeBlock.endTime);
              
                  // Update state with the sorted activities
                  //set local storage
                  // storage.set('testActivity', 'First Storage Test');

                  setDbActivities(dayActivitiesWithEnd);
                }
                else {
                  const dayActivities: Activity[] = relevant.filter(act => (act.timeBlock.startTime>=filtActivities[2] && act.timeBlock.startTime<=filtActivities[3]))
                  setDbActivities(dayActivities);
                }
      }
      else {
        
        // // Function to get filtered activity references
        // const filtActivities = getFilteredActivityRefs(dateIncrement);
        // const activitiesRef1 = collection(firestore, 'users', user.uid, 'dates', filtActivities[0], 'activities');
        // const activitiesRef2 = collection(firestore, 'users', user.uid, 'dates', filtActivities[1], 'activities');
        
        // // Arrays to hold fetched activities
        // let userActivities1: any[] = [];
        // let userActivities2: any[] = [];
    
        // // Set up snapshot listeners
        // const unsubscribeFromRef1 = onSnapshot(activitiesRef1, (snapshot1) => {
        //   userActivities1.length = 0; // Clear the array
        //   snapshot1.forEach((doc) => {
        //     userActivities1.push({ id: doc.id, ...doc.data() });
        //   });
        //   userActivities1 = userActivities1.filter(act => act.timeBlock.startTime>=filtActivities[2])
        //   updateActivities(); // Call updateActivities when data is fetched
        // }, (error) => {
        //   console.error('Error fetching activities from ref1:', error);
        // });
    
        // const unsubscribeFromRef2 = onSnapshot(activitiesRef2, (snapshot2) => {
        //   userActivities2.length = 0; // Clear the array
        //   snapshot2.forEach((doc) => {
        //     userActivities2.push({ id: doc.id, ...doc.data() });
        //   });
        //   userActivities2 = userActivities2.filter(act => act.timeBlock.startTime<=filtActivities[3])
        //   updateActivities(); // Call updateActivities when data is fetched
        // }, (error) => {
        //   console.error('Error fetching activities from ref2:', error);
        // });
    
        // // Function to handle merging and updating state
        // const updateActivities = () => {
        //   // Merge arrays
        //   const allActivities = [
        //     ...userActivities1,
        //     ...userActivities2
        //   ];
    
        //   // Sort by startTime
        //   allActivities.sort((a, b) => a.timeBlock.endTime - b.timeBlock.endTime);
    
        //   // Update state with the sorted activities
        //   //set local storage
        //   storage.set('testActivity', 'First Storage Test');
        //   setDbActivities(allActivities);
        // };
    
        // // Clean up the listeners when the component unmounts or dependencies change
        // return () => {
        //   unsubscribeFromRef1();
        //   unsubscribeFromRef2();
        // };
      }
    }
}

export default FetchDayActivities