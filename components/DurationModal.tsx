import {ModalProps, Modal, View, StyleSheet, Dimensions, Text, TouchableWithoutFeedback, Platform, TouchableOpacity} from 'react-native'
import {ThemedText} from './ThemedText'
import {Button} from '@rneui/themed'
import TimeDropdown from './TimeDropdown'
import {useState, useEffect} from 'react'
import Slider from '@react-native-community/slider';
import {useAppContext} from '@/contexts/AppContext'
import {useAuth} from '@/contexts/AuthContext'
import FetchDayActivities from '@/Data/FetchDayActivities'
import {RadioButton} from 'react-native-paper'
import TimeInput from './HourPicker'
import {ButtonState, Activity, TimeBlock, ActivityWithEnd} from '@/Types/ActivityTypes'
import { convertTimeToUnix,  adjustDateByDays} from '@/utils/DateTimeUtils'

const {width, height} = Dimensions.get("window");
  
  interface DurationModalProps extends ModalProps {
    durationModalVisible: boolean;
    onSubmit: (timeBlock: TimeBlock) => void;
    onTapOut: () => void;
    activity: ButtonState;
  }

const DurationModal: React.FC<DurationModalProps> = ({ durationModalVisible, onSubmit, onTapOut, activity, ...modalProps }) => {
  const unixEndTimeToHMS = (endTime: number) => {
    const date = new Date(endTime * 1000); // Convert Unix timestamp to utc date
    const offset = date.getTimezoneOffset(); // Time zone offset in minutes
    const utcZonedDate = new Date(date.getTime() - (offset-1) * 60000);
    //zone the date
    let hour = utcZonedDate.getUTCHours();
    const minute = utcZonedDate.getUTCMinutes();
    const period = hour >= 12 ? "PM" : "AM";
  
    // Convert to 12-hour format and pad with leading zeros if necessary
    hour = hour % 12;
    hour = hour ? hour : 12; // Handle the case where hour is 0
    const hourString = hour < 10 ? `0${hour}` : `${hour}`;
    const minuteString = minute < 10 ? `0${minute}` : `${minute}`;
    return [ hourString, minuteString, period ];
  }
  const {justActivities, dateIncrement} = useAppContext();
  const {user} = useAuth();
  const [dbActivities, setDbActivities] = useState<Activity[]>([]);
  const [durationHours, setDurationHours] = useState(0);
  const [selectedHour, setSelectedHour] = useState("10");
  const [selectedMinute, setSelectedMinute] = useState("30");
  const [selectedPeriod, setSelectedPeriod] = useState("AM");
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    //consider adding functionality for setting this for past days but not necessary now
    FetchDayActivities(user, dateIncrement, justActivities, setDbActivities, false)
    setDurationHours(0);
    setDurationMinutes(15);
  }, [durationModalVisible, hasInitialized, user, justActivities]);

  useEffect(() => {
    // Filter out activities without an endTime
    if(dbActivities) {

  const filteredWithEnd: ActivityWithEnd[] = dbActivities.filter(
    (act): act is Activity & { timeBlock: { endTime: number } } => act.timeBlock.endTime !== null
  );

  // Sort the filtered activities by endTime
  const sortedActivities = filteredWithEnd.sort(
    (a, b) => (a.timeBlock.endTime || 0) - (b.timeBlock.endTime || 0)
  );
  
    if (durationModalVisible) {
      console.log('initialized?', hasInitialized)
      if (!hasInitialized && sortedActivities.length > 0) {
        const mostRecentEndTime = unixEndTimeToHMS(sortedActivities[sortedActivities.length-1].timeBlock.endTime);
        setSelectedHour(mostRecentEndTime[0]);
        setSelectedMinute(mostRecentEndTime[1]);
        setSelectedPeriod(mostRecentEndTime[2]);
        setHasInitialized(true);
      }
    } else {
      // Reset the initialization state when the modal is closed
      setHasInitialized(false);
    }
  }
  //just by adding dbActivities to the useEffecthook, I am able to 
  }, [durationModalVisible, hasInitialized, dbActivities]);
  
  useEffect(() => {
    console.log("recents finished setting", selectedMinute)
  }, [selectedHour, selectedMinute, selectedPeriod])

  //could implement logic here for making this most likely based on the activity
  const [durationMinutes, setDurationMinutes] = useState(15)

  const handleDurationHourChange = (hour: number) => {
    setDurationHours(hour)
  }

  const handleHourChange = (hour: string) => {
    setSelectedHour(hour);
  };

  const handleMinuteChange = (minute: string) => {
    setSelectedMinute(minute);
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };
  
  const generateTimeString = () => {
    //const localTime = 
    let timeString="888"
    if(value=="With Start Time" && selectedHour) {
    timeString = selectedHour + ":" + selectedMinute + " " + selectedPeriod
    }
    else {
    }
    return timeString
  }
  
    // Function to convert duration input to seconds
    function convertDurationToSeconds(minutes: number): number {
      return (minutes * 60);
    }
    
    // Function to create a TimeBlock based on user input
    function createTimeBlock(startTime: string, durationMinutes: number): TimeBlock {
      // am i turning time into unix and then right back? seems strange
      const startTimeUnix = convertTimeToUnix(startTime); // Convert start time to Unix timestamp
      const durationSeconds = convertDurationToSeconds(durationMinutes); // Convert duration to seconds
      const localDate = new Date(startTimeUnix * 1000); 
      const offset = localDate.getTimezoneOffset(); // Time zone offset in minutes
      const utcZonedTime = dateIncrement==0 ? new Date(localDate.getTime() + offset * 60000) : adjustDateByDays(new Date(localDate.getTime() + offset * 60000), dateIncrement);
      let unixTimestamp = Math.floor(utcZonedTime.getTime() / 1000);
      if(localDate.getUTCHours()<4) {
        unixTimestamp = unixTimestamp+86400
      }
      let endTimeUnix = null
      if(startTimeUnix % 60 !== 31) {
        endTimeUnix = unixTimestamp + durationSeconds; // Calculate end time
      }
      return {
        startTime: unixTimestamp,
        duration: durationSeconds,
        endTime: endTimeUnix
      };
    }
    function formatTime(minutes: number) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
    
      return `${hours}h ${remainingMinutes}m`; 
    
    }
    const [value, setValue] = useState<string>("With Start Time");

    return(
        <Modal 
        transparent={true}
        animationType="slide"
        visible={durationModalVisible}

        {...modalProps}>
          <TouchableWithoutFeedback onPress={onTapOut}>
            <View style={styles.durationModalOverlay}>
            <TouchableWithoutFeedback>
                <View style={styles.durationModalContent}>
                <RadioButton.Group onValueChange={value => setValue(value)} value={value}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around', margin: 5}}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        style={styles.radioButtonContainer}
                        onPress={() => setValue('With Start Time')}
                    >
                      <RadioButton color="darkcyan" value="With Start Time" />
                      <Text>With Start Time</Text>
                    </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                      style={styles.radioButtonContainer}
                      onPress={() => setValue('Without Start Time')}
                    >
                      <RadioButton color="darkcyan" value="Without start Time" />
                      <Text>No Start Time</Text>
                    </TouchableOpacity>
                    </View>
                  </View>
                </RadioButton.Group>
                {value=="With Start Time" ? 
                <>
                  <View style={styles.titleContainer}>
                    <ThemedText type="durationTitle"> Start Time</ThemedText>
                  </View>
                  <View style={styles.timeDropdown}>
                    <View style={Platform.OS === 'ios' ? styles.dropdownContainer : androidCustom.dropdownContainer}>
                      <TimeDropdown
                      selectedHour={selectedHour}
                      selectedMinute={selectedMinute}
                      selectedPeriod={selectedPeriod}
                      onHourChange={handleHourChange}
                      onMinuteChange={handleMinuteChange}
                      onPeriodChange={handlePeriodChange}
                      />
                    </View>
                  </View></> : <></>}
                <View style={styles.titleContainer}>
                  <ThemedText type="durationTitle"> Duration: {formatTime(durationMinutes + durationHours*60)} </ThemedText>
                </View>
                <View style={styles.durationContainer}>
                <View style={styles.hourContainer}>
                  <Text style={styles.hours}>Hours: </Text>
                  <TimeInput onHourChange={handleDurationHourChange}/>
                </View>
                <View style={styles.slider}>
                  <Text>0</Text>
                  <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={59}
                  step={1}
                  value={durationMinutes}
                  onValueChange={(value) => setDurationMinutes(value)}
                  minimumTrackTintColor="#1FB28A"
                  maximumTrackTintColor="#d3d3d3"
                  thumbTintColor="#1FB28A"
                  />
                  <Text>59</Text>
                  </View>
                </View>
                <View style={styles.submitContainer}>
                  <Button title="Submit" style={styles.submitButton} onPress={() => onSubmit(createTimeBlock(generateTimeString(), durationMinutes+durationHours*60))} />
                </View>
            </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
    
}

const styles = StyleSheet.create({
    durationModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      durationModalContent: {
        flex: 0.65,
        width: width/1.1,
        height: height/1,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
      },

      titleContainer: {
        flex: 1,
        backgroundColor: 'darkgreen',
        marginBottom: 5,
        alignItems: 'center',
        justifyContent: 'center',
      },
      radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
      },
      timeDropdown: {
        flex: 7
      },

      dropdownContainer: {
        height: height/4, // Adjust this value as needed
        width: '100%', // Or a fixed width if required
        overflow: 'hidden', // Ensures dropdown content does not spill outside
        padding: 10, // Optional padding
      },
      durationContainer: {
        flex: 4,
        alignItems: 'center'
      },
      hourContainer: {
        flexDirection: 'row',
        marginTop: 15,
        alignItems: 'center',
        borderColor: 'grey',
        borderWidth: 2,
        borderRadius: 10
      },
      hours: {
        fontSize: 17,
        fontWeight: 'bold',
        padding: 5
      },
      slider: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center'
        //height: 40,
    },
      submitContainer: {
        flex: 1.5,
        alignItems: 'center',

      },
      submitButton: {
        width: '30%'
      }
})

const androidCustom = StyleSheet.create({
  dropdownContainer: {
    height: height/6, // Adjust this value as needed
    width: '100%', // Or a fixed width if required
    overflow: 'hidden', // Ensures dropdown content does not spill outside
    padding: 10, // Optional padding
  },
})
export default DurationModal;