// ActivitySearch.tsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Pressable, Modal, Dimensions, TouchableWithoutFeedback , TouchableOpacity, ScrollView} from 'react-native';
import { SearchBar } from '@rneui/themed';
import {ButtonState} from '@/Types/ActivityTypes'
import {useAppContext} from '@/contexts/AppContext'
import { getSunriseSunset } from '@/utils/DateTimeUtils';
import { decimalToTime } from '@/utils/DateTimeUtils';
import {Card} from '@/Types/ActivityTypes'
import { CardLogic } from '@/Data/PremadeCards';
import Markdown from '@ronradtke/react-native-markdown-display';

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

    const relevantExplanation = CardLogic.find(index => index.title==card.title)
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
        {relevantExplanation && 
        <ScrollView contentContainerStyle={styles.explainerContainer}>
          <View onStartShouldSetResponder={() => true}>
            {relevantExplanation.explanation}
            </View>
        </ScrollView>}
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
        width: width / 1.1, // Width relative to the screen
        height: height / 1.2, // Slightly smaller than the full screen
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
      },
       titleContainer: {
        flex: 1,
        alignItems: 'center',
        padding: 15
      },
      explainerContainer: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1, // Allow the content inside the ScrollView to grow
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