import { StyleSheet, View, Dimensions, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import DashboardChart from '@/components/DashboardChart'
import {useEffect, useState} from 'react'
const { width, height } = Dimensions.get('window');
const buttonWidth = width/6.25
import {useAuth} from '@/contexts/AuthContext'
import {AppProvider} from '@/contexts/AppContext'
import {useCustomSet} from '@/Data/ActivityButtons'
import PieChart from '@/components/PieChart'

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

function Page() {
  
  const { user } = useAuth();
  const {entries, durationSummary} = useCustomSet();

  const [entryState, setEntryState] = useState<[string, number][]>([]);
  const [durationSumState, setDurationSumState] = useState<ActivitySummary[]>([]);
  const [enoughDataForCommonChart, setEnoughDataForCommonChart] = useState<boolean>(false)
  useEffect(() => {
    setEntryState(entries);
    
    const sortedDescending = durationSummary.sort(
      (a: ActivitySummary, b: ActivitySummary) => b.totalDuration - a.totalDuration
    );    
    const top9WithOther = getTop9WithOther(sortedDescending)
    setDurationSumState(top9WithOther)
    setEnoughDataForCommonChart(true)
    
  }, [entries, durationSummary]);
 
  return (
    <View style={styles.layoutContainer}>
      <View style={styles.titleContainer}>
        <ThemedText type="titleText">Statistics</ThemedText>
      </View>
      <SafeAreaView style={styles.pieChartContainer}>
        <PieChart labels={durationSumState.map(activity => activity.text)} values={durationSumState.map(activity => activity.totalDuration)} />
      </SafeAreaView>
      <View style={styles.barChartContainer}>
          <ThemedText type="subtitle" style={{paddingBottom:10}}>
            Click On Bars To Get Info!
          </ThemedText>
          {enoughDataForCommonChart ? <DashboardChart x={durationSumState.map(activity => activity.text)} y={durationSumState.map(activity => activity.totalDuration)} /> : <ThemedText type="titleText">We Need More Data! Come Back Later :)</ThemedText>}
      </View>
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
  titleContainer: {
    alignItems: 'center',
    padding: 10,
  },
  barChartContainer: {
    flex: 0.5,
    width: width,
    padding: 10,
    alignItems: 'center'
  },
  pieChartContainer: {
    flex: 0.4,
    width: width,
    alignItems: 'flex-start'
  },
});

const Stats: React.FC = () => {
  return (
    <AppProvider>
      <Page />
    </AppProvider>
  );
};

export default Stats;