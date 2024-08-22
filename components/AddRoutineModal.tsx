import {ModalProps, Modal, View, StyleSheet, Dimensions, Text, TouchableWithoutFeedback, Platform, TouchableOpacity} from 'react-native'
import {ThemedText} from './ThemedText'
import {Button} from '@rneui/themed'
import {useState, useEffect} from 'react'
import Slider from '@react-native-community/slider';
import {useAppContext} from '@/contexts/AppContext'
import {useAuth} from '@/contexts/AuthContext'
import FetchDayActivities from '@/Data/FetchDayActivities'
import ActivitySearchModal from './ActivitySearchModal'
import { SearchBar } from '@rneui/themed'
import TimeInput from './TimeInput'
import { create } from 'react-test-renderer'
import RNPickerSelect from 'react-native-picker-select'
import TimeDropdown from './TimeDropdown'
import { convertTimeToUnix, adjustDateByDays } from '@/utils/DateTimeUtils';
import { Routine } from '@/Types/ActivityTypes';

const {width, height} = Dimensions.get("window");
const buttonWidth = width/6.25
  
  interface MultitaskModalProps extends ModalProps {
    MultitaskModalVisible: boolean;
    onNext: (routineName: string, startTime: number) => void;
    onTapOut: () => void;
  }

  function timeStringToSeconds(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
  
    const totalSeconds = (hours * 3600) + (minutes * 60);
    return totalSeconds;
  }

const AddRoutineModal: React.FC<MultitaskModalProps> = ({ MultitaskModalVisible, onNext, onTapOut, ...modalProps }) => {

  const [tagValue, setTagValue] = useState<string>("")
  const [selectedHour, setSelectedHour] = useState("10");
  const [selectedMinute, setSelectedMinute] = useState("30");
  const [selectedPeriod, setSelectedPeriod] = useState("AM");
  const {dateIncrement, customRoutines} = useAppContext();
  const [part2Visible, setPart2Visible] = useState<boolean>(false);


  const handleHourChange = (hour: string) => {
    setSelectedHour(hour);
  };

  const handleMinuteChange = (minute: string) => {
    setSelectedMinute(minute);
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };
  const createStartTime = (startTimeUnix: number) => {
    const localDate = new Date(startTimeUnix * 1000); 
    const offset = localDate.getTimezoneOffset(); // Time zone offset in minutes
    const utcZonedTime = dateIncrement==0 ? new Date(localDate.getTime() + offset * 60000) : adjustDateByDays(new Date(localDate.getTime() + offset * 60000), dateIncrement);
    const unixTimestamp = Math.floor(utcZonedTime.getTime() / 1000);
    return unixTimestamp
  }
  const generateTimeString = () => {

    if(selectedHour) {
        const timeString = selectedHour + ":" + selectedMinute + " " + selectedPeriod
        return timeString
    }
    else {
        alert("Please Select A Time")
        return ""
      }
    }
    const handleNext = (start: number) => {
      if(tagValue!=="") {

        setPart2Visible(true)
      } 
      else {alert("Please set the routine")}
    }
    return(
        <Modal 
        transparent={true}
        animationType="slide"
        visible={MultitaskModalVisible}

        {...modalProps}>
          <TouchableWithoutFeedback onPress={() => {onTapOut(); setTimeout(() => {setPart2Visible(false)}, 80)}}>
            <View style={styles.MultitaskModalOverlay}>
            <TouchableWithoutFeedback>
            {!part2Visible ? 
            
                <View style={styles.MultitaskModalContent}>
                  <View style={styles.titleContainer}>
                    <ThemedText type="title"> Add A Routine</ThemedText>
                  </View>
                <View style={styles.stepContainer}>
                  <TagDropdown customRoutines={customRoutines} setTagValue={setTagValue} />
                </View>
                <Text style={{paddingLeft: 20, fontWeight: "bold", fontSize: 20, color: "black"}}>Starting At: </Text>
                <View style={styles.stepContainer}>
        
                <TimeDropdown
                      selectedHour={selectedHour}
                      selectedMinute={selectedMinute}
                      selectedPeriod={selectedPeriod}
                      onHourChange={handleHourChange}
                      onMinuteChange={handleMinuteChange}
                      onPeriodChange={handlePeriodChange}
                      />
                </View>
                {/* on submit () => onNext(tagValue, createStartTime(convertTimeToUnix(generateTimeString()))) */}
                <TouchableOpacity style={styles.nextContainer} onPress={() => handleNext(createStartTime(convertTimeToUnix(generateTimeString())))}>
                    <Text>Next</Text>
                </TouchableOpacity>
            </View>
            : <View style={styles.MultitaskModalContent}>
                  <View style={styles.titleContainer}>
                <TouchableOpacity style={styles.nextContainer} onPress={() => setPart2Visible(false)}>
                    <Text>Back</Text>
                </TouchableOpacity>
                    <ThemedText type="title">Preview</ThemedText>
                  </View>
                
                  <TouchableOpacity style={styles.nextContainer} onPress={() => onNext(tagValue, createStartTime(convertTimeToUnix(generateTimeString())))}>
                    <Text>Submit Routine</Text>
                </TouchableOpacity>
              </View>}
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
    
}

interface TagDropdownProps {
    setTagValue: React.Dispatch<React.SetStateAction<string>>;
    customRoutines: Routine[]; 
  }
  const TagDropdown: React.FC<TagDropdownProps> = ({ setTagValue, customRoutines}) => {
    const tags = customRoutines.map(routine => ({
      label: routine.name,
      value: routine.name,
    }));
    return (
      <RNPickerSelect
        onValueChange={(value) => setTagValue(value)}
        items={tags}
      />
    );
  };

const styles = StyleSheet.create({
    MultitaskModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      MultitaskModalContent: {
        flex: .67,
         width: width/1.1,
        // height: height,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
      },
      titleContainer: {
        marginTop: 10,
        marginBottom: 5,
        justifyContent: 'center'
      },
      stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
      },
      nextContainer: {
        left: ((width/1.1) / 2) - (buttonWidth*2 / 2), // Center horizontally more precisely
        width: buttonWidth*2,
        alignItems: 'center',
        marginTop: 'auto',
        marginBottom: 20,
        backgroundColor: 'grey',
      },

})

const androidCustom = StyleSheet.create({
  dropdownContainer: {
    height: height/6, // Adjust this value as needed
    width: '100%', // Or a fixed width if required
    overflow: 'hidden', // Ensures dropdown content does not spill outside
    padding: 10, // Optional padding
  },
})
export default AddRoutineModal;