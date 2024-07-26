import { StyleSheet, Pressable, View, Dimensions} from 'react-native';
import PlusButton from '@/components/PlusButton'
import { ThemedText } from '@/components/ThemedText';
//import firestore from '@react-native-firebase/firestore'
import { Button, ButtonGroup, withTheme, Text } from '@rneui/themed';
import { useState } from 'react';
import {Link} from 'expo-router'
import {AntDesign, MaterialIcons} from '@expo/vector-icons';
import MyModal from '@/components/MyModal'
import { AppProvider, useAppContext } from '@/contexts/AppContext';

// Get screen width. This is for more responsive layouts
const { width, height } = Dimensions.get('window');
const buttonWidth = width/6.25

function Journal() {
  //toggle the state of the modal
    const [modalVisible, setModalVisible] = useState(false);
    const toggleModal = () => setModalVisible(!modalVisible)

    const { activities, removeActivity } = useAppContext();

    const removeActiv = (index: number) => {
        removeActivity(activities[index].id);
    }
  return (
    
      <View style={styles.layoutContainer}>
        <MyModal visible={modalVisible} onClose={toggleModal} />
        <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <ThemedText type="titleText">My Journal</ThemedText>
        </View>
        {activities.length>0 ? 
          activities.map((activity, index) => (
            <View key={index} style={styles.stepContainer}>
              <ThemedText type="journalText">{activity.button.text}</ThemedText>
              <Pressable onPress={() => removeActiv(index)}>
                <MaterialIcons name="delete" size={width/15} color="black" />
              </Pressable>
            </View>
          )) : 
          <Pressable onPress={toggleModal}>
            <View style={styles.stepContainer}>  
              <ThemedText type="journalText">Add Your First Activity For The Day!</ThemedText>
            </View>
          </Pressable>}
        </View>
        <View style={styles.plusButtonContainer}>
          <Pressable onPress={toggleModal}>
            <AntDesign name="pluscircle" size={width/6.25} color="black" />
          </Pressable>
        </View>
      </View>
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
  flexDirection: 'row',
  justifyContent: 'space-between',
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

const Index: React.FC = () => {
  return (
    <AppProvider>
      <Journal />
    </AppProvider>
  );
};

export default Index;