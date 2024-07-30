import React from 'react';
import { Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit'; // Import for chart library

export default function DashboardChart() {

      // Replace with your data and logic for the chart
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43]
      }
    ]
  };
  const chartConfig = {
    backgroundGradientFrom: "#093D3B", // Darker shade of dark cyan
    backgroundGradientFromOpacity: 0.5,
    backgroundGradientTo: "#0B4A48", // Slightly lighter shade of dark cyan
    backgroundGradientToOpacity: 0.8,
    color: (opacity = 1) => `rgba(245, 222, 179, ${opacity})`, // Bisque color for chart elements
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };
  const screenWidth = Dimensions.get('window').width
  
    return(
        <BarChart
        data={data}
        width={screenWidth} // Adjust padding as needed
        height={220}
        yAxisLabel="$"
        chartConfig={chartConfig}
        verticalLabelRotation={10}
        yAxisSuffix=""
      />
    );
}