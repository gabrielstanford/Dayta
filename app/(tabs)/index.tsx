import { StyleSheet, Pressable, View, Dimensions, FlatList, Text, TouchableOpacity} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useState, useEffect } from 'react';
import {AntDesign, MaterialIcons} from '@expo/vector-icons';
import MyModal from '@/components/MyModal'
import { AppProvider, useAppContext } from '@/contexts/AppContext';
import { collection, onSnapshot, getDocs } from 'firebase/firestore';
import {firestore} from '@/firebase/firebase'
import {useAuth} from '@/contexts/AuthContext'
import getFilteredActivityRefs from '@/Data/HandleTime'

// Get screen width. This is for more responsive layouts
const { width, height } = Dimensions.get('window');
const buttonWidth = width/6.25

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

const convertUnixToTimeString = (startTime: number, endTime: number): string => {
  // Create a Date object from the Unix timestamp
  const date = new Date(startTime * 1000); // Convert seconds to milliseconds
  const endDate = new Date(endTime * 1000)
  //change timezones to convert to local
  const offset = date.getTimezoneOffset();
  const zonedUTCStartTime = new Date(date.getTime() - offset * 60000);
  const zonedUTCEndTime = new Date(endDate.getTime() - offset * 60000);
  //this function is a bit confusing, but startTime is always what will be returned; end time is only for
  //deciding whether to show the AM/PM at the end (takes extra space if both are am/pm)
  // Get hours and minutes in UTC
  let hours = zonedUTCStartTime.getUTCHours(); // Use UTC hours to avoid time zone issues
  let endHours = zonedUTCEndTime.getUTCHours();
  const minutes = zonedUTCStartTime.getUTCMinutes();

  // Determine AM or PM
  const periodStart = hours < 12 ? 'AM' : 'PM';
  const periodEnd = endHours < 12 ? 'AM' : 'PM';

  // Convert hours from 24-hour to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // Hour '0' should be '12'

  // Format minutes to always have two digits
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  // Construct the formatted time string
  if(endTime>0 && periodEnd==periodStart)
  return `${hours}:${formattedMinutes}`;
  else
  return `${hours}:${formattedMinutes} ${periodStart}`;
};

interface ActivityItemProps {
  activity: Activity;
  onpress: (activity: Activity) => void 
}

const ActivityItem = ({ activity, onpress }: ActivityItemProps) => {

  return (
  
  <View style={styles.activityContainer}>
    <View style={styles.timeContainer}>
      <Text style={styles.timeText}>{convertUnixToTimeString(activity.timeBlock.startTime, activity.timeBlock.endTime)}</Text>
      <Text style={styles.timeText}> - </Text>
      <Text style={styles.timeText}>{convertUnixToTimeString(activity.timeBlock.endTime, 0)}</Text>
    </View>
    <Text style={styles.activityName}>{activity.button.text}</Text>
      <Pressable onPress={() => onpress(activity)}>
     <MaterialIcons name="delete" size={width/15} color="black" />
     </Pressable>
  </View>
);}

function Journal() {

  const { user } = useAuth();
  const [dbActivities, setDbActivities] = useState<any>(null);
  const [version, setVersion] = useState(0)
  const { removeActivity } = useAppContext();
  const remove = (act: Activity) => {
    removeActivity(null, act);
    setVersion(prevVersion => prevVersion + 1)
  }

  useEffect(() => {
    console.log('running journal effect', version);
    
    if (user) {
      // Function to get filtered activity references
      const filtActivities = getFilteredActivityRefs();
      const activitiesRef1 = collection(firestore, 'users', user.uid, 'dates', filtActivities[0], 'activities');
      const activitiesRef2 = collection(firestore, 'users', user.uid, 'dates', filtActivities[1], 'activities');
      
      // Arrays to hold fetched activities
      const userActivities1: any[] = [];
      const userActivities2: any[] = [];
  
      // Set up snapshot listeners
      const unsubscribeFromRef1 = onSnapshot(activitiesRef1, (snapshot1) => {
        userActivities1.length = 0; // Clear the array
        snapshot1.forEach((doc) => {
          userActivities1.push({ id: doc.id, ...doc.data() });
        });
        userActivities1.filter(act => act.timeBlock.startTime>filtActivities[3])
        updateActivities(); // Call updateActivities when data is fetched
      }, (error) => {
        console.error('Error fetching activities from ref1:', error);
      });
  
      const unsubscribeFromRef2 = onSnapshot(activitiesRef2, (snapshot2) => {
        userActivities2.length = 0; // Clear the array
        snapshot2.forEach((doc) => {
          userActivities2.push({ id: doc.id, ...doc.data() });
        });
        userActivities1.filter(act => act.timeBlock.startTime<filtActivities[4])
        updateActivities(); // Call updateActivities when data is fetched
      }, (error) => {
        console.error('Error fetching activities from ref2:', error);
      });
  
      // Function to handle merging and updating state
      const updateActivities = () => {
        // Merge arrays
        const allActivities = [
          ...userActivities1,
          ...userActivities2
        ];
  
        // Sort by startTime
        allActivities.sort((a, b) => a.timeBlock.startTime - b.timeBlock.startTime);
  
        // Update state with the sorted activities
        setDbActivities(allActivities);
      };
  
      // Clean up the listeners when the component unmounts or dependencies change
      return () => {
        unsubscribeFromRef1();
        unsubscribeFromRef2();
      };
    }
  }, [user, version]);
  
  //toggle the state of the modal
    const [modalVisible, setModalVisible] = useState(false);
    const toggleModal = () => setModalVisible(!modalVisible)

  return (
    
      <View style={styles.layoutContainer}>
        <MyModal visible={modalVisible} onClose={toggleModal} />
        <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <ThemedText type="titleText">My Journal</ThemedText>
        </View>
        {dbActivities ? 
        <FlatList 
        data={dbActivities}
        renderItem={({ item }) => <ActivityItem activity={item} onpress={remove}/>}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        />
          : 
          <></>}
        </View>
        <View style={styles.plusButtonContainer}>
          <Pressable onPress={toggleModal}>
            <AntDesign name="pluscircle" size={width/6.25} color="black" />
          </Pressable>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
 //colors darkcyan, mintcream, bisque
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
container: {
  flex: 1,
  backgroundColor: '#f0f0f0',
  paddingTop: 20,
},
listContent: {
  paddingHorizontal: 20,
},
activityContainer: {
  flex: 1,
  backgroundColor: '#fff',
  borderRadius: 10,
  padding: 15,
  marginTop: 10,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  flexDirection: 'row',
  alignItems: 'center',
},
timeContainer: {
  flex: 3,
  flexDirection: 'row',
  flexWrap: 'nowrap',
},
timeText: {
  fontSize: 13,
  flexWrap: 'nowrap',
  color: '#333',
},
activityName: {
  flex: 3,
  fontSize: 16,
  fontWeight: 'bold',
},
plusButtonContainer: {
    position: 'absolute', // Absolute positioning to overlay everything
    bottom: height/40.6, // Space from the bottom of the container
    left: (width / 2) - (buttonWidth / 2), // Center horizontally more precisely
    width: buttonWidth
},
});

const styles2 = StyleSheet.create({

})

const Index: React.FC = () => {
  return (
    <AppProvider>
      <Journal />
    </AppProvider>
  );
};

export default Index;