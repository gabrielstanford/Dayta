import React from 'react';
import { View, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const colors: string[] = [
  "#1F618D", // Work/Study - A calm, professional blue to represent focus and productivity
  "#F39C12", // Food/Drink - A warm orange, reminiscent of delicious food and drink
  "#27AE60", // Physical - A vibrant green symbolizing energy, health, and activity
  "#3498DB", // Relax - A soothing light blue for relaxation and tranquility
  "#9B59B6", // Music - A creative purple that resonates with artistic expression
  "#E74C3C", // Entertainment - A lively red for excitement and fun
  "#2980B9", // Social - A welcoming and friendly blue, representing social interaction
  "#8E44AD", // Travel/Commute - A deep purple, indicating movement and exploration
  "#D35400", // Hobbies - An engaging orange for personal interests and activities
  "#7F8C8D", // Chores - A neutral grey, reflecting the mundane nature of chores
  "#2ECC71", // Self-Improvement - A fresh green symbolizing growth and self-betterment
  "#F1C40F", // Family Time - A bright, cheerful yellow for happiness and togetherness
  "#E67E22", // Helping Others - A compassionate orange, symbolizing warmth and altruism
  "#16A085", // Intaking Knowledge - A teal color representing clarity and learning
  "#95A5A6"  // Other - A versatile grey, suitable for miscellaneous activities
];


const tagToColor: { [key: string]: string } = {
  "work/study": colors[0],
  'food/drink': colors[1],
  'physical': colors[2],
  "relax": colors[3],
  'music': colors[4],
  'entertainment': colors[5],
  'social': colors[6],
  'travel/commute': colors[7],
  'hobbies': colors[8],
  'chores': colors[9],
  'self-improvement': colors[10],
  'family time': colors[11],
  'helping others': colors[12],
  'intaking knowledge': colors[13],
  'other': colors[14],
  'Other': colors[14]
};
interface PieChartProps {
  labels: string[];
  values: number[];
}
const setColor = (label: string, index: number, labels: string[]) => {
  let col = tagToColor[label]
   if(!(labels.includes("work/study") || labels.includes("relax"))) {
    col = colors[index]
   }
  return col
}
const PieChartComponent: React.FC<PieChartProps> = ({ labels, values }) => {
  // Prepare data for the PieChart component
  
  if(labels.includes("entertainment") && labels.includes("work/study")) {

  }
  const data = labels.map((label, index) => ({
    name: label,
    population: values[index],
    color: setColor(label, index, labels), // Use colors from the palette
    legendFontColor: '#E0FFFF', // Light color for legend text
    legendFontSize: 12,
  }));

  return (
    <View>
      <PieChart
        data={data}
        width={Dimensions.get('window').width/1.1} // Adjust width as needed
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
