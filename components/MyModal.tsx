import React, {useState} from 'react';
import { Modal, View, Text, StyleSheet, ModalProps, Dimensions } from 'react-native';
import {ThemedText} from './ThemedText'
import {Button} from '@rneui/themed'
import {useAppContext} from '@/contexts/AppContext'
const {width, height} = Dimensions.get("window");
const buttonWidth = width/5;

interface MyModalProps extends ModalProps {
  visible: boolean;
  onClose: () => void;
}

const MyModal: React.FC<MyModalProps> = ({ visible, onClose, ...modalProps }) => {

  const {setText} = useAppContext();
  console.log('MyModal component rendered');
  const [buttonStates, setButtonStates] = useState([
    { text: 'Walk', pressed: false },
    { text: 'Breakfast', pressed: false },
    { text: 'Coffee', pressed: false },
    { text: 'Gym', pressed: false },
    { text: 'Scrolling', pressed: false },
    { text: 'Driving', pressed: false },
    { text: 'School', pressed: false },
    { text: 'Relaxation', pressed: false },
    { text: 'Work', pressed: false },
  ]);

  const handlePress = (index: number) => {
    setButtonStates(prevStates => {
      const newStates = [...prevStates];
      newStates[index].pressed = true; // Set the pressed button's state to true
      return newStates;
    });
    console.log('Adding activity:', buttonStates[index].text);
    setText(buttonStates[index].text);
  };
    // Define rows for grid layout
    const rows = [
      buttonStates.slice(0, 3), // First row
      buttonStates.slice(3, 6), // Second row
      buttonStates.slice(6, 9)  // Third row
    ];  

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
        {rows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.quickAddRow}>
              {row.map((button, buttonIndex) => (
                <View key={buttonIndex} style={styles.addButtonContainer}>
                  <Button
                    buttonStyle={button.pressed ? styles.buttonPressed : styles.quickAddButton}
                    color="success"
                    title=""
                    onPress={() => handlePress(rowIndex * 3 + buttonIndex)}
                  />
                  <ThemedText type="subtitle">{button.text}</ThemedText>
                </View>
              ))}
            </View>
          ))}
        </View>
        <View style={styles.buttonContainer}>
          <Button buttonStyle={styles.closeButton} color="secondary" title="Close" onPress={onClose} />
        </View>
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
