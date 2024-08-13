import React, {useState, useEffect} from 'react';
import { Modal, View, Text, StyleSheet, ModalProps, Dimensions, TouchableOpacity} from 'react-native';
import {ThemedText} from './ThemedText'
import {Button} from '@rneui/themed'
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
import { useCustomSet} from '@/Data/ActivityButtons'
import FetchActivityButtons from '@/Data/FetchCustomActivities'
import Toast from 'react-native-toast-message'
import {ButtonState, Activity, TimeBlock} from '@/Types/ActivityTypes'


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

const MultiButton: ButtonState = {text: 'Multi-Activity', iconLibrary: "fontAwesome5", keywords: [], icon: "tasks", pressed: false}

const MyModal: React.FC<MyModalProps> = ({ visible, onClose, ...modalProps }) => {
  const { addActivity, shuffledActButtons } = useAppContext();
  const {finalArray} = useCustomSet(shuffledActButtons);

  const [searchModalVisible, setSearchModalVisible] = useState<boolean>(false);
  const [MultitaskModalVisible, setMultitaskModalVisible] = useState<boolean>(false);
  const [durationModalVisible, setDurationModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ButtonState | null>(null);
  const [multiActivity, setMultiActivity] = useState<ButtonState[] | null>(null);
  //const [multiTaskButton, setMultiTaskButton]

  const handlePress = (text: string) => {

      const activity = shuffledActButtons.find((item: ButtonState) => item.text===text)
      
      if(activity) {
      setSelectedActivity(activity);
      }
      if(searchModalVisible) {
        setSearchModalVisible(false);
      }
      setDurationModalVisible(true);
      
  };
    const handleDurationSubmit = (block: TimeBlock) => {

      setTimeout(() => {
        if(selectedActivity) {
        selectedActivity.id="notimportant"
        const activity = {id: uuid.v4() as string, button: selectedActivity as ButtonState, timeBlock: block};
        addActivity(activity);
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
      setDurationModalVisible(!durationModalVisible);
    }

    const handleMultitaskNext = (texts: string[]) => {
      // const activity = ShuffledActivityButtons.find(item => item.text===text)
      // if(activity)
      // setSelectedActivity(activity);
      // if(searchModalVisible) {
      //   setSearchModalVisible(false);
      // }
      // setDurationModalVisible(true);
      
      const activities = shuffledActButtons.filter((item: ButtonState) => texts.includes(item.text))
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
                    color="white"
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

    const closeModal = () => {
      onClose();
    }
    if(durationModalVisible && !(selectedActivity || multiActivity)) {
      alert("Please Select An Activity")
      setDurationModalVisible(false)
    }
    return (
      <Modal
      key={shuffledActButtons.length}
      transparent={false}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
      {...modalProps}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.headerSection}>
            <TouchableOpacity onPress={() => closeModal()} style={styles.closeButton}>
            <View style={styles.buttonContainer}>
              <Text style={{fontSize: 21, color: 'white'}}>Close</Text>
          </View>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <ThemedText type="titleText">Quick Add</ThemedText>
          </View>
          </View>
        <View style={styles.quickAddContainer}>
          {renderButtons()}
        </View>
        <View style={styles.searchContainer}>
          <Button onPress={() => setSearchModalVisible(true)}>Other</Button>
            <ActivitySearchModal visible={searchModalVisible} onClick={handlePress} onClose={() => setSearchModalVisible(false)} />
            <DurationModal style={styles.durationModal} durationModalVisible={durationModalVisible} onSubmit={handleDurationSubmit} onTapOut={() => setDurationModalVisible(false)} activity={selectedActivity as ButtonState}/>
          <Button color="secondary" onPress={() => setMultitaskModalVisible(true)}>Multi-Activity Block</Button>
          <MultitaskModal style={styles.durationModal} MultitaskModalVisible={MultitaskModalVisible} onNext={handleMultitaskNext} onTapOut={() => setMultitaskModalVisible(false)}/>

        </View>
      </View>
      <Toast />
    </Modal>
    );
  };
  
  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'darkcyan',
      paddingTop: height/18,
      position: 'relative'
    },
      headerSection: {
        flex: 1.5,
        flexDirection: 'row',
        position: 'relative'
      },
        //close button
    buttonContainer: {
      padding: 10
    },
    closeButton: {
      width: buttonWidth,
      height: buttonHeight,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#b4245c',
    },
     titleContainer: {
      flex: 1,
      padding: 10,
      width: titleWidth,
      position: 'absolute',
      alignItems: 'center',
      left: (width / 2) - (titleWidth / 2), // Center horizontally more precisely
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
      flex: 1
    },
    searchContainer: {
      flex: 1.5
    },
  });

export default MyModal;
