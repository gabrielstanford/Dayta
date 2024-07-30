import { StyleSheet, View, Dimensions } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import DashboardChart from '@/components/DashboardChart'

const { width, height } = Dimensions.get('window');
const buttonWidth = width/6.25

export default function Recommendations() {
  return (
    <View style={styles.layoutContainer}>
      <View style={styles.titleContainer}>
        <ThemedText type="titleText">Statistics</ThemedText>
        <ThemedText type="subtitle">Tailored statistics to give you deep insights into your life!</ThemedText>
      </View>
      <View style={styles.chartContainer}>
          <DashboardChart />
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
  chartContainer: {
    width: width
  },
});
