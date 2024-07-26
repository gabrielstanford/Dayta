import {ModalProps, Modal, View, StyleSheet} from 'react-native'
import {ThemedText} from './ThemedText'
import {Button} from '@rneui/themed'

interface TimeBlock {
  startTime: number; // Unix timestamp
  duration: number;  // Duration in seconds
  endTime: number;   // Unix timestamp
  }

interface DurationModalProps extends ModalProps {
    durationModalVisible: boolean;
    onClose: (timeBlock: TimeBlock) => void;
  }

const DurationModal: React.FC<DurationModalProps> = ({ durationModalVisible, onClose, ...modalProps }) => {

    // Function to convert duration input to seconds
    function convertDurationToSeconds(minutes: number): number {
      return (minutes * 60);
    }
    function convertTimeToUnix(timeString: string): number {
      // Split the time string into its components
      const [time, modifier] = timeString.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
    
      // Adjust hours based on the AM/PM modifier
      if (modifier === 'PM' && hours < 12) {
        hours += 12;
      } else if (modifier === 'AM' && hours === 12) {
        hours = 0;
      }
    
      // Get the current date
      const now = new Date();
      now.setHours(hours, minutes, 0, 0);
    
      // Convert to Unix timestamp and return
      return Math.floor(now.getTime() / 1000);
    }

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
                    <ThemedText style={styles.durationModalTitle}>Enter Duration for Activity</ThemedText>
                <Button title="Submit" onPress={() => onClose(createTimeBlock("10:00 AM", 5))} />
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
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
      },
      durationModalTitle: {
        fontSize: 20,
        marginBottom: 20,
      },
})

export default DurationModal;