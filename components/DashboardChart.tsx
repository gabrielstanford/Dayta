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
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };
  const screenWidth = Dimensions.get('window').width
  
    return(
        <BarChart
        data={data}
        width={screenWidth - 20} // Adjust padding as needed
        height={220}
        yAxisLabel="$"
        chartConfig={chartConfig}
        verticalLabelRotation={30}
        yAxisSuffix=""
      />
    );
}