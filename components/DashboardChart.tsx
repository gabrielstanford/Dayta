import React from 'react';
import { Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit'; // Import for chart library

interface DashboardChartProps {
  x: string[],
  y: number[]
}

export default function DashboardChart({x, y}: DashboardChartProps) {

      // Replace with your data and logic for the chart
  const data = {
    labels: x,
    datasets: [
      {
        data: y
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
    useShadowColorFromDataset: false, // optional
      // Customize Y-axis
    yAxisLabel: '',
    yAxisSuffix: '',
    yAxisInterval: 1, // Show every label
    decimalPlaces: 0, // Ensures labels are integers
    
  };
  const screenWidth = Dimensions.get('window').width
  
    return(
        <BarChart
        data={data}
        width={screenWidth} // Adjust padding as needed
        height={220}
        yAxisLabel=""
        chartConfig={chartConfig}
        verticalLabelRotation={10}
        yAxisSuffix=""
        fromZero={true} // Ensure chart starts from 0
        fromNumber={Math.max(...y) > 4 ? Math.max(...y) : 4 }
      />
    );
}