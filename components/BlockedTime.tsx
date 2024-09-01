import { StyleSheet, View, Dimensions, FlatList, Text, TouchableOpacity, NativeSyntheticEvent, NativeScrollEvent} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useState, useEffect, useRef, RefObject} from 'react';
import {AntDesign, MaterialIcons, Ionicons} from '@expo/vector-icons';
import MyModal from '@/components/MyModal'
import { AppProvider, useAppContext } from '@/contexts/AppContext';
import { collection, onSnapshot, getDocs } from 'firebase/firestore';
import {firestore} from '@/firebase/firebase'
import {useAuth} from '@/contexts/AuthContext'
import getFilteredActivityRefs from '@/Data/HandleTime'
import FetchDayActivities from '@/Data/FetchDayActivities'
import ActivityDescribeModal from '@/components/ActivityDescribeModal'
import { Activity } from '@/Types/ActivityTypes';
// Get screen width. This is for more responsive layouts
const { width, height } = Dimensions.get('window');
const buttonWidth = width/6.25

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
  TimeActPair: TimeActiviesPair;
  onTap: (activity: Activity) => void
}
interface BlockProps {
  activity: Activity;
  onTap: () => void;
}
const colors = [
    '#FF6347', // Tomato
    '#FFD700', // Gold
    '#32CD32', // LimeGreen
    '#1E90FF', // DodgerBlue
    '#FF1493', // DeepPink
    '#FF4500', // OrangeRed
    '#7FFF00', // Chartreuse
    '#00CED1', // DarkTurquoise
    '#e32954', // light red
    '#1cd487', //light green - social
    '#9F2B68', // Amaranth (purplish)
  ];
const ActivityBlock = ({ activity, onTap}: BlockProps) => {

    let i = 8;
      let specialButton = false
  if(activity.button.text=='Woke Up' || activity.button.text=='Went To Bed') {
    specialButton=true
  }
  if(activity.button.tags?.includes('Work/Study')) {
    i = 0;
  }
  else if(activity.button.tags?.includes('Food/Drink')) {
    i = 1;
  }
  else if(activity.button.tags?.includes('Food/Drink') || activity.button.tags?.includes('Physical') || activity.button.tags?.includes('Outdoor')) {
    i = 2;
  }
  else if(activity.button.tags?.includes('Relax')) {
    i = 3;
  }
  else if(activity.button.tags?.includes('Music')) {
    i = 4;
  }
  else if(activity.button.tags?.includes('Entertainment')) {
    i = 5;
  }
  else if(activity.button.tags?.includes('Travel/Commute')) {
    i = 6;
  }
  else if(activity.button.tags?.includes('Hobbies')) {
    i = 7;
  }
  else if(activity.button.tags?.includes('Chores')) {
    i = 8;
  }
  else if(activity.button.tags?.includes('Social')) {
    i = 9;
  }
  else if(activity.button.tags?.includes('Other')) {
    i = 10;
  }
//   else {
//     console.log('Activity: ', activity.button.text, 'Is Untagged', 'But tag is: ', activity.button.tags)
//   }
//   if(i!=8) {
//     console.log('Activity: ', activity.button.text, 'Is Tagged! Tag is: ', activity.button.tags)
//   }
  
  //calculate height and margin based on minute differences
  const buttonHeight=activity.timeBlock.duration/40;
//   const color = colors[i]
  return(
  <View style={[styles.activityContainer, {height: buttonHeight, backgroundColor: colors[i], marginBottom: 0}]}>
    <View style={styles.detailsContainer}>
      <TouchableOpacity onPress={onTap} style={styles.touchableContent}>
        {/* <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{convertUnixToTimeString(activity.timeBlock.startTime, activity.timeBlock.endTime)}</Text>
          <Text style={styles.timeText}> - </Text>
          <Text style={styles.timeText}>{convertUnixToTimeString(activity.timeBlock.endTime, 0)}</Text>
        </View> */}
        <Text style={styles.activityName}></Text>
      </TouchableOpacity>
    </View>
  </View>
)};

const ActivityList: React.FC<ActivityItemProps> = ({ TimeActPair, onTap}) => {

  return (
  <View style={styles.timeActivityPairContainer}>
    <View style={{flex: 5, flexDirection: 'column'}}>
    {TimeActPair.activities.map((activity, index) => (
      <ActivityBlock
        key={index}
        activity={activity}
        onTap={() => onTap(activity)}
      />
    ))}
  </View>
  </View>
)};


interface TimeActiviesPair {
  time: number;
  activities: Activity[];
}
interface TimeRange {
  time: number;
  minTime: number;
  maxTime: number;
}

const setMinutesToZero = (unixTimestamp: number) => {
    // Create a Date object from the Unix timestamp (which is in seconds)
    const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
  
    // Set minutes, seconds, and milliseconds to zero
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    
    // Convert the Date object back to a Unix timestamp (in seconds)
    return Math.floor(date.getTime() / 1000); // Convert milliseconds to seconds
}
function BlockedTime() {

    const { user } = useAuth();
    const [dbActivities, setDbActivities] = useState<any>(null);
    const [activityInfo, setActivityInfo] = useState<Activity>()
    const { justActivities, dateIncrement } = useAppContext();
    const [activityDescribeVisible, setActivityDescribeVisible] = useState<boolean>(false);

  useEffect(() => {
    FetchDayActivities(user, dateIncrement, justActivities, setDbActivities, false)

  }, [user, justActivities, dateIncrement]);
const getActivityTimeDiffPairs = (range: TimeRange) => {
  const arrayActs: Activity[] = dbActivities.filter((activity: Activity) => activity.timeBlock.startTime >= range.minTime && activity.timeBlock.startTime <= range.maxTime)
//   let indices = []
//   for(let i =0; i<arrayActs.length; i++) {
//   indices = dbActivities.findIndex((act: Activity) => act.id === arrayActs[i].id);
//   }
  return arrayActs
}

let result: TimeActiviesPair[] = [];
// let timeDifferences: number[] = [];
if(dbActivities && dbActivities[0]) {
//   timeDifferences = dbActivities.slice(0, -1).map((activity: Activity, index: number) => {
//     const nextActivity = dbActivities[index + 1];
//     return (nextActivity.timeBlock.startTime - activity.timeBlock.endTime);
//   });
const dayStartHour = setMinutesToZero(dbActivities[0].timeBlock.startTime)
  const timeRanges: TimeRange[] = [
    { time: 1, minTime: dayStartHour, maxTime: (dayStartHour + 14400) },
    { time: 2, minTime: (dayStartHour + 14400), maxTime: (dayStartHour + 28800)  },
    { time: 3, minTime: (dayStartHour + 28800), maxTime: (dayStartHour + 43200) },
    { time: 4, minTime: (dayStartHour + 43200), maxTime: (dayStartHour + 57600) }
  ];
  result = timeRanges.map((range) => ({
    time: range.time,
    activities: getActivityTimeDiffPairs(range),
  }));
  }

  //toggle the state of the modal
    const [modalVisible, setModalVisible] = useState(false);
    const toggleModal = () => setModalVisible(!modalVisible)
    const list2Ref: RefObject<FlatList> = useRef(null);
    // const list1Ref = useRef<FlatList>(null);
    useEffect(() => {
      const timer = setTimeout(() => {
        // list1Ref.current?.scrollToEnd({ animated: true });
        list2Ref.current?.scrollToEnd({ animated: true });
      }, 100); // Slight delay to ensure list is rendered
  
      // Clean up the timer if the component unmounts
      return () => clearTimeout(timer);
    }, [dbActivities]); // Empty dependency array ensures this runs only on initial render

    const activityTapped = (activity: Activity) => {
      if(activity.button.text=="Multi-Activity") {
        alert("Multi activity")
      }
      else {
        setActivityInfo(activity)
      }
      setActivityDescribeVisible(true);
    }
  
  return (
    
      <View style={styles.layoutContainer}>
        <MyModal visible={modalVisible} onClose={toggleModal} />
        {activityInfo && <ActivityDescribeModal style={styles.durationModal} ActivityDescribeVisible={activityDescribeVisible} Info={activityInfo} onClose={() => setActivityDescribeVisible(false)} onTapOut={() => setActivityDescribeVisible(false)}/>}
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
              <View style={styles.titleContainer}>
                <ThemedText type="titleText">Blocked Time</ThemedText>
              </View>
        </View>

        {/* <FlatList
        ref={list1Ref}
        data={["9:00 AM", '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM']}
        renderItem={({ item }) => <Text style={styles.timeText}>{item}</Text>}
        keyExtractor={(item) => item}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        /> */}
        {dbActivities ? 
        <View style={styles.listContent}>
          <FlatList 
          ref={list2Ref}
          data={result}
          renderItem={({ item }) => <ActivityList TimeActPair={item} onTap={activityTapped}/>}
          keyExtractor={(item) => item.time}
          />
        </View>
          : <>
            {/* <ThemedText type="subtitle">
              Add Your First Activity For The Day!
            </ThemedText> */}
          </>}
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
   paddingBottom: height/9, // Space at the bottom to accommodate the button
 },
 headerContainer: {
   marginHorizontal: width/13,
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
 },
 titleContainer: {
   padding: 10,
 },
 incrementButtonContainer: {
   backgroundColor: 'white'
 },
 timeActivityPairContainer: {
  flex: 1,
  flexDirection: 'row'
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
   borderRadius: 10,
   padding: 0,
   marginTop: 0,
   shadowColor: '#000',
   shadowOpacity: 0.1,
   shadowRadius: 10,
   shadowOffset: { width: 0, height: 4 },
   flexDirection: 'row',
   alignItems: 'center',
 },
 detailsContainer: {
   flex: 1, // Allows this section to take up the remaining space
 },
 touchableContent: {
   flexDirection: 'row',
   alignItems: 'center',
 },
 timeContainer: {
   flex: 2.5,
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
 durationModal: {
   flex: 1
 },
 plusButtonContainer: {
     position: 'absolute', // Absolute positioning to overlay everything
     bottom: height/40.6, // Space from the bottom of the container
     left: (width / 2) - (buttonWidth / 2), // Center horizontally more precisely
     width: buttonWidth
 },
 });
 
 const styles2 = StyleSheet.create({
   activityContainer: {
     flex: 3,
     backgroundColor: 'darkturquoise',
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
     flex: 2.5,
     flexDirection: 'row',
     flexWrap: 'nowrap',
   },
 })

export default BlockedTime;
