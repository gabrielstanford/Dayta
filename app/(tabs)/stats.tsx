import { StyleSheet, View, Dimensions } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import DashboardChart from '@/components/DashboardChart'
import {useEffect, useState} from 'react'
const { width, height } = Dimensions.get('window');
const buttonWidth = width/6.25
import { collection, onSnapshot, getDocs } from 'firebase/firestore';
import {firestore} from '@/firebase/firebase'
import {useAuth} from '@/contexts/AuthContext'
import getFilteredActivityRefs from '@/Data/HandleTime'

// Define a type for the counts object
interface ValueCounts {
  [key: string]: number;
}

// Utility function to count value occurrences
const countValues = (array: string[]): ValueCounts => {
  return array.reduce((acc: ValueCounts, value: string) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
};
function Recommendations() {
  
  const { user } = useAuth();
  const [dbActivities, setDbActivities] = useState<any>(null);
  const activities = ['walk', 'coffee', 'chores']
  const frequency = [1, 1, 5]
  const [version, setVersion] = useState(0)
 
  // useEffect(() => {
    
  //   if (user) {
  //     const filtActivities = getFilteredActivityRefs();
  //     const activitiesRef1 = collection(firestore, 'users', user.uid, 'dates', filtActivities[0], 'activities');
  //     const activitiesRef2 = collection(firestore, 'users', user.uid, 'dates', filtActivities[1], 'activities');
      
  //     // Arrays to hold fetched activities
  //     const userActivities1: any[] = [];
  //     const userActivities2: any[] = [];
  
  //     // Set up snapshot listeners
  //     const unsubscribeFromRef1 = onSnapshot(activitiesRef1, (snapshot1) => {
  //       userActivities1.length = 0; // Clear the array
  //       snapshot1.forEach((doc) => {
  //         userActivities1.push({ id: doc.id, ...doc.data() });
  //       });
  //       userActivities1.filter(act => act.timeBlock.startTime>filtActivities[3])
  //       updateActivities(); // Call updateActivities when data is fetched
  //     }, (error) => {
  //       console.error('Error fetching activities from ref1:', error);
  //     });
  
  //     const unsubscribeFromRef2 = onSnapshot(activitiesRef2, (snapshot2) => {
  //       userActivities2.length = 0; // Clear the array
  //       snapshot2.forEach((doc) => {
  //         userActivities2.push({ id: doc.id, ...doc.data() });
  //       });
  //       userActivities1.filter(act => act.timeBlock.startTime<filtActivities[4])
  //       updateActivities(); // Call updateActivities when data is fetched
  //     }, (error) => {
  //       console.error('Error fetching activities from ref2:', error);
  //     });
  
  //     // Function to handle merging and updating state
  //     const updateActivities = () => {
  //       // Merge arrays
  //       const allActivities = [
  //         ...userActivities1,
  //         ...userActivities2
  //       ];
  
  //       // Sort by startTime
  //       allActivities.sort((a, b) => a.timeBlock.startTime - b.timeBlock.startTime);
  
  //       // Update state with the sorted activities
  //       setDbActivities(allActivities);
  //     };
  
  //     // Clean up the listeners when the component unmounts or dependencies change
  //     return () => {
  //       unsubscribeFromRef1();
  //       unsubscribeFromRef2();
  //     };
  //   }
  // }, [user, version]);
  
  const [activityText, setActivityText] = useState<string[]>([]);

  useEffect(() => {
    // Use async function inside useEffect
    const fetchActivities = async () => {
      try {
        const activities = await getAllActivitiesForUser(user);

        // Map the activities to extract text
        const texts = activities.map(activity => activity.button.text);

        // Update state
        setActivityText(texts);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchActivities();
  }, [user]); // Dependency array, re-run effect if `user` changes

  const activityCounts = countValues(activityText)
  return (
    <View style={styles.layoutContainer}>
      <View style={styles.titleContainer}>
        <ThemedText type="titleText">Statistics</ThemedText>
      </View>
      <View style={styles.chartContainer}>
          <DashboardChart x={Object.keys(activityCounts)} y={Object.values(activityCounts)}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layoutContainer: {
    flex: 1,
    paddingTop: height/18,
    backgroundColor: 'darkcyan',
    position: 'relative', // Container must be relative for absolute positioning of child
  },
  contentContainer: {
    flex: 1,
    paddingBottom: height/11.6, // Space at the bottom to accommodate the button
  },
  titleContainer: {
    alignItems: 'center',
    padding: 10,
  },
  chartContainer: {
    width: width
  },
});

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

  try {
    // Step 1: Get all dates
    if(user) {
    const datesRef = collection(firestore, 'users', user.uid, 'dates');
    const datesSnapshot = await getDocs(datesRef);
    const dates = datesSnapshot.docs.map(doc => doc.id);

    // Step 2: Get activities for each date
    const activities: Activity[] = [];
    for (const date of dates) {
      const activitiesRef = collection(firestore, 'users', user.uid, 'dates', date, 'activities');
      const activitiesSnapshot = await getDocs(activitiesRef);
      activitiesSnapshot.docs.forEach(doc => {
        // Adjust the type casting if your activity has a different structure
        activities.push(doc.data() as Activity);
      });
    }
    return activities;
    }
    else {
      return []
    }
  } catch (error) {
    console.error("Error fetching activities:", error);
    throw error;
  }
}

export default Recommendations;