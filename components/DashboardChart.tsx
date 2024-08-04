import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit-with-pressable-bar-graph';

const screenWidth = Dimensions.get('window').width;

interface DashboardChartProps {
  x: string[];
  y: number[];
}

export default function DashboardChart({ x, y }: DashboardChartProps) {
  const [tooltipData, setTooltipData] = useState<{ label: string } | null>(null);
  const [layout, setLayout] = useState<{ width: number, height: number } | null>(null);

  const chartData = x.map((label, index) => ({
    label,
    value: y[index],
  }));

  const handleBarPress = (item: { label: string, value: number }) => {
    setTooltipData({ label: item.label });
  };

  const barWidth = layout ? (layout.width / chartData.length - 10) : 0; // Adjust spacing as needed
  const maxValue = Math.max(...y);
  const barHeightFactor = layout ? (layout.height / maxValue) : 0;

  const chartConfig = {
    backgroundGradientFrom: "#093D3B",
    backgroundGradientFromOpacity: 0.5,
    backgroundGradientTo: "#0B4A48",
    backgroundGradientToOpacity: 0.8,
    color: (opacity = 1) => `rgba(245, 222, 179, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    yAxisLabel: '',
    yAxisSuffix: '',
    yAxisInterval: 1,
    decimalPlaces: 0,
    propsForVerticalLabels: {
    fontSize: 1, // Hide x-axis labels
  },
  };

  return (
    <View
      style={{ flex: 1, alignItems: 'center', height: 300 }} // Set a defined height
      onLayout={(event) => {
        setLayout(event.nativeEvent.layout);
      }}
    >
      <BarChart
        data={{
          labels: x,
          datasets: [{ data: y }],
        }}
        width={screenWidth - 20}
        height={220}
        yAxisLabel=""
        chartConfig={chartConfig}
        verticalLabelRotation={10}
        yAxisSuffix=""
        fromZero={true}
        showValuesOnTopOfBars={false}
        onDataPointClick={({ index }) => handleBarPress(chartData[index])}
      />

      {tooltipData && layout && (
        <View style={[styles.tooltip, { left: (screenWidth - 20) / 2 - 50 }]}>
          <Text style={styles.tooltipText}>{tooltipData.label}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tooltip: {
    position: 'absolute',
    top: 10, // Position it at the top of the chart
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 8,
    borderRadius: 4,
    zIndex: 10, // Ensure it is on top
  },
  tooltipText: {
    color: '#fff',
    fontSize: 12,
  },
});
