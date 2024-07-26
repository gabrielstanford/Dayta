import React, {useState, useEffect} from 'react';
import { Modal, View, Text, StyleSheet, ModalProps, Dimensions, Pressable } from 'react-native';
import {ThemedText} from './ThemedText'
import {Button} from '@rneui/themed'
import {useAppContext} from '@/contexts/AppContext'
const {width, height} = Dimensions.get("window");
const buttonWidth = width/5;
import {AntDesign, FontAwesome5, MaterialCommunityIcons, Ionicons, MaterialIcons} from '@expo/vector-icons';
import uuid from 'react-native-uuid';
import DurationModal from './DurationModal'

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

// Example of button states
type ButtonState = {
  text: string;
  iconLibrary: string;
  icon: string;
  pressed: boolean;
  id?: string;
};

interface MyModalProps extends ModalProps {
  visible: boolean;
  onClose: () => void;
}
interface TimeBlock {
  startTime: number; // Unix timestamp
  duration: number;  // Duration in seconds
  endTime: number;   // Unix timestamp
}
interface activity {
  id : string;
  button: ButtonState;
  timeBlock: TimeBlock;
}
const MyModal: React.FC<MyModalProps> = ({ visible, onClose, ...modalProps }) => {

  const { activities, addActivity, removeActivity } = useAppContext();
  const [buttonStates, setButtonStates] = useState<ButtonState[]>([
    //this is where you add buttons. it's all configured so you just need to add it here and all will work
    //this base of work will make it very easy in the future to add a search component.
    { text: 'Walk', iconLibrary: "fontAwesome5", icon: "walking", pressed: false }, //fontawesome
    { text: 'Breakfast', iconLibrary: "materialCommunityIcons", icon: "food-variant", pressed: false }, //community
    { text: 'Coffee', iconLibrary: "materialCommunityIcons", icon: "coffee", pressed: false }, //community
    { text: 'Gym', iconLibrary: "materialCommunityIcons", icon: "weight-lifter", pressed: false }, //community
    { text: 'Scrolling', iconLibrary: "fontAwesome5", icon: "tiktok", pressed: false }, //fontawesome5
    { text: 'Driving', iconLibrary: "antDesign", icon: "car", pressed: false }, //antdesign
    { text: 'School', iconLibrary: "ionicons", icon: "school", pressed: false }, //ionicons
    { text: 'Relaxation', iconLibrary: "fontAwesome5", icon: "umbrella-beach", pressed: false}, //fontawesome
    { text: 'Work', iconLibrary: "materialIcons", icon: "work", pressed: false }, //materialicons
  ]);

  const setActivities = (index: number) => {
    setButtonStates(prevStates => {
      const newStates = [...prevStates];
      newStates[index].pressed = !newStates[index].pressed;
      const currentButton = newStates[index]
      if(currentButton.pressed) {
        setTimeout(() => {
          const activity = {id: uuid.v4() as string, button: newStates[index], timeBlock: {startTime: 5, duration: 6, endTime: 11}};
          //now send that id to the current button so it knows which activity it's linked to
          currentButton.id = activity.id;
          addActivity(activity);
        }, 0);
      }
      else {
      // Add the pressed activity to context
        setTimeout(() => {
          if(currentButton.id) {removeActivity(currentButton.id)}
        }, 0);
      }
      
      return newStates;
    });
  }
  const [durationModalVisible, setDurationModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ButtonState | null>(null);
  const [selectedActivityIndex, setSelectedActivityIndex] = useState<number | null>(null);

  const handlePress = (index: number) => {

    //add a pop-up modal requesting duration
      const activity = { ...buttonStates[index] };

      if(activity.pressed) {
        buttonStates[index].pressed=false
        setTimeout(() => {
          if(activity.id) {removeActivity(activity.id as string)}
        }, 0);
      }
      else {
        setSelectedActivity(activity);
        //note index is the index of the buttons, which indicates the activity it points it
        setSelectedActivityIndex(index);
        setDurationModalVisible(true);
        //if the activity was already pressed, change logic to unclick it (no button popup)
      }
  };
    const handleDurationSubmit = (block: TimeBlock) => {
      if (selectedActivity && selectedActivityIndex !== null) {
      setButtonStates(prevStates => {
        const newStates = [...prevStates];
        newStates[selectedActivityIndex].pressed = !newStates[selectedActivityIndex].pressed;
        const currentButton = newStates[selectedActivityIndex]
          setTimeout(() => {
            const activity = {id: uuid.v4() as string, button: newStates[selectedActivityIndex], timeBlock: block};
            console.log(activity)
            //now send that id to the current button so it knows which activity it's linked to
            currentButton.id = activity.id;
            addActivity(activity);
          }, 0);
        
        return newStates;
      });
      setDurationModalVisible(!durationModalVisible);
      }
    }
    // Define rows for grid layout
    const rows = [
      buttonStates.slice(0, 3), // First row
      buttonStates.slice(3, 6), // Second row
      buttonStates.slice(6, 9)  // Third row
    ];  

    const renderButtons = () => {
      return rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.quickAddRow}>
          {row.map((button, buttonIndex) => {
            const IconComponent = getIconComponent(button.iconLibrary);
  
            return (
              <View key={buttonIndex} style={styles.addButtonContainer}>
                <Pressable
                  style={styles.quickAddButton}
                  onPress={() => handlePress(rowIndex * 3 + buttonIndex)}
                >
                  <IconComponent
                    name={button.icon}
                    size={width / 6.25}
                    color={button.pressed ? 'black' : 'white'}
                  />
                </Pressable>
                <ThemedText type="subtitle">{button.text}</ThemedText>
              </View>
            );
          })}
        </View>
      ));
    };
    const resetButtonStates = () => {
      setButtonStates(prevStates =>
        prevStates.map(button => ({
          ...button,
          pressed: false
        }))
      );
    };
    const closeModal = () => {
      resetButtonStates();
      onClose();
    }

    useEffect(() => {
      if (!visible) {
        setButtonStates(prevStates => prevStates.map(state => ({ ...state, pressed: false, id: undefined })));
      }
    }, [visible]);
  return (
    
    <Modal
      transparent={false}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
      {...modalProps}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.titleContainer}>
          <ThemedText type="title">Quick Add</ThemedText>
        </View>
        <View style={styles.quickAddContainer}>
          {renderButtons()}
        </View>
        <View style={styles.buttonContainer}>
          <Button buttonStyle={styles.closeButton} color="secondary" title="Close" onPress={() => closeModal()} />
        </View>
          {/* {durationModalVisible ? <><DurationModal durationModalVisible={durationModalVisible} onClose={() => handleDurationSubmit(30)} /></> : <></>} */}
      </View>
      <View>
        <DurationModal durationModalVisible={durationModalVisible} onClose={handleDurationSubmit}/>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'darkcyan',
    paddingTop: height/18,
    position: 'relative',
  },
   titleContainer: {
    alignItems: 'center',
    padding: 10,
  },
  quickAddContainer: {
    paddingTop: 15,

  },
  quickAddRow: {
    flexDirection: 'row',
    margin: 15,
    justifyContent: 'space-around',
  },

  addButtonContainer: {

  },
  quickAddButton: {
    width: buttonWidth,
  },
  buttonPressed: {
    width: buttonWidth,
    backgroundColor: 'black',
  },
  
  //close button
  buttonContainer: {
    position: 'absolute', // Absolute positioning to overlay everything
    bottom: height/7, // Space from the bottom of the container
    left: (width / 2) - (buttonWidth / 2), // Center horizontally more precisely
    width: buttonWidth
  },
  closeButton: {
    width: buttonWidth,
  },
});

export default MyModal;
