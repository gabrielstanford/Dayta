import { StyleSheet, View, Dimensions, TouchableOpacity, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import {useState, useEffect} from 'react'
import FetchDayActivities from '@/Data/FetchDayActivities';
import { useAuth } from '@/contexts/AuthContext';
import { Activity } from '@/Types/ActivityTypes';
import { useCustomSet } from '@/Data/CustomSet';
import { useAppContext } from '@/contexts/AppContext';
import RecDescribeModal from '@/components/RecDescribeModal';
import LogicModal from '@/components/LogicModal'
import CustomButton from '@/components/CustomButton'

//import firestore from '@react-native-firebase/firestore'

const { width, height } = Dimensions.get('window');
const buttonWidth = width/6.25

//pass in activities, times
//convert to local time

const decimalToTime = (decimal: number): string => {
  // Extract hours and minutes from the decimal number
  const hours = Math.floor(decimal);
  const minutes = Math.round((decimal - hours) * 60);

  // Format minutes to always be two digits
  const formattedMinutes = minutes.toString().padStart(2, '0');

  // Return time in 'H:MM' format
  return `${hours}:${formattedMinutes}`;
};

export default function Recommendations() {
  const [rec1, setRec1] = useState<string>("")
  const [rec2, setRec2] = useState<string>("")
  const {state} = useCustomSet();
  const entertainmentSpeel = `We know that entertaining activities can feel good in the moment, and a bit of it is fine, but in excessive amounts these will have detrimental effects on the health of your dopamine system. In other words, in the long term you will be more sad and stressed if you continue like this. But don't worry, we're here to help!`
  const {justActivities} = useAppContext();
  const {tagDurationSum, avgTimeByTag} = state
  const [todayActivities, setTodayActivities] = useState<Activity[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [logicModalVisible, setLogicModalVisible] = useState<boolean>(false);
  const {user} = useAuth();
  useEffect(() => {
    FetchDayActivities(user, 0, justActivities, setTodayActivities, true)
  }, [justActivities])

  useEffect(() => {
    const entertainment = avgTimeByTag.find(tag => tag.text=="entertainment")
    const work = avgTimeByTag.find(tag => tag.text=="work/study")

    if(entertainment) {
      if(entertainment.totalDuration>1) {
        console.log("excessive entertainment")
        const timeSpent = decimalToTime(entertainment.totalDuration)
        setRec1(`You spend about ${timeSpent} on entertaining activities daily. Let's take tangible, realistic steps to fix that and make you happier in the long run.`)
      }
      if(work) {
        if(work.totalDuration<4) {
          const timeSpent = decimalToTime(work.totalDuration)
          if(rec1=="") {
            setRec1(`You spend about ${timeSpent} on work activities daily. You might want to consider upping this a bit to make you feel more productive.`)
          }
          else {
            setRec2(`You spend about ${timeSpent} on work activities daily. You might want to consider upping this a bit to make you feel more productive.`)
          }
        }
      }
    }
  }, [todayActivities])

  return (
    <View style={styles.layoutContainer}>
      <RecDescribeModal visible={modalVisible} onClose={() => setModalVisible(false)} speel={entertainmentSpeel} />
      <LogicModal visible={logicModalVisible} onClose={() => setLogicModalVisible(false)} speel={"Filler Text"}/>
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
        <ThemedText type="journalText">{rec2}</ThemedText>
      </View>
      <View style={styles.stepContainer}>
        <ThemedText type="journalText">Rec 3: Drink Your Coffee 1 Hour Later</ThemedText>
      </View>
      <CustomButton title="info" onPress={() => setLogicModalVisible(true)}/>
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
