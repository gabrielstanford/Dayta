import React from 'react';
import { View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import {decimalToTime} from '@/utils/DateTimeUtils'

const screenWidth = Dimensions.get('window').width;

interface LineChartProps {
  labels: string[];
  values: [number, number][];
}
const interpolateValuesSmoothly = (values: number[], hideValue: number): number[] => {
    const n = values.length;
    const interpolatedValues: number[] = [...values]; // Copy original values
  
    // Function to find the nearest real values before and after the hidden segment
    const findBounds = (index: number) => {
      let left = index - 1;
      let right = index + 1;
  
      // Find left bound
      while (left >= 0 && interpolatedValues[left] === hideValue) left--;
      // Find right bound
      while (right < n && interpolatedValues[right] === hideValue) right++;
  
      return [left >= 0 ? interpolatedValues[left] : null, right < n ? interpolatedValues[right] : null];
    };
  
    for (let i = 0; i < n; i++) {
      if (interpolatedValues[i] === hideValue) {
        const [leftValue, rightValue] = findBounds(i);
  
        if (leftValue !== null && rightValue !== null) {
          // Hidden values between two valid values
          let start = i;
          let end = i;
  
          // Extend to the right until a real value is found
          while (end < n && interpolatedValues[end] === hideValue) end++;
  
          const numHiddenValues = end - start;
          const diff = (rightValue - leftValue) / (numHiddenValues + 1);
  
          // Assign interpolated values
          for (let j = start; j < end; j++) {
            interpolatedValues[j] = leftValue + diff * (j - start + 1);
          }
        } else if (leftValue !== null) {
          // Hidden values at the start or end with only left valid value
          let start = i;
          let end = i;
  
          // Extend to the right until a real value is found or end of array
          while (end < n && interpolatedValues[end] === hideValue) end++;
  
          // Fill with the left value
          for (let j = start; j < end; j++) {
            interpolatedValues[j] = leftValue;
          }
        } else if (rightValue !== null) {
          // Hidden values at the start or end with only right valid value
          let start = i;
          let end = i;
  
          // Extend to the right until a real value is found or end of array
          while (end < n && interpolatedValues[end] === hideValue) end++;
  
          // Fill with the right value
          for (let j = start; j < end; j++) {
            interpolatedValues[j] = rightValue;
          }
        }
      }
    }
  
    return interpolatedValues;
  };
  
  
const SleepLineChart: React.FC<LineChartProps> = ({ labels, values }) => {

    const value1s = values.map(pair => pair[0]);
    const value2s = values.map(pair => pair[1]);
    const interpolated1 = interpolateValuesSmoothly(value1s, 50)
    const interpolated2 = interpolateValuesSmoothly(value2s, 50)
    // const transformedLabels = labels.map(label => decimalToTime(label))
    return (
      <View>
        <LineChart
          data={{
            labels: labels,
            
            datasets: [
              {
                data: interpolated1,
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Color for the first line
                strokeWidth: 2, // Line width
              },
              {
                data: interpolated2,
                color: (opacity = 1) => `rgba(244, 65, 134, ${opacity})`, // Color for the second line
                strokeWidth: 2, // Line width
              },
            ],
          }}
          width={screenWidth} // from react-native
          height={220}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2, // Number of decimal places
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          formatYLabel={(value) => decimalToTime(Number(value))}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
    );
};

export default SleepLineChart;
