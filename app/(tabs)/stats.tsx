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
import {decimalToTime, decimalToDurationTime} from '@/utils/DateTimeUtils'

// Define a type for the counts object
interface ValueCounts {
  [key: string]: number;
}
// Define the type for the summary result
interface ActivitySummary {
  text: string;
  totalDuration: number;
}


// Utility function to count value occurrences
const countValues = (array: string[]): ValueCounts => {
  return array.reduce((acc: ValueCounts, value: string) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
};
const getTop9WithOther = (activities: ActivitySummary[]): ActivitySummary[] => {
  // Extract the top 9 activities
  let result = activities
  if(activities.length>9) {
  let top9 = activities.slice(0, 9);

  // Calculate the sum of the remaining durations

  const remainingSum = activities.slice(9).reduce((sum, activity) => sum + activity.totalDuration, 0);

  // Add the 'Other' category with the remaining sum
  result = [...top9, { text: 'Other', totalDuration: remainingSum }];
  }
  return result;
};

function Stats() {
  
  const {state} = useCustomSet();
  const { durationSummary, avgSleepTime, avgWakeTime, weekDurationSummary, sleepSum, tagDurationSum, todayTagDurationSum, summaryDurs } = state;
  const {justActivities} = useAppContext();
  const [durationSumState, setDurationSumState] = useState<ActivitySummary[]>([]);
  const [weekDurationSumState, setWeekDurationSumState] = useState<ActivitySummary[]>([]);
  const [tagDurationSumState, setTagDurationSumState] = useState<ActivitySummary[]>([]);
  const [todayTagDurationSumState, setTodayTagDurationSumState] = useState<ActivitySummary[]>([]);
  const [enoughDataForCommonChart, setEnoughDataForCommonChart] = useState<boolean>(false);
  const [enoughDataForLogChart, setEnoughDataForLogChart] = useState<boolean>(false);
  const [enoughDataForToday, setEnoughDataForToday] = useState<boolean>(false);
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
    if(durationSumState.length>0 && weekDurationSumState.length>0 && tagDurationSumState.length>0) {

      setEnoughDataForCommonChart(true)
    }
  }, [tagDurationSumState, justActivities])

  useEffect(() => {
    if(summaryDurs.length>0)
      setEnoughDataForLogChart(true);
  }, [summaryDurs])
  useEffect(() => {
    const sortedDescendingTodayTags = todayTagDurationSum.sort(
      (a: ActivitySummary, b: ActivitySummary) => b.totalDuration - a.totalDuration
    );    

    const top9WithOtherTodayTags = getTop9WithOther(sortedDescendingTodayTags)
    setTodayTagDurationSumState(top9WithOtherTodayTags)
    setEnoughDataForToday(true);
  }, [todayTagDurationSum])
  const mapLens = (lens: [string, number][]) => {
    const mapped = sleepLens.map(ind => decimalToDurationTime(ind[1]))
    const filtered = mapped.filter(dur => dur!=="0:00")
    return filtered
  }
  const [sleepLabels, setSleepLabels] = useState<string[]>([]);
  const [sleepValues, setSleepValues] = useState<[number, number][]>([]);
  const [sleepLens, setSleepLens] = useState<[string, number][]>([])
  useEffect(() => {
    if(sleepSum.length>0) {
    let tempLabels: string[] = [];
    let tempValues: [number, number][] = [];
    let sleepLengths: [string, number][] = []
    let tempSleep: number = 0;
    let tempWake: number = 0;
    let tempDiff: number = 0
    for (let index = 0; index < sleepSum.length; index++) {
      tempLabels[index] = (sleepSum[index][0].slice(8, 10));
      tempWake = sleepSum[index][1];
      if(tempWake!==50 && tempSleep!==50 && tempWake>tempSleep && (tempWake-tempSleep<60000)) {
      
      tempDiff = tempWake - tempSleep
      }
      sleepLengths[index] = [sleepSum[index][0], tempDiff/3600]
      tempSleep = sleepSum[index][2];
      tempValues[index] = [extractTime(tempWake), extractTime(tempSleep)];
    }
    setSleepLabels(tempLabels);
    setSleepValues(tempValues);
    setSleepLens(sleepLengths)
  }
  }, [sleepSum])
  return (
    <ScrollView style={{backgroundColor: 'darkcyan'}}>
    <View style={styles.layoutContainer}>
      <View style={styles.titleContainer}>
        <ThemedText type="titleText" style={{fontSize: width/12}}>Statistics</ThemedText>
      </View>
      <View style={styles.chartsContainer}>
      {enoughDataForToday && (   
        <>   
        <Text style={styles.chartTitle}>Today Breakdown By Tags</Text>

          <PieChart
            labels={todayTagDurationSumState.map(activity => activity.text)}
            values={todayTagDurationSumState.map(activity => activity.totalDuration)}
          />
          </>   )}
      {enoughDataForCommonChart && (
        <View>
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

          </View>
      )}
      {enoughDataForLogChart && (         
         <View >
            <ThemedText type="subtitle">
              Time Logging Over Time
            </ThemedText>
            <DashboardChart
              x={summaryDurs.map(index => index[0])}
              y={summaryDurs.map(index => index[1]/3600)}
            />
          </View>)}
      {(avgSleepTime!==0.111 && avgWakeTime!==0.111 && sleepSum.length>0 && sleepLens.length>0) && (
          <View style={styles.timeBlocksContainer}>
          {/* <BlockedTime /> */}
          <Text style={{fontSize: 12, color: 'white'}}>Average Wake Time: {decimalToTime(avgWakeTime)}</Text>
          <Text style={{fontSize: 12, color: 'white'}}>Average Sleep Time: {decimalToTime(avgSleepTime)}</Text>
          {/* <Text style={{fontSize: 12, color: 'white'}}>Sleep Lengths: {mapLens(sleepLens)}</Text> */}
          <SleepLineChart 
          labels={sleepLabels}
          values={sleepValues}
          /> 
        </View>
        )}
      
      {/* {!enoughDataForCommonChart && (
        <View style={styles.noDataContainer}>
          <ThemedText type="titleText" style={{fontSize: width/12}}>We Need More Data! Come Back Later :)</ThemedText>
        </View>
      )} */}
    </View>
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