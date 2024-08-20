import { StyleSheet, View, Dimensions, TouchableOpacity, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import {useState, useEffect} from 'react'
import FetchDayActivities from '@/Data/FetchDayActivities';
import { useAuth } from '@/contexts/AuthContext';
import { Activity } from '@/Types/ActivityTypes';
import { useCustomSet } from '@/Data/CustomSet';
import { useAppContext } from '@/contexts/AppContext';
import RecDescribeModal from '@/components/RecDescribeModal';
//import firestore from '@react-native-firebase/firestore'

const { width, height } = Dimensions.get('window');
const buttonWidth = width/6.25

//pass in activities, times
//convert to local time
export default function Recommendations() {
  const [rec1, setRec1] = useState<string>("")
  const {state} = useCustomSet();
  const entertainmentSpeel = `We know that entertaining activities can feel good in the moment, and a bit of it is fine, but in excessive amounts these will have detrimental effects on the health of your dopamine system. In other words, in the long term you will be more sad and stressed if you continue like this. But don't worry, we're here to help!`
  const {justActivities} = useAppContext();
  const {tagDurationSum} = state
  const [todayActivities, setTodayActivities] = useState<Activity[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const {user} = useAuth();
  useEffect(() => {
    FetchDayActivities(user, 0, justActivities, setTodayActivities)
  }, [justActivities])

  useEffect(() => {
    const entertainment = tagDurationSum.find(tag => tag.text=="Entertainment")
    if(entertainment) {
      if(entertainment.totalDuration>6) {
        console.log("excessive entertainment")
        const timeSpent = Math.round(entertainment.totalDuration)
        setRec1(`You spend about ${timeSpent} hours on entertaining activities daily. Let's take tangible, realistic steps to fix that and make you happier in the long run.`)
      }
    }
  }, [todayActivities])

  return (
    <View style={styles.layoutContainer}>
      <RecDescribeModal visible={modalVisible} onClose={() => setModalVisible(false)} speel={entertainmentSpeel} />
      <View style={styles.titleContainer}>
        <ThemedText type="titleText" style={{fontSize: width/12}}>Recommendations</ThemedText>
      </View>
      <View style={styles.stepContainer}>
        <ThemedText type="journalText">{rec1}</ThemedText>
        
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={styles.detailsButton}>
          <Text>Details</Text>
          </View>
          </TouchableOpacity>
      </View>
      <View style={styles.stepContainer}>
        <ThemedText type="journalText">Rec 2: Go For A Walk Tomorrow Morning</ThemedText>
      </View>
      <View style={styles.stepContainer}>
        <ThemedText type="journalText">Rec 3: Drink Your Coffee 1 Hour Later</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  detailsButton: {
    backgroundColor: 'red'
  },
  stepContainer: {
    padding: 8,
    marginBottom: 10,
    borderColor: 'bisque',
    borderWidth: 2
  },
});
