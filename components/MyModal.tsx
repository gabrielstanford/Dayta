import React, {useState, useEffect} from 'react';
import { Modal, View, Text, StyleSheet, ModalProps, Dimensions, TouchableOpacity} from 'react-native';
import {ThemedText} from './ThemedText'
import CustomButton from './CustomButton'
import {useAppContext} from '@/contexts/AppContext'
const {width, height} = Dimensions.get("window");
const buttonWidth = width/5;
const buttonHeight = height/19;
const titleWidth = width/1.5;
import {AntDesign, FontAwesome5, MaterialCommunityIcons, Ionicons, MaterialIcons} from '@expo/vector-icons';
import uuid from 'react-native-uuid';
import DurationModal from './DurationModal'
import MultitaskModal from './MultitaskModal'
import ActivitySearchModal from './ActivitySearchModal'
import { useCustomSet} from '@/Data/CustomSet'
import Toast from 'react-native-toast-message'
import {ButtonState, Activity, TimeBlock, Routine} from '@/Types/ActivityTypes'
import AddRoutineModal from './AddRoutineModal';

//next: add search
//after: add functionality to change what shows up on quick add based on an array of 9 quick add options that we can pass in

// Define specific types for each icon component
type AntDesignIcon = typeof AntDesign;
type FontAwesome5Icon = typeof FontAwesome5;
type MaterialCommunityIconsIcon = typeof MaterialCommunityIcons;
type IoniconsIcon = typeof Ionicons;
type MaterialIconsIcon = typeof MaterialIcons;

// Union type for all icon components
type IconComponent =
  | AntDesignIcon
  | FontAwesome5Icon
  | MaterialCommunityIconsIcon
  | IoniconsIcon
  | MaterialIconsIcon;

// Define types for the icon props based on the icon component's glyphMap
type AntDesignProps = { name: keyof typeof AntDesign.glyphMap };
type FontAwesome5Props = { name: keyof typeof FontAwesome5.glyphMap };
type MaterialCommunityIconsProps = { name: keyof typeof MaterialCommunityIcons.glyphMap };
type IoniconsProps = { name: keyof typeof Ionicons.glyphMap };
type MaterialIconsProps = { name: keyof typeof MaterialIcons.glyphMap };

// Union type for all icon props
type IconProps =
  | AntDesignProps
  | FontAwesome5Props
  | MaterialCommunityIconsProps
  | IoniconsProps
  | MaterialIconsProps;

// Utility function to get the icon component based on the library name
const getIconComponent = (iconLibrary: string): IconComponent => {
  switch (iconLibrary) {
    case 'antDesign':
      return AntDesign as AntDesignIcon;
    case 'fontAwesome5':
      return FontAwesome5 as FontAwesome5Icon;
    case 'materialCommunityIcons':
      return MaterialCommunityIcons as MaterialCommunityIconsIcon;
    case 'ionicons':
      return Ionicons as IoniconsIcon;
    case 'materialIcons':
      return MaterialIcons as MaterialIconsIcon;
    default:
      return FontAwesome5 as FontAwesome5Icon; // Default to FontAwesome5 if the library name is unknown
  }
};


interface MyModalProps extends ModalProps {
  visible: boolean;
  onClose: () => void;
}

const MultiButton: ButtonState = {text: 'Multi-Activity', iconLibrary: "fontAwesome5", keywords: [], tags: [], icon: "tasks", pressed: false}

const MyModal: React.FC<MyModalProps> = ({ visible, onClose, ...modalProps }) => {
  const { addActivity, customActivities, customRoutines, addRoutineActivities} = useAppContext();
  const {finalArray} = useCustomSet();
  const [searchModalVisible, setSearchModalVisible] = useState<boolean>(false);
  const [MultitaskModalVisible, setMultitaskModalVisible] = useState<boolean>(false);
  const [addRoutineModal, setAddRoutineModal] = useState<boolean>(false);
  const [durationModalVisible, setDurationModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ButtonState | null>(null);
  const [multiActivity, setMultiActivity] = useState<ButtonState[] | null>(null);
  //const [multiTaskButton, setMultiTaskButton]

  const handlePress = (text: string) => {

      const activity = customActivities.find((item: ButtonState) => item.text===text)
      
      if(activity) {
      setSelectedActivity(activity);
      }
      if(searchModalVisible) {
        setSearchModalVisible(false);
      }
      setDurationModalVisible(true);
      
  };

  const handleRoutineSubmit = (routine: Routine, startTime: number) => {
    setAddRoutineModal(false);
  
    if (routine) {
      const { activities, durationBetween = [] } = routine;
  
      const populateTimes = (activities: Activity[], betweens: number[]) => {
        const times: number[] = [];
        let currentTime = startTime;
        const startDate = new Date(currentTime*1000)
        if(startDate.getHours()<4) {
          currentTime = currentTime+86400
        }
        activities.forEach((activity, index) => {
          const activityDuration = activity.timeBlock.duration;
          let activityStartTime = currentTime;
          const activityEndTime = activityStartTime + activityDuration;

          times.push(activityStartTime, activityEndTime);
  
          // Calculate the start time for the next activity
          if (index < betweens.length) {
            const nextGap = betweens[index];
            if (nextGap < 0) {
              // Overlapping activities
              currentTime = Math.min(activityEndTime + nextGap, activityEndTime);
            } else {
              // Non-overlapping activities
              currentTime = activityEndTime + nextGap;
            }
          } else {
            // No more gaps provided, add a default gap of 60 seconds
            currentTime = activityEndTime + 60;
          }
        });
  
        return times;
      };
  
      let updatedActivities = [...routine.activities];
  
      // Calculate times for activities
      const times = populateTimes(updatedActivities, durationBetween);
  
      // Update each activity with calculated start and end times
      updatedActivities = updatedActivities.map((activity, index) => {
        if (index * 2 < times.length) {
          return {
            ...activity,
            timeBlock: {
              ...activity.timeBlock,
              startTime: times[index * 2],
              endTime: times[index * 2 + 1],
            },
            id: uuid.v4() as string, // Assign new unique ID
            parentRoutName: routine.name
          };
        }
        return activity;
      });
  
      // Add the updated activities to the journal
      addRoutineActivities(updatedActivities);
      Toast.show({ type: 'success', text1: 'Added Activity To Journal!' });
    } else {
      alert("Please Add A Routine");
    }
  };
  
  
    const handleDurationSubmit = (block: TimeBlock) => {

      setTimeout(() => {
        if(selectedActivity) {
        selectedActivity.id="notimportant"
        const activity = {id: uuid.v4() as string, button: selectedActivity as ButtonState, timeBlock: block};
        addActivity(activity);
        // addCustomActivity(  { text: 'Eating BOUT', iconLibrary: "fontAwesome5", icon: "utensils", keywords: ['Restaurant', 'Cafe'], pressed: false, tags: ['Food/Drink'] },) 
        Toast.show({ type: 'success', text1: 'Added Activity To Journal!'})
        }
        else if(multiActivity) {
          let actArray = []
          for(let i=0; i<multiActivity.length; i++) {
          multiActivity[i].id="notimportant"
          actArray[i] = {id: uuid.v4() as string, button: multiActivity[i] as ButtonState, timeBlock: block};
          
          }
          const multiTask = {id: uuid.v4() as string, button: MultiButton as ButtonState, timeBlock: block, Multi: actArray};
          addActivity(multiTask);
          Toast.show({ type: 'success', text1: 'Added Activity To Journal!'})
        }
        else {
          console.log("no selected activity")
        }
      }, 0);
      setDurationModalVisible(false);
    }

    const handleMultitaskNext = (texts: string[]) => {
      // const activity = ShuffledActivityButtons.find(item => item.text===text)
      // if(activity)
      // setSelectedActivity(activity);
      // if(searchModalVisible) {
      //   setSearchModalVisible(false);
      // }
      // setDurationModalVisible(true);
      
      const activities = customActivities.filter((item: ButtonState) => texts.includes(item.text))
      if(activities) {
      setMultiActivity(activities)
      setSelectedActivity(null)
      }
      setMultitaskModalVisible(false)
      setDurationModalVisible(true)

    }
    // Define rows for grid layout
    const rows = [
      finalArray.slice(0, 3), // First row
      finalArray.slice(3, 6), // Second row
      finalArray.slice(6, 9)  // Third row
    ];  

    const renderButtons = () => {
      return rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.quickAddRow}>
          {row.map((button: ButtonState, buttonIndex: number) => {
            const IconComponent = getIconComponent(button.iconLibrary);
  
            return (
              <View key={buttonIndex} style={styles.addButtonContainer}>
                <TouchableOpacity
                  style={styles.quickAddButton}
                  onPress={() => handlePress(button.text)}
                >
                  <IconComponent
                    name={button.icon}
                    size={width / 6.25}
                    color="#F5F5F5"
                  />
                </TouchableOpacity>
                <View style={styles.buttonTextContainer}>
                  <ThemedText type="buttons">{button.text}</ThemedText>
                </View>
              </View>
            );
          })}
        </View>
      ));
    };
    const addRoutine = () => {
      if(customRoutines.length>0) {
        setAddRoutineModal(true);
      }
      else {
        alert("First add a routine in the personalize tab!")
      }
    }
    const closeModal = () => {
      onClose();
    }
    if(durationModalVisible && !(selectedActivity || multiActivity)) {
      alert("Please Select An Activity")
      setDurationModalVisible(false)
    }
    return (
      <Modal
      transparent={false}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
      {...modalProps}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.headerSection}>
            <CustomButton title="Close" width={width*0.22} fontSize={11} onPress={() => closeModal()} />
          <View style={styles.titleContainer}>
            <ThemedText type="titleText" style={{
            fontSize: titleWidth/7,
            }}>Quick Add</ThemedText>
          </View>
          </View>
        <View style={styles.quickAddContainer}>
          {renderButtons()}
        </View>
          <View style={styles.endButtons}>
          <CustomButton title="Other" width={width*0.4} onPress={() => setSearchModalVisible(true)} />
          {/* <Button onPress={() => {setTimeout(() => {addCustomActivity(  { text: 'Eating CLOUT', iconLibrary: "fontAwesome5", icon: "utensils", keywords: ['Restaurant', 'Cafe'], pressed: false, tags: ['Food/Drink'] },) 
            }, 0); setDurationModalVisible(!durationModalVisible)}}>Custom Act Test</Button> */}
            <ActivitySearchModal visible={searchModalVisible} onClick={handlePress} onClose={() => setSearchModalVisible(false)} />
            <DurationModal style={styles.durationModal} durationModalVisible={durationModalVisible} onSubmit={handleDurationSubmit} onTapOut={() => setDurationModalVisible(false)} activity={selectedActivity as ButtonState}/>
          {/* <CustomButton title="Multi-Activity" width={width*0.4} onPress={() => setMultitaskModalVisible(true)} /> */}
          <MultitaskModal style={styles.durationModal} MultitaskModalVisible={MultitaskModalVisible} onNext={handleMultitaskNext} onTapOut={() => setMultitaskModalVisible(false)}/>
          <CustomButton title="Add Routine" width={width*0.4} onPress={addRoutine} />
          <AddRoutineModal style={styles.durationModal} MultitaskModalVisible={addRoutineModal} onNext={handleRoutineSubmit} onTapOut={() => setAddRoutineModal(false)} />
          </View>
       </View>
      <Toast />
    </Modal>
    );
  };
  
  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: '#1B1B1B',
      paddingTop: height/18,
      position: 'relative'
    },
      headerSection: {
        flex: 1.5,
        flexDirection: 'row',
        position: 'relative',
        alignItems: 'flex-start',
        marginRight: 20,
        paddingLeft: 5,
      },

     titleContainer: {
      flex: 1,
      width: titleWidth,
      position: 'absolute',
      alignItems: 'center',
      left: (width / 2) - (titleWidth / 2), // Center horizontally more precisely
    },
    
    endButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 20,
      paddingBottom: 50,
    },
    buttonTextContainer: {
      flex: 1,
      alignItems: 'flex-start'
    },
    quickAddContainer: {
      flex: 7,
      alignItems: 'center',
    },
    quickAddRow: {
      flex: 1,
      width: width,
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
  
    addButtonContainer: {
      flex: 1,
      alignItems: 'center'
    },
    quickAddButton: {
      width: buttonWidth,
    },
    durationModal: {
      height: height
    },
  });

export default MyModal;
