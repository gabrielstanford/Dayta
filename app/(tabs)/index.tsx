import { StyleSheet, Pressable, View, Dimensions} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useState, useEffect } from 'react';
import {AntDesign, MaterialIcons} from '@expo/vector-icons';
import MyModal from '@/components/MyModal'
import { AppProvider, useAppContext } from '@/contexts/AppContext';
import { collection, onSnapshot, getDocs } from 'firebase/firestore';
import {firestore} from '@/firebase/firebase'
import {useAuth} from '@/contexts/AuthContext'

// Get screen width. This is for more responsive layouts
const { width, height } = Dimensions.get('window');
const buttonWidth = width/6.25

function Journal() {

  const { user } = useAuth();
  const [dbActivities, setDbActivities] = useState<any>(null);

  useEffect(() => {
    if (user) {
      // Reference to the activities subcollection for the given userId
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
      const activitiesRef = collection(firestore, 'users', user.uid, 'dates', today, 'activities');
      // Set up a real-time listener
      const unsubscribe = onSnapshot(activitiesRef, (snapshot) => {
        const userActivities: any[] = [];
        snapshot.forEach((doc) => {
          userActivities.push({ id: doc.id, ...doc.data() });
        });
        userActivities.sort((a, b) => a.timeBlock.startTime - b.timeBlock.startTime);
        setDbActivities(userActivities);
      }, (error) => {
        console.error('Error fetching activities:', error);
      });

      // Clean up the listener on component unmount
      return () => unsubscribe();
    }
  }, [user]);
  
  //toggle the state of the modal
    const [modalVisible, setModalVisible] = useState(false);
    const toggleModal = () => setModalVisible(!modalVisible)

    const { removeActivity } = useAppContext();

    const removeActiv = (id: string) => {
        removeActivity(id);
    }
    const convertUnixToTimeString = (unixTimestamp: number): string => {
      // Create a Date object from the Unix timestamp
      const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
    
      // Get hours and minutes in UTC
      let hours = date.getUTCHours(); // Use UTC hours to avoid time zone issues
      const minutes = date.getUTCMinutes();
    
      // Determine AM or PM
      const period = hours < 12 ? 'AM' : 'PM';
    
      // Convert hours from 24-hour to 12-hour format
      hours = hours % 12;
      hours = hours ? hours : 12; // Hour '0' should be '12'
    
      // Format minutes to always have two digits
      const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    
      // Construct the formatted time string
      return `${hours}:${formattedMinutes} ${period}`;
    };
  return (
    
      <View style={styles.layoutContainer}>
        <MyModal visible={modalVisible} onClose={toggleModal} />
        <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <ThemedText type="titleText">My Journal</ThemedText>
        </View>
        {dbActivities ? 
          dbActivities.map((activity: any) => (
            <View key={activity.id} style={styles.stepContainer}>
              <ThemedText type="journalText">{convertUnixToTimeString(activity.timeBlock.startTime)}</ThemedText>
              <ThemedText type="journalText">{activity.button.text}</ThemedText>
              <Pressable onPress={() => removeActiv(activity.id)}>
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