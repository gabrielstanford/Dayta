import React from 'react';
import { View, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

// Define a set of colors that contrast well with a darkcyan background
const colors = [
  '#FF6347', // Tomato
  '#FFD700', // Gold
  '#32CD32', // LimeGreen
  '#1E90FF', // DodgerBlue
  '#FF1493', // DeepPink
  '#FF4500', // OrangeRed
  '#7FFF00', // Chartreuse
  '#00CED1', // DarkTurquoise
  '#00CED1', // DarkTurquoise
  '#00CED1', // DarkTurquoise
  '#00CED1', // DarkTurquoise

];

interface PieChartProps {
  labels: string[];
  values: number[];
}

const PieChartComponent: React.FC<PieChartProps> = ({ labels, values }) => {
  // Prepare data for the PieChart component
  const data = labels.map((label, index) => ({
    name: label,
    population: values[index],
    color: colors[index % colors.length], // Use colors from the palette
    legendFontColor: '#E0FFFF', // Light color for legend text
    legendFontSize: 14,
  }));

  return (
    <View>
      <PieChart
        data={data}
        width={Dimensions.get('window').width} // Adjust width as needed
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White for the chart
          labelColor: (opacity = 1) => `rgba(224, 255, 255, ${opacity})`, // Light cyan for labels
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="0" // Reduce or remove padding as needed
        
      />
    </View>
  );
};

export default PieChartComponent;
