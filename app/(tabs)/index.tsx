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


// Get screen width. This is for more responsive layouts
const { width, height } = Dimensions.get('window');
const buttonWidth = width/6.25

type ButtonState = {
  text: string;
  iconLibrary: string;
  icon: string;
  pressed: boolean;
  keywords: string[];
  tags?: string[];
  id?: string;
};
interface TimeBlock {
  startTime: number,   // Unix timestamp for the start time
  duration: number,    // Duration in seconds
  endTime: number      // Unix timestamp for the end time (startTime + duration)
}
interface Activity {
  id: string;
  button: ButtonState;
  timeBlock: TimeBlock;
  Multi?: Activity[]
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
  TimeActPair: TimeActiviesPair;
  onRemove: (activity: Activity) => void 
  onTap: (activity: Activity) => void
}
interface BlockProps {
  activity: Activity;
  onRemove: () => void;
  onTap: () => void;
}
const ActivityBlock = ({ activity, onRemove, onTap }: BlockProps) => {
      let specialButton = false
  if(activity.button.text=='Woke Up' || activity.button.text=='Went To Bed') {
    specialButton=true
  }
  return(
  <View style={styles.activityContainer}>
    <View style={styles.detailsContainer}>
      <TouchableOpacity onPress={onTap} style={styles.touchableContent}>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{convertUnixToTimeString(activity.timeBlock.startTime, activity.timeBlock.endTime)}</Text>
          <Text style={styles.timeText}> - </Text>
          <Text style={styles.timeText}>{convertUnixToTimeString(activity.timeBlock.endTime, 0)}</Text>
        </View>
        <Text style={styles.activityName}>{activity.button.text}</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity onPress={onRemove}>
      <MaterialIcons name="delete" size={width / 15} color="black" />
    </TouchableOpacity>
  </View>
)};
// const ActivityItem = ({ TimeActPair, onRemove, onTap }: ActivityItemProps) => {
//   let specialButton = false
//   if(TimeActPair.activities[0].button.text=='Woke Up' || TimeActPair.activities[0].button.text=='Went To Bed') {
//     specialButton=true
//   }

//   return (
//     <View style={styles.timeActivityPairContainer}>
//       <View style={styles.leftTimeContainer}>
//         <Text style={{color: 'white', fontSize: 13}}>{TimeActPair.time}</Text>
//       </View>
//       <ActivityBlock TimeActPair={TimeActPair} onTap={() => onTap(TimeActPair.activities[0])} onRemove={() => onRemove(TimeActPair.activities[0])} />
//     </View>
// );}
const ActivityList: React.FC<ActivityItemProps> = ({ TimeActPair, onTap, onRemove }) => {

  return (
  <>
    {TimeActPair.activities.map((activity, index) => (
      <ActivityBlock
        key={index}
        activity={activity}
        onTap={() => onTap(activity)}
        onRemove={() => onRemove(activity)}
      />
    ))}
  </>
)};

interface TimeActiviesPair {
  time: number,
  activities: Activity[]
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
function Journal() {

  const { user } = useAuth();
  const [dbActivities, setDbActivities] = useState<any>(null);
  const [version, setVersion] = useState(0)
  const [activityInfo, setActivityInfo] = useState<Activity[]>([])
  const { removeActivity, dateIncrement, setDateIncrement } = useAppContext();
  const remove = (act: Activity) => {
    removeActivity(null, act);
    setVersion(prevVersion => prevVersion + 1)
  }
  const [activityDescribeVisible, setActivityDescribeVisible] = useState<boolean>(false);
  useEffect(() => {
    FetchDayActivities(user, dateIncrement, setDbActivities)

  }, [user, version, dateIncrement]);

console.log(setMinutesToZero(dbActivities[0].timeBlock.startTime))
const dayStartHour = setMinutesToZero(dbActivities[0].timeBlock.startTime)
  const timeRanges: TimeRange[] = [
    { time: 1, minTime: dayStartHour, maxTime: (dayStartHour + 3600) },
    { time: 2, minTime: (dayStartHour + 3600), maxTime: (dayStartHour + 7200)  },
    { time: 3, minTime: (dayStartHour + 7200), maxTime: (dayStartHour + 10800) }
  ];
  const result: TimeActiviesPair[] = timeRanges.map(range => ({
    time: range.time,
    activities: dbActivities.filter((activity: Activity) => activity.timeBlock.startTime >= range.minTime && activity.timeBlock.startTime <= range.maxTime)
  }));

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
        if(activity.Multi) {
        let multiActivities: Activity[] = []
        for(let i=0; i<activity.Multi.length; i++) {
          multiActivities[i]=activity.Multi[i];
        }
        setActivityInfo(multiActivities)
      }
      }
      else {
        setActivityInfo([activity])
      }
      setActivityDescribeVisible(true);
    }
  
  return (
    
      <View style={styles.layoutContainer}>
        <MyModal visible={modalVisible} onClose={toggleModal} />
        <ActivityDescribeModal style={styles.durationModal} ActivityDescribeVisible={activityDescribeVisible} Info={activityInfo} onClose={() => setActivityDescribeVisible(false)} onTapOut={() => setActivityDescribeVisible(false)}/>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
              <TouchableOpacity onPress={() => setDateIncrement(dateIncrement-1)}>
                <View style={styles.incrementButtonContainer}>
                  <Ionicons name="return-up-back" size={height/27} color="black"/>
                </View>
              </TouchableOpacity>
              <View style={styles.titleContainer}>
                <ThemedText type="titleText">My Journal</ThemedText>
              </View>
              <TouchableOpacity onPress={() => setDateIncrement(dateIncrement+1)}>
              <View style={styles.incrementButtonContainer}>
                <Ionicons name="return-up-forward" size={height/27} color="black"/>
                </View>
              </TouchableOpacity>
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
          renderItem={({ item }) => <ActivityList TimeActPair={item} onRemove={remove} onTap={activityTapped}/>}
          keyExtractor={(item) => item.id}
          />
        </View>
          : <>
            {/* <ThemedText type="subtitle">
              Add Your First Activity For The Day!
            </ThemedText> */}
          </>}
        </View>
        <View style={styles.plusButtonContainer}>
          <TouchableOpacity onPress={toggleModal}>
            <AntDesign name="pluscircle" size={width/6.25} color="black" />
          </TouchableOpacity>
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
 leftTimeContainer: {
  flex: 1
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
   flex: 3,
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

const Index: React.FC = () => {
  return (
    <AppProvider>
      <Journal />
    </AppProvider>
  );
};

export default Index;
