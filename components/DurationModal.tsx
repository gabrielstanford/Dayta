import {ModalProps, Modal, View, StyleSheet, Dimensions, Text, TouchableWithoutFeedback, Platform} from 'react-native'
import {ThemedText} from './ThemedText'
import {Button} from '@rneui/themed'
import TimeDropdown from './TimeDropdown'
import {useState, useEffect} from 'react'
import Slider from '@react-native-community/slider';
import {useAuth} from '@/contexts/AuthContext'
import { getDoc, doc } from 'firebase/firestore';
import {firestore} from '@/firebase/firebase'
import { format, fromZonedTime, toZonedTime } from 'date-fns-tz';

const {width, height} = Dimensions.get("window");
interface TimeBlock {
  startTime: number; // Unix timestamp
  duration: number;  // Duration in seconds
  endTime: number;   // Unix timestamp
  }
  type ButtonState = {
    text: string;
    iconLibrary: string;
    icon: string;
    pressed: boolean;
    id?: string;
  };
  
  interface DurationModalProps extends ModalProps {
    durationModalVisible: boolean;
    onSubmit: (timeBlock: TimeBlock) => void;
    onTapOut: () => void;
    activity: ButtonState;
  }

const DurationModal: React.FC<DurationModalProps> = ({ durationModalVisible, onSubmit, onTapOut, activity, ...modalProps }) => {
    
  const [selectedHour, setSelectedHour] = useState("08");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [selectedPeriod, setSelectedPeriod] = useState("AM");
  const [duration, setDuration] = useState(0);
  const {user} = useAuth();

  const handleHourChange = (hour: string) => {
    setSelectedHour(hour);
  };

  const handleMinuteChange = (minute: string) => {
    setSelectedMinute(minute);
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };
  const getUserTimezone = async (userId: string): Promise<string> => {
    const userRef = doc(firestore, 'users', userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data()?.timezone || 'UTC'; // Default to 'UTC' if timezone is not set
    }
    throw new Error('User not found');
  };

  async function processUserTimezone(unixTime: Promise<number>): Promise<number> {
    try {
      // Fetch the user's time zone
      if(user) {
      const userTimeZone: string = await getUserTimezone(user.uid);
  
      // Unix timestamp representing the local time chosen by the user
      const userSelectedTime: number = 1690785600; // Example timestamp
  
      // Convert Unix timestamp to a Date object in UTC
      const utcDate: Date = new Date(userSelectedTime * 1000);
  
      // Convert the UTC date to the time in the user's time zone
      const zonedDate: Date = toZonedTime(utcDate, userTimeZone);
      // Convert the UTC Date object to Unix timestamp (seconds since epoch)
      const unixTimestamp: number = Math.floor(zonedDate.getTime() / 1000);
      console.log(`Local Time in User's Time Zone: ${zonedDate.toISOString()}`);
      return unixTimestamp
      }
      else {
        return unixTime
      }
    } catch (error) {
      console.error('Error fetching user time zone:', error);
      throw error;
    }
  }
  async function calculateEndTime(startTimeUnix: Promise<number>, durationSeconds: number): Promise<number> {
    try {
      // Await the result from processUserTimezone
      const zonedUnix = await processUserTimezone(startTimeUnix);
      
      // Calculate end time
      const endTimeUnix = zonedUnix + durationSeconds;
      return endTimeUnix;
    } catch (error) {
      console.error('Error processing user time zone:', error);
      throw error; // Rethrow or handle as needed
    }
  }
  
  
  const convertToLocalTime = (timestamp: number, timezone: string) => {
    const date = new Date(timestamp * 1000); // Convert Unix timestamp to JavaScript Date object
    return format(date, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone: timezone });
  };
  

  const generateTimeString = () => {
    //const localTime = 
    if (user) {
      const timeZone=getUserTimezone(user.uid)
      console.log(timeZone)
      console.log()
    }
    
    const timeString = selectedHour + ":" + selectedMinute + " " + selectedPeriod
    console.log(timeString)
    return timeString
  }
  
    // Function to convert duration input to seconds
    function convertDurationToSeconds(minutes: number): number {
      return (minutes * 60);
    }
    const convertTimeToUnix = (timeString: string, date: Date = new Date()): number => {
      // Parse the time string
      const [time, period] = timeString.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
    
      // Convert 12-hour format to 24-hour format
      let hours24 = hours;
      if (period === 'PM' && hours !== 12) {
        hours24 += 12;
      } else if (period === 'AM' && hours === 12) {
        hours24 = 0;
      }
    
      // Set the UTC time based on the input
      const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), hours24, minutes));
    
      // Convert to Unix timestamp and return
      return Math.floor(utcDate.getTime() / 1000);
    };
    
    // Function to create a TimeBlock based on user input
    function createTimeBlock(startTime: string, durationMinutes: number): TimeBlock {
      const startTimeUnix = convertTimeToUnix(startTime); // Convert start time to Unix timestamp
      const durationSeconds = convertDurationToSeconds(durationMinutes); // Convert duration to seconds
      const utcDate = new Date(startTimeUnix * 1000);
    // Convert the UTC date to the time in the user's time zone
      const zonedUnix = processUserTimezone(startTimeUnix)
      //change start time to locally converted unix
      const endTimeUnix = calculateEndTime(zonedUnix, durationSeconds); // Calculate end time
    
      return {
        startTime: startTimeUnix,
        duration: durationSeconds,
        endTime: endTimeUnix
      };
    }
    function formatTime(minutes: number) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
    
      return `${hours}h ${remainingMinutes}m`; 
    
    }

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
                  <View style={styles.titleContainer}>
                    <ThemedText type="title"> Start Time</ThemedText>
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
                  </View>
                <View style={styles.titleContainer}>
                  <ThemedText type="title"> Duration: {formatTime(duration)} </ThemedText>
                </View>
                <View style={styles.slider}>
                  <Text>0</Text>
                  <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={120}
                  step={1}
                  value={duration}
                  onValueChange={(value) => setDuration(value)}
                  minimumTrackTintColor="#1FB28A"
                  maximumTrackTintColor="#d3d3d3"
                  thumbTintColor="#1FB28A"
                  />
                  <Text>2 hrs</Text>
                </View>
                <View style={styles.submitContainer}>
                  <Button title="Submit" style={styles.submitButton} onPress={() => onSubmit(createTimeBlock(generateTimeString(), duration))} />
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
        flex: 0.5,
        width: width/1.1,
        height: height/2,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
      },
      titleContainer: {
        marginTop: 10,
        marginBottom: 5,
        alignItems: 'center'
      },
      timeDropdown: {

      },

      dropdownContainer: {
        height: height/4, // Adjust this value as needed
        width: '100%', // Or a fixed width if required
        overflow: 'hidden', // Ensures dropdown content does not spill outside
        padding: 10, // Optional padding
      },
      submitContainer: {
        alignContent: 'flex-start',

      },
      slider: {
          flex: 1,
          flexDirection: 'row',
          width: '100%',
          height: 40,
      },
      submitButton: {
        paddingTop: 10,
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