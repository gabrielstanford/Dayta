import {ModalProps, Modal, View, StyleSheet, Dimensions} from 'react-native'
import {ThemedText} from './ThemedText'
import {Button} from '@rneui/themed'
import TimeDropdown from './TimeDropdown'
import {useState} from 'react'

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
    onClose: (timeBlock: TimeBlock) => void;
    activity: ButtonState;
  }

const DurationModal: React.FC<DurationModalProps> = ({ durationModalVisible, onClose, activity, ...modalProps }) => {
    
  const [selectedHour, setSelectedHour] = useState("08");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [selectedPeriod, setSelectedPeriod] = useState("AM");

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
      const endTimeUnix = startTimeUnix + durationSeconds; // Calculate end time
    
      return {
        startTime: startTimeUnix,
        duration: durationSeconds,
        endTime: endTimeUnix
      };
    }
    return(
        <Modal 
        transparent={true}
        animationType="slide"
        visible={durationModalVisible}

        {...modalProps}>
            <View style={styles.durationModalOverlay}>
                <View style={styles.durationModalContent}>
                  <View style={styles.titleContainer}>
                    <ThemedText type="title" style={styles.durationModalTitle}> {activity ? activity.text : ""}: Enter Time</ThemedText>
                  </View>
                  <View style={styles.timeDropdown}>
                    <View style={styles.subtitleContainer}>
                      <ThemedText type="subtitle">Start Time:</ThemedText>
                    </View>
                    <View style={styles.dropdownContainer}>
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
                <View style={styles.submitContainer}>
                  <Button title="Submit" style={styles.submitButton} onPress={() => onClose(createTimeBlock(generateTimeString(), 5))} />
                </View>
            </View>
        </View>
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
        alignItems: 'center'
      },
      durationModalTitle: {
        fontSize: 20,
      },
      timeDropdown: {

      },
      subtitleContainer: {

      },
      dropdownContainer: {
        height: 200, // Adjust this value as needed
        width: '100%', // Or a fixed width if required
        overflow: 'hidden', // Ensures dropdown content does not spill outside
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10, // Optional padding
      },
      submitContainer: {
        alignContent: 'flex-start',

      },
      submitButton: {
        paddingTop: 10,
        width: '30%'
      }
})

export default DurationModal;