import { StyleSheet, View, Dimensions } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
//import firestore from '@react-native-firebase/firestore'
import { format } from 'date-fns-tz';

const { width, height } = Dimensions.get('window');
const buttonWidth = width/6.25

// Function to convert Unix timestamp to local time based on the user's timezone
const convertToLocalTime = (timestamp: number, timezone: string) => {
  const date = new Date(timestamp * 1000); // Convert Unix timestamp to JavaScript Date object
  return format(date, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone: timezone });
};

//pass in activities, times
//convert to local time
export default function Recommendations() {

  return (
    <View style={styles.layoutContainer}>
      <View style={styles.titleContainer}>
        <ThemedText type="titleText">Recommendations</ThemedText>
      </View>
      <View style={styles.stepContainer}>
        <ThemedText type="journalText">Rec 1: Wake Up 1 Hour Later</ThemedText>
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
  stepContainer: {
    padding: 8,
    marginBottom: 10,
    borderColor: 'bisque',
    borderWidth: 2
  },
});
