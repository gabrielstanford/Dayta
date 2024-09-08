import {ModalProps, Modal, View, StyleSheet, Dimensions, Text, TouchableWithoutFeedback, Platform, TouchableOpacity, Keyboard} from 'react-native'
import {useState, useEffect} from 'react'
import {useAppContext} from '@/contexts/AppContext'
import CustomButton from './CustomButton';
import TimeInput from './TimeInput'
import RNPickerSelect from 'react-native-picker-select'
import TimeDropdown from './TimeDropdown'
import { convertTimeToUnix, adjustDateByDays, decimalToDurationTime } from '@/utils/DateTimeUtils';
import { Routine,  Activity } from '@/Types/ActivityTypes';
import CreateRoutineModal from './CreateRoutineModal';
import uuid from 'react-native-uuid'

const {width, height} = Dimensions.get("window");
const buttonWidth = width*0.6
  
  interface MultitaskModalProps extends ModalProps {
    MultitaskModalVisible: boolean;
    onNext: (routine: Routine, startTime: number) => void;
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
  const [relevantRoutine, setRelevantRoutine] = useState<Routine>()
const {customActivities} = useAppContext();
  const [editDurations, setEditDurations] = useState<string[]>([]);
  useEffect(() => {
    if(relevantRoutine) {
    const durs = relevantRoutine.activities.map(activity => decimalToDurationTime(activity.timeBlock.duration/3600))

    setEditDurations(durs);
    }
  }, [relevantRoutine])

  useEffect(() => {
    if(relevantRoutine)
    setPart2Visible(true)
  }, [editDurations])
  const handleTimeChange = (index: number, time: string) => {
    setEditDurations(prevDurations => {
      const updatedDurations = [...prevDurations];
      updatedDurations[index] = time;
      return updatedDurations;
    });
  };

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
        const atHand = customRoutines.find(rout => rout.name==tagValue)
        if(atHand) {
          if(atHand==relevantRoutine) {
            setPart2Visible(true)
          }
          else {
            setRelevantRoutine(atHand);
          }
        }
        else {
          alert("No routine found")
        }
      } 
      else {alert("Please set the routine")}
    }

    const handleSubmit = (texts: [string, number, number][]) => {
      const newActivities: Activity[] = [];
  
      // Iterate over the texts array to build the activities
      texts.forEach((text, index) => {
          const [name, duration, gapBetween] = text;
          const button = customActivities.find(act => act.text === name);
  
          if (button) {

              const newActivity: Activity = {
                  id: uuid.v4() as string,
                  button: button,
                  timeBlock: {
                      startTime: 0,
                      duration: duration,
                      endTime: 0
                  }
              };
              newActivities.push(newActivity);
          }
      });
      if (relevantRoutine) {
        // Create a new array of updated activities
        const newRoutine: Routine = {
          name: relevantRoutine.name,
          activities: newActivities,
          durationBetween: texts.map(text => text[2])
    
        }
    
        // Pass the updated routine and calculated start time to the onNext function
        setPart2Visible(false);
        onNext(newRoutine, createStartTime(convertTimeToUnix(generateTimeString())));
      } else {
        alert("Please enter a routine");
      }
    };
    
    return(
        <Modal 
        transparent={true}
        animationType="slide"
        visible={MultitaskModalVisible}

        {...modalProps}>
          <TouchableWithoutFeedback onPress={() => {onTapOut(); setTimeout(() => {setPart2Visible(false)}, 80)}}>
            <View style={styles.MultitaskModalOverlay}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            {!part2Visible ? 
            
                <View style={styles.MultitaskModalContent}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.title}> Add A Routine</Text>
                  </View>
                <View style={[styles.stepContainer, {paddingTop: 50}]}>
                  <View style={styles.tagStyle}>
                    <TagDropdown customRoutines={customRoutines} tagValue={tagValue} setTagValue={setTagValue} />
                  </View>
                </View>
                <Text style={{paddingLeft: 20, fontWeight: "bold", fontSize: 20, color: "darkcyan"}}>Starting At: </Text>
                <View style={[styles.stepContainer, {paddingTop: 20}]}>
        
                <TimeDropdown
                      selectedHour={selectedHour}
                      selectedMinute={selectedMinute}
                      selectedPeriod={selectedPeriod}
                      onHourChange={handleHourChange}
                      onMinuteChange={handleMinuteChange}
                      onPeriodChange={handlePeriodChange}
                      />
                </View>
                <View style={styles.nextContainer}>
                  <CustomButton title="Next" width={width*0.6} onPress={() => handleNext(createStartTime(convertTimeToUnix(generateTimeString())))} />
                </View>
            </View>
            
            :  <CreateRoutineModal submit={true} style={{}} MultitaskModalVisible={part2Visible} onNext={handleSubmit} customRoutine={relevantRoutine} onTapOut={() => setPart2Visible(false)}/>

            // <View style={styles.MultitaskModalContent}>
            //       <View style={styles.headerSection}>
            //         <CustomButton title="Back" width={width*0.2} fontSize={11} onPress={() => setPart2Visible(false)} />
            //         <View style={styles.title2Container}>
            //           <Text style={styles.title}>Preview</Text>
            //         </View>
            //       </View>
            //         {relevantRoutine && (
            //         <View style={{ flex: 6 }}>
            //           {relevantRoutine.activities.map((activity: Activity, index: number) => (
            //             <View key={activity.id} style={styles.actInfo}>
            //               <Text style={styles.actName}>
            //                 {activity.button.text}:
            //               </Text>
            //               <TimeInput
            //                 custom={"Type2"}
            //                 time={editDurations[index] || '00:00'}
            //                 onTimeChange={time => handleTimeChange(index, time as string)}
            //               />
            //             </View>
            //           ))}
            //         </View>
            //         )}
            //       <View style={styles.nextContainer}>
            //         <CustomButton title="Submit Routine" width={buttonWidth} style={styles.nextContainer} onPress={() => handleSubmit()} />
            //       </View>
            //   </View>
              }
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
    
}

interface TagDropdownProps {
    tagValue: string;
    setTagValue: React.Dispatch<React.SetStateAction<string>>;
    customRoutines: Routine[]; 
  }
  const TagDropdown: React.FC<TagDropdownProps> = ({ tagValue, setTagValue, customRoutines}) => {
    const tags = customRoutines.map(routine => ({
      label: routine.name,
      value: routine.name,
    }));
    return (
      <RNPickerSelect
        value={tagValue}
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
      headerSection: {
        flex: 1.5,
        flexDirection: 'row',
        position: 'relative',
        marginRight: 20,
        paddingLeft: 5,
      },
      titleContainer: {
        width: width*0.7,
        position: 'absolute',
        alignItems: 'center',
        left: ((width/1.1) / 2) - (width*0.7 / 2), // Center horizontally more precisely
        margin: 15,
      },
     title2Container: {
      width: width*0.7,
      position: 'absolute',
      alignItems: 'center',
      left: ((width/1.1) / 2) - (width*0.7 / 2), // Center horizontally more precisely
      margin: 5,
    },
  
    title: {
      fontWeight: 'bold',
      color: 'darkcyan',
      fontSize: 28
    },
    actInfo: {
      flexDirection: 'row', 
      marginBottom: 30,
      justifyContent: 'space-between'
    },
    actName: {
      fontWeight: 'bold',
      color: "darkcyan",
      fontSize: 17,
    },
      stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 10,
        maxHeight: 300, // Example constraint to prevent excessive height

      },
      tagStyle: {
        borderColor: 'black', 
        borderWidth: 2,
        borderRadius: 20,
        padding: 20,
      },
      
      nextContainer: {
        alignItems: 'center',
        marginTop: 'auto',
        marginBottom: 20,
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