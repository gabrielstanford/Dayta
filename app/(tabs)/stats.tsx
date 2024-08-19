import { StyleSheet, View, Dimensions, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import DashboardChart from '@/components/DashboardChart'
import {useEffect, useState} from 'react'
const { width, height } = Dimensions.get('window');
const buttonWidth = width/6.25
import {useAuth} from '@/contexts/AuthContext'
import {AppProvider, useAppContext} from '@/contexts/AppContext'
import {useCustomSet} from '@/Data/CustomSet'
import PieChart from '@/components/PieChart'
import Index from '@/components/BlockedTime'

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
  const top9 = activities.slice(0, 9);

  // Calculate the sum of the remaining durations
  const remainingSum = activities.slice(9).reduce((sum, activity) => sum + activity.totalDuration, 0);

  // Add the 'Other' category with the remaining sum
  const result = [...top9, { text: 'Other', totalDuration: remainingSum }];

  return result;
};

function Stats() {
  
  const {durationSummary} = useCustomSet();
  const {justActivities} = useAppContext();
  const [durationSumState, setDurationSumState] = useState<ActivitySummary[]>([]);
  const [enoughDataForCommonChart, setEnoughDataForCommonChart] = useState<boolean>(false)

  useEffect(() => {
    console.log('Updating Statistics')
    const sortedDescending = durationSummary.sort(
      (a: ActivitySummary, b: ActivitySummary) => b.totalDuration - a.totalDuration
    );    
    const top9WithOther = getTop9WithOther(sortedDescending)
    setDurationSumState(top9WithOther)
    setEnoughDataForCommonChart(true)
    
  }, [justActivities]);
 
  return (
    <View style={styles.layoutContainer}>
      <View style={styles.titleContainer}>
        <ThemedText type="titleText" style={{fontSize: width/12}}>Statistics</ThemedText>
      </View>
      {enoughDataForCommonChart && (
        <View style={styles.chartsContainer}>
        <SafeAreaView style={styles.pieChartContainer}>
          <PieChart
            labels={durationSumState.map(activity => activity.text)}
            values={durationSumState.map(activity => activity.totalDuration)}
          />
         </SafeAreaView>
         <View style={styles.timeBlocksContainer}>
          <Index />
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
});

export default Stats;