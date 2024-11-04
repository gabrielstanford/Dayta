import { StyleSheet, View, Dimensions, FlatList, Text, TouchableOpacity, TextInput, KeyboardAvoidingView} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useState, useEffect, useRef } from 'react';
import {AntDesign, MaterialIcons, Ionicons, Feather, MaterialCommunityIcons, FontAwesome5} from '@expo/vector-icons';
import MyModal from '@/components/MyModal'
import { useAppContext } from '@/contexts/AppContext';
import {useAuth} from '@/contexts/AuthContext'
import FetchDayActivities from '@/Data/FetchDayActivities'
import ActivityDescribeModal from '@/components/ActivityDescribeModal'
import {DateTime} from 'luxon'
import {Activity, ActivityWithEnd} from '@/Types/ActivityTypes';
import HandleSubmitEditing from '@/Data/HandleSubmitEditing';
import uuid from 'react-native-uuid'
import NoStartTimeModal from '@/components/NoStartTimeModal';
import CalendarConnect from '@/components/CalendarConnect';
import CalendarInformation from '@/components/CalendarInformation'
import {storage} from '@/utils/mmkvStorage';

import { getSunriseSunset, generateISODate } from '@/utils/DateTimeUtils';

// Get screen width. This is for more responsive layouts
const { width, height } = Dimensions.get('window');
const buttonWidth = width/6.25

const convertUnixToTimeString = (startTime: number, endTime: number, isInput: boolean): string => {
  // Create Date objects from the Unix timestamps
  const startDate = new Date(startTime * 1000); // Convert seconds to milliseconds
  const endDate = new Date(endTime * 1000);

  // Get hours and minutes in local time
  let startHours = startDate.getHours();
  let endHours = endDate.getHours();
  const startMinutes = startDate.getMinutes();

  // Determine AM or PM
  const periodStart = startHours < 12 ? 'AM' : 'PM';
  const periodEnd = endHours < 12 ? 'AM' : 'PM';

  // Convert hours from 24-hour to 12-hour format
  startHours = startHours % 12;
  startHours = startHours ? startHours : 12; // Hour '0' should be '12'

  // Format minutes to always have two digits
  const formattedMinutes = startMinutes < 10 ? `0${startMinutes}` : `${startMinutes}`;

  // Construct the formatted time string
  if (!isInput) {
    if (endTime > 0) {
      return `${startHours}:${formattedMinutes}`;
    } else {
      // return `${startHours}:${formattedMinutes} ${periodStart}`;
      return `${startHours}:${formattedMinutes} ${periodStart}`;

    }
  } else {
    if(startHours>=10) {
      return `${startHours}:${formattedMinutes}${periodStart}`;
      }
      else {
        return `0${startHours}:${formattedMinutes}${periodStart}`
      };
  }
};

interface ActivityItemProps {
  activity: ActivityWithEnd;
  onRemove: (activity: Activity) => void 
  timeState:(boolean | string)[];
  dateIncrement: number,
  updateActivity: any,
  moveActivity: any,
  onTimeTap: (activity: Activity) => void
  onTap: (activity: Activity) => void
}

const ActivityItem = ({ activity, onRemove, timeState, dateIncrement, updateActivity, moveActivity, onTimeTap, onTap }: ActivityItemProps) => {
  let specialButton = false;
  let sunrise = false;
  let sunset = false;
  let rout = false;
  if(activity.button.text=='Woke Up' || activity.button.text=='Went To Bed' || activity.button.text=='Coffee') {
    specialButton=true
  }
  if(activity.parentRoutName && activity.parentRoutName!=="sun") {
    rout = true
  }
  else if(activity.button.text=='Sunrise' || activity.button.text=="Sunset") {
    sunrise = true;
  }
  // const morningCutoff = justActivities.filter()
  // if(activity.timeBlock.startTime>=)

  const [inputValue, setInputValue] = useState<string>(convertUnixToTimeString(activity.timeBlock.startTime, activity.timeBlock.endTime, true));
  const [input2Value, setInput2Value] = useState<string>(convertUnixToTimeString(activity.timeBlock.endTime, 0, true));

  const maxLength = 7;
  const handleInputChange = (text: string) => {
   setInputValue(text); 
  };
  const handleInput2Change = (text: string) => {
    setInput2Value(text); 
   };
   let Cat: string[] = []
   if(activity.button.category && activity.button.category.length>0) {
    Cat = activity.button.category.map(cat => cat.toLowerCase())
   }

   const iconMapping: { [key: string]: JSX.Element } = {
    "sunlight": <Feather name="sun" style={styles.category} />,
    "coffee": <Feather name="coffee" style={styles.category} />,
    "intense activity": <MaterialCommunityIcons name="dumbbell" style={styles.category} />,
    "workout": <MaterialCommunityIcons name="dumbbell" style={styles.category} />,
    "exercise": <MaterialCommunityIcons name="dumbbell" style={styles.category} />,
    "light activity": <FontAwesome5 name="heartbeat" style={styles.category} />,
    "mental stimulation": <FontAwesome5 name="brain" style={styles.category} />,
    "meditation": <MaterialCommunityIcons name="meditation" style={styles.category} />,
    "electronics": <MaterialIcons name="phone-iphone" style={styles.category} />,
    "dopamine rush": <FontAwesome5 name="bolt" style={styles.category} />
    // Add more categories and corresponding JSX elements here
  };
  const getActivityContainerStyle = () => {
    if (specialButton) {
      return styles2.activityContainer;
    } else if (sunrise) {
      return styles3.activityContainer;
    } else if (rout) {
      return styles4.activityContainer;
    } else {
      return styles.activityContainer;
    }
  }
  
  return (
   
    <View>

        <View style={getActivityContainerStyle()}>
          <TouchableOpacity onPress={() => onTap(activity)} style={styles.allTouchables}>
        <TouchableOpacity onPress={() => onTimeTap(activity)} style={styles.touchableTime}>
          <View style={styles.timeContainer}>
            {(timeState[0] && activity.id==timeState[1]) ? 
            (
              <>
                <TextInput         
                value={inputValue}
                onChangeText={handleInputChange}
                maxLength={maxLength}
                keyboardType="default" 
                onSubmitEditing={() => HandleSubmitEditing(inputValue, input2Value, maxLength, activity, dateIncrement, updateActivity, moveActivity)}
                returnKeyType="done"
                style={styles.timeText} />
                <Text style={styles.timeText}> - </Text>
                <TextInput         
                value={input2Value}
                onChangeText={handleInput2Change}
                maxLength={maxLength}
                keyboardType="default"
                onSubmitEditing={() => HandleSubmitEditing(inputValue, input2Value, maxLength, activity, dateIncrement, updateActivity, moveActivity)}
                returnKeyType="done" 
                style={styles.timeText} />
              </>
            ) : 
            (
            <><Text style={styles.timeText}>{convertUnixToTimeString(activity.timeBlock.startTime, activity.timeBlock.endTime, false)}</Text>
              <Text style={styles.timeText}> - </Text>
              <Text style={styles.timeText}>{convertUnixToTimeString(activity.timeBlock.endTime, 0, false)}</Text></>
            )}
          </View>
        </TouchableOpacity>
        <View style={Cat.length>0 ? [styles.touchableActivity, {maxWidth: 150}] : styles.touchableActivity}>
          <Text style={styles.activityName}>{activity.button.text}</Text>
          </View>
          <View style={styles.indexCategories}>
          {Cat.length>0 ? Cat.map((cat) => (
              <View key={cat}>
                {iconMapping[cat] || <Feather name="help-circle" style={styles.category} />}
              </View>
            )) : <></>}  
            </View>
      <TouchableOpacity onPress={() => onRemove(activity)} style={styles.touchableDelete}>
        <MaterialIcons name="delete" size={width / 15} color="grey" />
      </TouchableOpacity>
      </TouchableOpacity>
    </View>
    </View>
);}

function Journal() {

  const { user } = useAuth();
  const [dbActivities, setDbActivities] = useState<Activity[]>([]);

  const [version, setVersion] = useState(0)
  const [activityInfo, setActivityInfo] = useState<Activity>()
  const [sunriseTime, setSunriseTime] = useState<number>(0);
  const [sunsetTime, setSunsetTime] = useState<number>(0);
  // const [authToken, setAuthToken] = useState<string | null>(null)
  // const [showAuth, setShowAuth] = useState<boolean>(false);
  const storedToken = storage.getString('AuthToken')

  // if(!storedToken) {
  //   setShowAuth(true)
  // }
  // useEffect(() => {
  //   if(authToken) {
  //   storage.set('AuthToken', authToken)  
  //   setShowAuth(false);
  //   }
  // }, [authToken])
  const sunriseActivity: ActivityWithEnd = {
    id: uuid.v4() as string,
    parentRoutName: 'sun',  // Optional field to identify special types
    button: 
      { text: 'Sunrise', 
        iconLibrary: "materialIcons", 
        icon: "brunch-dining", 
        keywords: ['Eating', 'Meal'], 
        pressed: false, 
        tags: ['Food/Drink'] 
      },
 
    timeBlock: {
      startTime: sunriseTime,  // Unix timestamp
      endTime: sunriseTime,    // You might want to use the same value for both
      duration: 0,
    },
  };

  const sunsetActivity: ActivityWithEnd = {
    id: uuid.v4() as string,
    parentRoutName: 'sun',  // Optional field to identify special types
    button: 
      { text: 'Sunset', 
        iconLibrary: "materialIcons", 
        icon: "brunch-dining", 
        keywords: ['Eating', 'Meal'], 
        pressed: false, 
        tags: ['Food/Drink'] 
      },
 
    timeBlock: {
      startTime: sunsetTime,  // Unix timestamp
      endTime: sunsetTime,    // You might want to use the same value for both
      duration: 0,
    },
  };
  const filteredWithEnd: ActivityWithEnd[] = dbActivities.filter(
    (act): act is Activity & { timeBlock: { endTime: number } } => act.timeBlock.endTime !== null
  );
  const withSunriseSunset: ActivityWithEnd[] = [...filteredWithEnd, sunriseActivity, sunsetActivity]
  withSunriseSunset.sort((a, b) => a.timeBlock.endTime - b.timeBlock.endTime);

  const noEnd: Activity[] = dbActivities.filter((act) => act.timeBlock.endTime == null || !(act.timeBlock.endTime>0))
  const generateSunriseSunset = () => {
      const timeZone = 'America/Los_Angeles'; // Replace with the user's time zone
      const today = generateISODate(dateIncrement, timeZone);
      const todayDate = new Date(today)
      const {sunrise, sunset} = getSunriseSunset(todayDate, timeZone)

      const sunriseDate = new Date(sunrise);
      const sunsetDate = new Date(sunset)
      const sunriseUnix = Math.floor(sunriseDate.getTime() / 1000)
      const sunsetUnix = Math.floor(sunsetDate.getTime() / 1000)
      setSunriseTime(sunriseUnix);
      setSunsetTime(sunsetUnix);
      
  }

  useEffect(() => {
    if(activityInfo) {
      setActivityDescribeVisible(true);
    }
    }, [activityInfo])
  const { justActivities, removeActivity, updateActivity, moveActivity, dateIncrement, setDateIncrement } = useAppContext();

  const [isTimeTapped, setTimedTapped] = useState<(boolean | string)[]>([false, ""]);
  const [localTime, setLocalTime] = useState<DateTime>(DateTime.local().plus({ days: dateIncrement }))
  const [noStartModalVisible, setNoStartModalVisible] = useState<boolean>(false);
  const remove = (act: Activity) => {
    removeActivity(act);
    setVersion(prevVersion => prevVersion + 1)
  }
  useEffect(() => {
    generateSunriseSunset();
}, [dateIncrement])
  const [activityDescribeVisible, setActivityDescribeVisible] = useState<boolean>(false);
  useEffect(() => {
    //this is terrible architecture; I should absolutely not be reading from the database on every date increment and every little update. 
        //I should instead read from local storage more.
        if(justActivities.length>0) {
          FetchDayActivities(user, dateIncrement, justActivities, setDbActivities, true)
        }

    setLocalTime(DateTime.local().plus({ days: dateIncrement }))
    setTimedTapped([false, ""])
  }, [user, dateIncrement, justActivities, version]);

  //toggle the state of the modal
    const [modalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {setModalVisible(!modalVisible); setTimedTapped([false, ""]);}
    const flatListRef = useRef<FlatList>(null);
    useEffect(() => {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 1); // Slight delay to ensure list is rendered
  
      // Clean up the timer if the component unmounts
      setTimedTapped([false, ""])
      return () => clearTimeout(timer);
    }, [dbActivities]); // Empty dependency array ensures this runs only on initial render

    const timeTapped = (activity: Activity) => {
      setTimedTapped([true, activity.id]);
    }
    const activityTapped = (activity: Activity) => {
      setTimedTapped([false, ""])
      if(activity.button.text=="Multi-Activity") {
        alert('multiActivity')
      }
      else {
        if(activityInfo==activity) {
          setActivityDescribeVisible(true);
        }
        else {
          setActivityInfo(activity)

        }
      }
    }
    
    const toggleNoStartModal = () => {
      setNoStartModalVisible(true);
    }
  return (
    
      <View style={styles.layoutContainer}>
        <MyModal visible={modalVisible} onClose={toggleModal} />
        {activityInfo && (<ActivityDescribeModal style={styles.durationModal} ActivityDescribeVisible={activityDescribeVisible} Info={activityInfo as Activity} onClose={() => setActivityDescribeVisible(false)} onTapOut={() => setActivityDescribeVisible(false)}/>)}
        <NoStartTimeModal visible={noStartModalVisible} onClose={() => setNoStartModalVisible(false)} remove={remove} otherArray={noEnd}/>
        <View style={styles.contentContainer} >
              <View style={{alignItems: 'center'}}>
                <ThemedText type="titleText" style={{fontSize: width/12}}>Journal</ThemedText>
              </View>
        <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => setDateIncrement(dateIncrement-1)}>
                <View style={styles.incrementButtonContainer}>
                  <Ionicons name="return-up-back" size={height/27} color="#F5F5F5"/>
                </View>
        </TouchableOpacity>   
        <ThemedText type="subtitle" style={styles.titleContainer}>{localTime.toFormat('cccc')}</ThemedText>
        <TouchableOpacity onPress={() => setDateIncrement(dateIncrement+1)}>
              <View style={styles.incrementButtonContainer}>
                <Ionicons name="return-up-forward" size={height/27} color="#F5F5F5"/>
              </View>
        </TouchableOpacity>
        </View>
        {/* {showAuth ? <CalendarConnect authToken={authToken} setAuthToken={setAuthToken} /> : <></>} */}
        {/* <CalendarInformation authToken={authToken}/> */}
        {withSunriseSunset.length>0 ? 
        <KeyboardAvoidingView 
        behavior= {'padding'}
        keyboardVerticalOffset={80} 
        style={{marginBottom: 80}}>
        <FlatList 
        ref={flatListRef}
        data={withSunriseSunset}
        renderItem={({ item }) => <ActivityItem activity={item} onRemove={remove} timeState={isTimeTapped} dateIncrement={dateIncrement} updateActivity={updateActivity} moveActivity={moveActivity} onTimeTap={timeTapped} onTap={activityTapped}/>}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        />
        </KeyboardAvoidingView>
          : <>
            {/* <ThemedText type="subtitle">
              Add Your First Activity For The Day!
            </ThemedText> */}
          </>}
        </View>
        <View style={styles.calendarButtonContainer}>
          <TouchableOpacity onPress={toggleNoStartModal}>
            <AntDesign name="calendar" size={width/8} color="grey" />
          </TouchableOpacity>
        </View>
        <View style={styles.plusButtonContainer}>
          <TouchableOpacity onPress={toggleModal}>
            <AntDesign name="pluscircle" size={width/6.25} color="#F5F5F5" />
          </TouchableOpacity>
        </View>
        <View style={styles.otherButtonContainer}>
          <TouchableOpacity onPress={toggleNoStartModal}>
            <MaterialIcons name="other-houses" size={width/8} color="grey" />
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
  backgroundColor: '#1B1B1B',
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
dateContainer: {
  alignItems: 'center'
},
incrementButtonContainer: {
  backgroundColor: '#1B1B1B'
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
  borderRadius: 2,
  padding: 15,
  // marginTop: 10,
  borderColor: 'lightgrey',
  borderWidth: 0.1,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  flexDirection: 'row',
  alignItems: 'center',
},
category: { 
  fontSize: 15,
  color: 'red',
},
detailsContainer: {
  flex: 1, // Allows this section to take up the remaining space
},
allTouchables: {
  flex: 1,
  flexDirection: 'row',
},
touchableActivity: {
  flexShrink: 1,
  flexWrap: 'nowrap',
  marginHorizontal: 2,

},
indexCategories: {
  marginLeft: 'auto'
},
touchableDelete: {
  marginLeft: 'auto'
},
touchableTime: {

},
timeContainer: {
  flexDirection: 'row',
  flexWrap: 'nowrap',
  // borderColor: 'yellow',
  // borderWidth: 3
},
timeText: {
  fontSize: 13,
  flexWrap: 'nowrap',
  color: 'grey',
},
activityName: {
  paddingLeft: 15,
  flex: 3,
  fontSize: 16,
  fontWeight: 'bold',
  color: '#F5F5F5'
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
calendarButtonContainer: {
  position: 'absolute', // Absolute positioning to overlay everything
  bottom: height/40.6, // Space from the bottom of the container
  right: width-buttonWidth-20, // Center horizontally more precisely
  width: buttonWidth
},
otherButtonContainer: {
  position: 'absolute', // Absolute positioning to overlay everything
  bottom: height/40.6, // Space from the bottom of the container
  left: width-buttonWidth-20, // Center horizontally more precisely
  width: buttonWidth
},
});

const styles2 = StyleSheet.create({
  activityContainer: {
    flex: 1,
    backgroundColor: '#222222',
    borderRadius: 2,
    padding: 15,
    // marginTop: 10,
    borderColor: 'lightgrey',
    borderWidth: 0.1,
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

const styles3 = StyleSheet.create({
  activityContainer: {
    flex: 1,
    backgroundColor: '#222222',
    borderRadius: 2,
    padding: 15,
    // marginTop: 10,
    borderColor: 'lightgrey',
    borderWidth: 0.1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    flexDirection: 'row',
    alignItems: 'center',
  },
})

const styles4 = StyleSheet.create({
  activityContainer: {
    flex: 1,
    backgroundColor: '#222222',
    borderRadius: 2,
    padding: 15,
    // marginTop: 10,
    borderColor: 'lightgrey',
    borderWidth: 0.1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export default Journal;
