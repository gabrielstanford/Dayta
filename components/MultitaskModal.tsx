import {ModalProps, Modal, View, StyleSheet, Dimensions, Text, TouchableWithoutFeedback, Platform} from 'react-native'
import {ThemedText} from './ThemedText'
import {Button} from '@rneui/themed'
import TimeDropdown from './TimeDropdown'
import {useState, useEffect} from 'react'
import Slider from '@react-native-community/slider';
import {useAppContext} from '@/contexts/AppContext'
import {useAuth} from '@/contexts/AuthContext'
import FetchDayActivities from '@/Data/FetchDayActivities'

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
  
  interface MultitaskModalProps extends ModalProps {
    MultitaskModalVisible: boolean;
    onNext: (text: string[]) => void;
    onTapOut: () => void;
  }

const MultitaskModal: React.FC<MultitaskModalProps> = ({ MultitaskModalVisible, onNext, onTapOut, ...modalProps }) => {
  const unixEndTimeToHMS = (endTime: number) => {
    const date = new Date(endTime * 1000); // Convert Unix timestamp to utc date
    const offset = date.getTimezoneOffset(); // Time zone offset in minutes
    const utcZonedDate = new Date(date.getTime() - offset * 60000);
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
  const {activities} = useAppContext();
  const {user} = useAuth();
  const [dbActivities, setDbActivities] = useState<Activity[]>([]);
  const [selectedHour, setSelectedHour] = useState("10");
  const [selectedMinute, setSelectedMinute] = useState("30");
  const [selectedPeriod, setSelectedPeriod] = useState("AM");
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    FetchDayActivities(user, 0, setDbActivities)

  }, [MultitaskModalVisible, hasInitialized, user]);

  if(dbActivities) {
  const sortedActivities = dbActivities.sort((a, b) => a.timeBlock.startTime - b.timeBlock.startTime);
  useEffect(() => {
    if (MultitaskModalVisible) {
      if (!hasInitialized && sortedActivities.length > 0) {
        const mostRecentEndTime = unixEndTimeToHMS(
          sortedActivities[sortedActivities.length-1].timeBlock.endTime
        );
        setSelectedHour(mostRecentEndTime[0]);
        setSelectedMinute(mostRecentEndTime[1]);
        setSelectedPeriod(mostRecentEndTime[2]);
        setHasInitialized(true);
      }
    } else {
      // Reset the initialization state when the modal is closed
      setHasInitialized(false);
    }
  }, [MultitaskModalVisible, hasInitialized, sortedActivities]);
  }
  //could implement logic here for making this most likely based on the activity
  const [duration, setDuration] = useState(15);

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
    
    const timeString = selectedHour + ":" + selectedMinute + " " + selectedPeriod
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
      const offset = utcDate.getTimezoneOffset(); // Time zone offset in minutes
      const utcZonedTime = new Date(utcDate.getTime() + offset * 60000);
      const unixTimestamp = Math.floor(utcZonedTime.getTime() / 1000);
      const endTimeUnix = unixTimestamp + durationSeconds; // Calculate end time
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
    const ActTexts = ["walk", "relaxation"]
    return(
        <Modal 
        transparent={true}
        animationType="slide"
        visible={MultitaskModalVisible}

        {...modalProps}>
          <TouchableWithoutFeedback onPress={onTapOut}>
            <View style={styles.MultitaskModalOverlay}>
            <TouchableWithoutFeedback>
                <View style={styles.MultitaskModalContent}>
                  <View style={styles.titleContainer}>
                    <ThemedText type="title"> Start Time</ThemedText>
                  </View>
                <View style={styles.nextContainer}>
                  <Button title="Next" style={styles.nextButton} onPress={() => onNext(ActTexts)} />
                </View>
            </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
    
}

const styles = StyleSheet.create({
    MultitaskModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      MultitaskModalContent: {
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
      nextContainer: {
        alignContent: 'flex-start',

      },
      slider: {
          flex: 1,
          flexDirection: 'row',
          width: '100%',
          height: 40,
      },
      nextButton: {
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
export default MultitaskModal;