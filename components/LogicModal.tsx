// ActivitySearch.tsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Pressable, Modal, Dimensions, TouchableWithoutFeedback , TouchableOpacity} from 'react-native';
import { SearchBar } from '@rneui/themed';
import {ButtonState} from '@/Types/ActivityTypes'
import {useAppContext} from '@/contexts/AppContext'
import { getSunriseSunset } from '@/utils/DateTimeUtils';
import { decimalToTime } from '@/utils/DateTimeUtils';
import {Card} from '@/Types/ActivityTypes'

const {width, height} = Dimensions.get("window");

interface SearchProps  {
  visible: boolean;
  onClose: () => void;
  card: Card;
}
const RecDescribeModal: React.FC<SearchProps> = ({visible, onClose, card}) => {
  // console.log('Did activity search find it ', customActivities.filter((button: ButtonState) => button.text==="Runnana"))
  const {state} = useAppContext();
  const {summaryDurs, avgSleepTime, avgWakeTime} = state
  const [durAvg, setDurAvg ] = useState<number>(0)
  const cardLogic = [
    { title: 'Night-Time Wind Down Routine', explanation: 'We noticed that you have some bad habits that pop up in your journal consistently which need to be fixed. Specifically, you often use electronics within an hour of going to sleep which can have detrimental effects on the quality of your sleep. Lets come up with replacements that help you relax instead of winding up. '  },
    { title: 'Streamline Morning Routine', explanation: 'We notice from your journal that your morning routine is a bit all over the place, which can lead to you starting work much later than would be ideal.'},
    { title: 'Improve Movement Habits', explanation: 'It seems from your journal that you spend too much time sedentary on a daily basis and not enough moving your body. '}]

    const relevantExplanation = cardLogic.find(index => index.title==card.title)
    const timeZone = 'America/Los_Angeles'; // Replace with the user's time zone
    const times = getSunriseSunset(new Date(), timeZone)
  useEffect(() => {
    const avgMapped = summaryDurs.reduce((accumulator, currentValue) => accumulator + currentValue[1], 0);
    setDurAvg((avgMapped/3600)/14)
  }, [summaryDurs])
  return (
    
    <Modal
    transparent={true}
    animationType="slide"
    visible={visible}
    onRequestClose={onClose}
    >
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.modalOverlay}>
      <TouchableWithoutFeedback>
        <View style={styles.modalContent}>     
            {/* <Text>NOTE: Over the last 2 weeks, you log an average of {durAvg} hours per day. Considering you are generally awake for about {15} hours, this means there is a lot left to log. We highly recommend you get in the habit of adding activities more often in order to get more accurate statistics and recommendations.</Text>
            <Text>Our program uses scientific principles to guide you to a better life. Let's start with the baics. These days, the sun rises at about {times.sunrise} and sets at about {times.sunset} </Text>
            <Text>You wake up at, on average, {decimalToTime(avgWakeTime)} and go to sleep at, on average, {decimalToTime(avgSleepTime)}. This leaves you with an average of {avgWakeTime-(avgSleepTime-24)} hours of sleep per night, which seems about right.</Text>
            <Text>Please note that though it is optimal to wake up relatively close to sunrise (within a few hours) and go to sleep a few hours after sunset, what matters most is the consistency of your sleep schedule. We have calculated a sleep consistency score of {7} for you. More info is available on the stats page.</Text> */}
        {relevantExplanation && 
        <View style={styles.recContainer}>
        <View style={styles.recTitle}>
          <Text style={[{color: 'green', fontWeight: 'bold', fontSize: 30}]}>{card.title}</Text>
        </View>
        <View style={styles.recCategory}>
          <Text style={styles.recText}>Why we recommended this: </Text>
          <Text style={[styles.recText, {color: 'green'}]}>{relevantExplanation.explanation}</Text>
        </View>
        {/* <View style={styles.recCategory}>
          <Text style={styles.recText}>Impact Score: </Text>
          <Text style={[styles.recText]}>{card.impactScore}/10</Text>
        </View>
        <View style={styles.recCategory}>
          <Text style={styles.recText}>Details: </Text>
          <Text style={[styles.recText]}>{card.recDetails}</Text>
        </View> */}
      </View>}
      {!relevantExplanation && <View><Text>There was a problem. Please try again</Text></View>}
        </View>
        </TouchableWithoutFeedback>
      </View>
      </TouchableWithoutFeedback>
    </Modal>
    
  );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContent: {
        flex: 0.9,
        width: width/1.1,
        height: height/1,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
      },
       titleContainer: {
        flex: 1,
        alignItems: 'center',
        padding: 15
      },
      recContainer: {

        padding: 20
      },
      recTitle: {
    
        flexDirection: 'row',
        
      },
      recCategory: {
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap'
      },
      recText: {
        fontSize: 20, color: 'black', fontStyle: 'italic'
      },
})


export default RecDescribeModal;