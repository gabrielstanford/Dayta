import { StyleSheet, Pressable, View, Dimensions} from 'react-native';
import PlusButton from '@/components/PlusButton'
import { ThemedText } from '@/components/ThemedText';
//import firestore from '@react-native-firebase/firestore'
import { Button, ButtonGroup, withTheme, Text } from '@rneui/themed';
import { useState } from 'react';
import {Link} from 'expo-router'
import AntDesign from '@expo/vector-icons/AntDesign';
import MyModal from '@/components/MyModal'
import { AppProvider, useAppContext } from '@/contexts/AppContext';

// Get screen width. This is for more responsive layouts
const { width, height } = Dimensions.get('window');
const buttonWidth = width/6.25

export default function Journal() {
  //toggle the state of the modal
    const [modalVisible, setModalVisible] = useState(false);
    const toggleModal = () => setModalVisible(!modalVisible)

    const { text } = useAppContext();
    console.log('Index component rendered with text:', text);
  return (
    <AppProvider>
      <View style={styles.layoutContainer}>
        <MyModal visible={modalVisible} onClose={toggleModal} />
        <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <ThemedText type="titleText">My Journal</ThemedText>
        </View>
        <View style={styles.stepContainer}>
          <ThemedText type="journalText">Activity 1: {text}</ThemedText>
        </View>
        <View style={styles.stepContainer}>
          <ThemedText type="journalText">Activity 2: 90 Minute Pomodoro</ThemedText>
        </View>
        <View style={styles.stepContainer}>
          <ThemedText type="journalText">Activity 3: Coffee</ThemedText>
        </View>
        </View>
        <View style={styles.plusButtonContainer}>
          <Pressable onPress={toggleModal}>
          <AntDesign name="pluscircle" size={width/6.25} color="black" />
          </Pressable>
        </View>
      </View>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
 //colors darkcyan, mintcream, bisque
 layoutContainer: {
  flex: 1,
  paddingTop: height/18,
  backgroundColor: 'darkcyan',
  position: 'relative', // Container must be relative for absolute positioning of child
},
contentContainer: {
  flex: 1,
  paddingBottom: height/11.6, // Space at the bottom to accommodate the button
},
titleContainer: {
  alignItems: 'center',
  padding: 10,
},
stepContainer: {
  padding: 8,
  marginBottom: 10,
  borderColor: 'bisque',
  borderWidth: 2
},
plusButtonContainer: {
    position: 'absolute', // Absolute positioning to overlay everything
    bottom: height/40.6, // Space from the bottom of the container
    left: (width / 2) - (buttonWidth / 2), // Center horizontally more precisely
    width: buttonWidth
},
});