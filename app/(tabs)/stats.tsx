import { StyleSheet, View, Dimensions, SafeAreaView, ScrollView, Text } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import DashboardChart from '@/components/DashboardChart'
import {useEffect, useState} from 'react'
const { width, height } = Dimensions.get('window');
const buttonWidth = width/6.25
import {useAuth} from '@/contexts/AuthContext'
import {AppProvider, useAppContext} from '@/contexts/AppContext'
import {useCustomSet} from '@/Data/CustomSet'
import PieChart from '@/components/PieChart'
import BlockedTime from '@/components/BlockedTime'
import { Activity } from '@/Types/ActivityTypes';
import SleepLineChart from '@/components/SleepLineChart';

// Define a type for the counts object
interface ValueCounts {
  [key: string]: number;
}
// Define the type for the summary result
interface ActivitySummary {
  text: string;
  totalDuration: number;
}
const decimalToTime = (decimal: number): string => {
  // Extract hours and minutes from the decimal number
  const hours = Math.floor(decimal);
  const minutes = Math.round((decimal - hours) * 60);

  // Format minutes to always be two digits
  const formattedMinutes = minutes.toString().padStart(2, '0');

  // Return time in 'H:MM' format
  return `${hours}:${formattedMinutes}`;
};

// Example usage
// console.log(decimalToTime(8.5)); // Output: '8:30'
// console.log(decimalToTime(14.75)); // Output: '14:45'
// Utility function to count value occurrences
const countValues = (array: string[]): ValueCounts => {
  return array.reduce((acc: ValueCounts, value: string) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
};
const getTop9WithOther = (activities: ActivitySummary[]): ActivitySummary[] => {
  // Extract the top 9 activities
  const top9 = activities.slice(0, 9);

  // Calculate the sum of the remaining durations
  const remainingSum = activities.slice(9).reduce((sum, activity) => sum + activity.totalDuration, 0);

  // Add the 'Other' category with the remaining sum
  const result = [...top9, { text: 'Other', totalDuration: remainingSum }];

  return result;
};

function Stats() {
  
  const {state} = useCustomSet();
  const { durationSummary, avgSleepTime, avgWakeTime, weekDurationSummary, sleepSum, tagDurationSum } = state;
  const {justActivities} = useAppContext();
  const [durationSumState, setDurationSumState] = useState<ActivitySummary[]>([]);
  const [weekDurationSumState, setWeekDurationSumState] = useState<ActivitySummary[]>([]);
  const [tagDurationSumState, setTagDurationSumState] = useState<ActivitySummary[]>([]);
  const [enoughDataForCommonChart, setEnoughDataForCommonChart] = useState<boolean>(false);
  
  const extractTime = (timeStamp: number) => {
    if(timeStamp<500) {
      return 50
    }
    else {
    const utcDate = new Date(timeStamp * 1000)
    let hours = utcDate.getHours();
    if(hours<4) {
      hours = hours+24;
    }
    return hours
    }
  }
  useEffect(() => {
    const sortedDescending = durationSummary.sort(
      (a: ActivitySummary, b: ActivitySummary) => b.totalDuration - a.totalDuration
    );    
    const top9WithOther = getTop9WithOther(sortedDescending)
    setDurationSumState(top9WithOther)

    const sortedDescendingWeek = weekDurationSummary.sort(
      (a: ActivitySummary, b: ActivitySummary) => b.totalDuration - a.totalDuration
    );    
    const top9WithOtherWeek = getTop9WithOther(sortedDescendingWeek)
    setWeekDurationSumState(top9WithOtherWeek)

    const sortedDescendingTags = tagDurationSum.sort(
      (a: ActivitySummary, b: ActivitySummary) => b.totalDuration - a.totalDuration
    );    
    const top9WithOtherTags = getTop9WithOther(sortedDescendingTags)
    setTagDurationSumState(top9WithOtherTags)

  }, [justActivities]);

  useEffect(() => {
    if(durationSumState.length>0 && weekDurationSumState.length>0 && tagDurationSumState.length>0 && avgSleepTime && avgWakeTime) {
      setEnoughDataForCommonChart(true)
    }
  }, [tagDurationSumState])
//   console.log('Pie Chart 1 Data: (duration)', durationSumState);
// console.log('Pie Chart 2 Data (week duration):', weekDurationSumState);
console.log('Pie Chart 3 Data:', tagDurationSumState);
// console.log('Line Chart Data:', avgWakeTime, 'avg sleep: ', avgSleepTime);
  const [sleepLabels, setSleepLabels] = useState<string[]>([]);
  const [sleepValues, setSleepValues] = useState<[number, number][]>([]);
  useEffect(() => {
    let tempLabels: string[] = [];
    let tempValues: [number, number][] = []
    for (let index = 0; index < sleepSum.length; index++) {
      tempLabels[index] = (sleepSum[index][0].slice(8, 10));
      tempValues[index] = [extractTime(sleepSum[index][1]), extractTime(sleepSum[index][2])]
    }
    setSleepLabels(tempLabels);
    setSleepValues(tempValues);
  }, [sleepSum])
  return (
    <ScrollView style={{backgroundColor: 'darkcyan'}}>
    <View style={styles.layoutContainer}>
      <View style={styles.titleContainer}>
        <ThemedText type="titleText" style={{fontSize: width/12}}>Statistics</ThemedText>
      </View>
      {enoughDataForCommonChart && (
        <View style={styles.chartsContainer}>
        <SafeAreaView style={styles.pieChartContainer}>
          <Text style={styles.chartTitle}>All Time</Text>
          <PieChart
            labels={durationSumState.map(activity => activity.text)}
            values={durationSumState.map(activity => activity.totalDuration)}
          />
          <Text style={styles.chartTitle}>This Week</Text>
          <PieChart
            labels={weekDurationSumState.map(activity => activity.text)}
            values={weekDurationSumState.map(activity => activity.totalDuration)}
          />
          <Text style={styles.chartTitle}>All Time Tags</Text>
          <PieChart
            labels={tagDurationSumState.map(activity => activity.text)}
            values={tagDurationSumState.map(activity => activity.totalDuration)}
          />
         </SafeAreaView>
         <View style={styles.timeBlocksContainer}>
          {/* <BlockedTime /> */}
          <Text style={{fontSize: 12, color: 'white'}}>Average Wake Time: {decimalToTime(avgWakeTime)}</Text>
          <Text style={{fontSize: 12, color: 'white'}}>Average Sleep Time: {decimalToTime(avgSleepTime-12)}</Text>
          <SleepLineChart 
          labels={sleepLabels}
          values={sleepValues}
          /> 

         </View>
          {/* <View style={styles.barChartContainer}>
            <ThemedText type="subtitle">
              Click On Bars To Get Info!
            </ThemedText>
            <DashboardChart
              x={durationSumState.map(activity => activity.text)}
              y={durationSumState.map(activity => activity.totalDuration)}
            />
          </View> */}
        </View>
      )}
      {!enoughDataForCommonChart && (
        <View style={styles.noDataContainer}>
          <ThemedText type="titleText" style={{fontSize: width/12}}>We Need More Data! Come Back Later :)</ThemedText>
        </View>
      )}
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  layoutContainer: {
    flex: 1,
    paddingTop: height/18,
    backgroundColor: 'darkcyan',
  },
  contentContainer: {
    flex: 1,
    paddingBottom: height/11.6, // Space at the bottom to accommodate the button
  },
  chartsContainer: {
    flex: 1
  },
  noDataContainer: {

  },
  titleContainer: {
    alignItems: 'center',
    padding: 10,
  },
  timeBlocksContainer: {
    flex: 0.6,
    width: width,
    alignItems: 'center'
  },
  pieChartContainer: {
    flex: 0.35,
    width: width,
    alignItems: 'flex-start'
  },
  chartTitle: {
    fontSize: 15,
    color: 'bisque',
    paddingLeft: 15,
  },
});

export default Stats;