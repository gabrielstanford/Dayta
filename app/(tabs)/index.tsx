import { StyleSheet, View, Dimensions, FlatList, Text, TouchableOpacity} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useState, useEffect, useRef } from 'react';
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
  activity: Activity;
  onRemove: (activity: Activity) => void 
  onTap: (activity: Activity) => void
}

const ActivityItem = ({ activity, onRemove, onTap }: ActivityItemProps) => {
  let specialButton = false
  if(activity.button.text=='Woke Up' || activity.button.text=='Went To Bed') {
    specialButton=true
  }
  return (
  
    <View style={specialButton ? styles2.activityContainer : styles.activityContainer}>
      <View style={styles.detailsContainer}>
        <TouchableOpacity onPress={() => onTap(activity)} style={styles.touchableContent}>
          <View style={(activity.button.text=='Woke Up' || activity.button.text=='Went To Bed') ? styles2.timeContainer : styles.timeContainer}>
            <Text style={styles.timeText}>{convertUnixToTimeString(activity.timeBlock.startTime, activity.timeBlock.endTime)}</Text>
            <Text style={styles.timeText}> - </Text>
            <Text style={styles.timeText}>{convertUnixToTimeString(activity.timeBlock.endTime, 0)}</Text>
          </View>
          <Text style={styles.activityName}>{activity.button.text}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => onRemove(activity)}>
        <MaterialIcons name="delete" size={width / 15} color="black" />
      </TouchableOpacity>
    </View>
);}

function Journal() {

  const { user } = useAuth();
  const [dbActivities, setDbActivities] = useState<any>(null);
  const [version, setVersion] = useState(0)
  const [dateIncrement, setDateIncrement] = useState(0)
  const [activityInfo, setActivityInfo] = useState<Activity[]>([])
  const { removeActivity } = useAppContext();
  const remove = (act: Activity) => {
    removeActivity(null, act);
    setVersion(prevVersion => prevVersion + 1)
  }
  const [activityDescribeVisible, setActivityDescribeVisible] = useState<boolean>(false);
  useEffect(() => {
    FetchDayActivities(user, dateIncrement, setDbActivities)

  }, [user, version, dateIncrement]);
  
  //toggle the state of the modal
    const [modalVisible, setModalVisible] = useState(false);
    const toggleModal = () => setModalVisible(!modalVisible)
    const flatListRef = useRef<FlatList>(null);
    useEffect(() => {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
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
        {dbActivities ? 
        <FlatList 
        ref={flatListRef}
        data={dbActivities}
        renderItem={({ item }) => <ActivityItem activity={item} onRemove={remove} onTap={activityTapped}/>}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        />
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
  fontSize: 14.5,
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
    flex: 1,
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