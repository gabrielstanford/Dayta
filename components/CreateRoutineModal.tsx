import {ModalProps, Modal, View, StyleSheet, Dimensions, Text, TouchableWithoutFeedback, Platform, TouchableOpacity, Keyboard, KeyboardAvoidingView} from 'react-native'
import {ThemedText} from './ThemedText'
import CustomButton from './CustomButton'
import TimeDropdown from './TimeDropdown'
import {useState, useEffect} from 'react'
import Slider from '@react-native-community/slider';
import {useAppContext} from '@/contexts/AppContext'
import {useAuth} from '@/contexts/AuthContext'
import FetchDayActivities from '@/Data/FetchDayActivities'
import ActivitySearchModal from './ActivitySearchModal'
import { SearchBar } from '@rneui/themed'
import TimeInput from './TimeInput'
import { RoutineActivity, Routine } from '@/Types/ActivityTypes'
import { create } from 'react-test-renderer'
import RNPickerSelect from 'react-native-picker-select'
import { Ionicons } from '@expo/vector-icons'
import { formatSecondsToHHMM } from '@/utils/DateTimeUtils'

const {width, height} = Dimensions.get("window");
const buttonWidth = width*0.6
  
  interface MultitaskModalProps extends ModalProps {
    MultitaskModalVisible: boolean;
    onNext: (text: [string, number, number][]) => void;
    onTapOut: () => void;
    customRoutine?: Routine;
  }

  function timeStringToSeconds(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
  
    const totalSeconds = (hours * 3600) + (minutes * 60);
    return totalSeconds;
  }

const CreateRoutineModal: React.FC<MultitaskModalProps> = ({ MultitaskModalVisible, onNext, onTapOut, customRoutine, ...modalProps }) => {

  const [multiSearchVisible, setMultiSearchVisible] = useState(false);
  const [activityNum, setActivityNum] = useState<number>(1)
  const filler = [
    { name: "", duration: "00:10", tag: "Consecutive", gapBetween: "00:01" },
    { name: "", duration: "00:10", tag: "Consecutive", gapBetween: "00:01" }]
  const [routineActivities, setRoutineActivities] = useState<RoutineActivity[]>(filler)
  useEffect(() => {
    if(customRoutine) {
      console.log(customRoutine)
      let tempRout: RoutineActivity[] = []
      for(let i=0; i<customRoutine.activities.length; i++) {
        let act = customRoutine.activities[i];
        let between = formatSecondsToHHMM(customRoutine.durationBetween[i])
        let tag = "Consecutive"
        if(customRoutine.durationBetween[i]>60) {
          tag="Gap Between"
        }
        else if(customRoutine.durationBetween[i]<60) {
          tag="Overlapping"
          between="00:01"
        }
        tempRout[i] = {name: act.button.text, duration: formatSecondsToHHMM(act.timeBlock.duration), tag: tag, gapBetween: between}
      }
      console.log('temprout: ', tempRout)
      setRoutineActivities(tempRout)
    }
    else {
      setRoutineActivities(filler)
    }
  }, [customRoutine])

  const addActivity = () => {
    if (routineActivities.length < 10) {
      setRoutineActivities((prev) => [
        ...prev,
        { name: "", duration: "00:10", tag: "Consecutive", gapBetween: "00:01" }
      ]);
    }
  };
  const removeActivity = (index: number) => {
    if(routineActivities.length>2) {
    setRoutineActivities((prev) => prev.filter((_, i) => i !== index));
    }
    else {
      alert("Routines must have at least 2 activities!")
    }
  };
// Update a specific activity by index
    const updateActivity = (index: number, updatedFields: Partial<RoutineActivity>) => {
      console.log(index, updatedFields)
      setRoutineActivities(prevActivities => 
        prevActivities.map((activity, i) => 
          i === index ? { ...activity, ...updatedFields } : activity
        )
      );
    };
  // const [tag4Value, setTag4Value] = useState<string>("Consecutive")

  const multiSearchPress = (text: string) => {
      // Update the selected activity in the routineActivities array
      updateActivity(activityNum - 1, { name: text });

      // Hide the search modal after selecting an activity
      setMultiSearchVisible(false);
  };

      const createFull: () => [string, number, number][] = () => {
        // Initialize arrays to hold durations and gaps
      
        const activityDetails: [string, number, number][] = [];
        
        // Loop through routineActivities to build activityDetails
        routineActivities.forEach((activity, index) => {
          if(activity.duration=='00:00') {
            alert("Please make sure all activities have durations");
            return;
          }
          else if(activity.name=="") {
            alert("Please make sure all activities have names");
            return;
          }
          else {
            const duration = timeStringToSeconds(activity.duration);
            let gapBetween = 0;

            // Determine the gap between activities if not the last activity
            if (index < routineActivities.length - 1) {
                gapBetween = timeStringToSeconds(activity.gapBetween || '00:01');

                if (activity.tag === "Overlapping") {
                    gapBetween = -duration;
                }
                if(activity.tag === "Consecutive") {
                  gapBetween = 60
                }
            }

            // Add the current activity's details to the array
            activityDetails.push([activity.name || `Activity ${index + 1}`, duration, gapBetween]);
          }
        });
        console.log(activityDetails)
        return activityDetails;
    };

  
    return(
        <Modal 
        transparent={true}
        animationType="slide"
        visible={MultitaskModalVisible}

        {...modalProps}>
          <TouchableWithoutFeedback onPress={onTapOut}>
            <View 
            style={styles.MultitaskModalOverlay}>
            
            <View style={{flex: 1, justifyContent: 'center'}}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <KeyboardAvoidingView 
            style={styles.MultitaskModalContent}
            // enabled={false}
            keyboardVerticalOffset={250}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            // contentContainerStyle={styles.contContStyle}
            >
            {/* <View style={styles.MultitaskModalContent}> */}
                  <View style={styles.titleContainer}>
                    <ThemedText type="title"> Select Activities </ThemedText>
                  </View>
              {/* Dynamically render each activity input group */}
            {routineActivities.map((activity, index) => (
              <View key={index}>
                <View style={styles.stepContainer}>
                  <TouchableOpacity 
                    style={styles.actSearchButton} 
                    onPress={() => { setActivityNum(index + 1); setMultiSearchVisible(true); }}
                  >
                    <Text>{activity.name || `Activity ${index + 1}`}</Text>
                  </TouchableOpacity>
                  <View style={{ flex: 1 }}>
                    <TimeInput 
                      custom="Type1" 
                      time={activity.duration || ''} 
                      onTimeChange={(time) => updateActivity(index, { duration: time as string})}
                    />
                  </View>
                        {/* Add the trash can icon here */}
                  <TouchableOpacity onPress={() => removeActivity(index)}>
                    <Ionicons name="trash-bin-outline" size={24} color="red" />
                  </TouchableOpacity>
                </View>

                {index < routineActivities.length - 1 && (
                  <View style={styles.intraStepContainer}>
                    <TagDropdown 
                      tagValue={activity.tag || ''} 
                      setTagValue={(value) => updateActivity(index, { tag: value as string })}
                    />
                    {activity.tag === 'Gap Between' && (
                      <TimeInput 
                        custom="Type2" 
                        time={activity.gapBetween || ''} 
                        onTimeChange={(time) => updateActivity(index, { gapBetween: time as string })}
                      />
                    )}
                  </View>
                )}
              </View>
            ))}
              {/* Add Activity Button */}
              {routineActivities.length < 5 && (
                <View style={styles.addActivityContainer}>
                  <CustomButton title="Add" width={width*0.3} onPress={addActivity} />
                </View>
              )}

                {/* <View style={styles.intraStepContainer}>
                  <TagDropdown tagValue={tag4Value} setTagValue={setTag4Value} />
                </View> */}
                <ActivitySearchModal visible={multiSearchVisible} onClick={multiSearchPress} onClose={() => setMultiSearchVisible(false)} />

            </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
            <View style={styles.nextContainer}>
                  <CustomButton title="Next" onPress={() => onNext(createFull())} />
              </View>
            </View>
          
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
    
}

interface TagDropdownProps {
  tagValue: string;
  setTagValue: React.Dispatch<React.SetStateAction<string>>;
}
const TagDropdown: React.FC<TagDropdownProps> = ({tagValue, setTagValue}) => {
  const tags = [
    {label: "Consecutive", value: "Consecutive"},
    {label: "Overlapping", value: "Overlapping"},
    {label: "Gap Between", value: "Gap Between"}
  ];
  return (
    <View style={{borderColor: 'grey', borderWidth: 1, borderRadius: 20, padding: 3}}>
    <RNPickerSelect
      value={tagValue}
      onValueChange={(value) => setTagValue(value)}
      items={tags}
    />
    </View>
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
        flex: 0.8,
        width: width/1,
        height: height,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
      },
      titleContainer: {
        marginTop: 10,
        marginBottom: 5,
        alignItems: 'center'
      },
      stepContainer: {
        // flex: .7,
        flexDirection: 'row',
        alignItems: 'center',
      },
      intraStepContainer: {
        
        flexDirection: 'row',
        alignItems: 'flex-start',
      },
      actSearchButton: {
        backgroundColor: '#DDDDDD',
        padding: 20,
        flex: 1
      },
      addActivityContainer: {

      },
      nextContainer: {
        alignItems: 'center'
        // left: ((width) / 2) - (buttonWidth / 2), // Center horizontally more precisely
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
export default CreateRoutineModal;