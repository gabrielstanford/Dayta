import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import {StyleSheet, View, Text} from 'react-native'
import {ThemedText} from './ThemedText'

interface TimeDropdownProps {
    selectedHour: string;
    selectedMinute: string;
    selectedPeriod: string; // AM or PM
    onHourChange: (hour: string) => void;
    onMinuteChange: (minute: string) => void;
    onPeriodChange: (period: string) => void;
}

const TimeDropdown: React.FC<TimeDropdownProps> = ({   
    selectedHour,
    selectedMinute,
    selectedPeriod,
    onHourChange,
    onMinuteChange,
    onPeriodChange }) => {
        const generateHourOptions = () => {
          const hours = [];
          for (let h = 1; h <= 12; h++) {
            hours.push(h < 10 ? `0${h}` : `${h}`);
          }
          return hours;
        };
      
        const generateMinuteOptions = () => {
          const minutes = [];
          for (let m = 0; m < 60; m++) {
            minutes.push(m < 10 ? `0${m}` : `${m}`);
          }
          return minutes;
        };

        const generatePeriodOptions = () => ['AM', 'PM'];
    
  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Hour:</Text>
        <Picker
          selectedValue={selectedHour}
          onValueChange={(itemValue) => onHourChange(itemValue as string)}
          style={styles.picker}
        >
          {generateHourOptions().map((hour) => (
            <Picker.Item key={hour} label={hour} value={hour} />
          ))}
        </Picker>
      </View>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Minute:</Text>
        <Picker
          selectedValue={selectedMinute}
          onValueChange={(itemValue) => onMinuteChange(itemValue as string)}
          style={styles.picker}
        >
          {generateMinuteOptions().map((minute) => (
            <Picker.Item key={minute} label={minute} value={minute} />
          ))}
        </Picker>
      </View>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Period:</Text>
        <Picker
          selectedValue={selectedPeriod}
          onValueChange={(itemValue) => onPeriodChange(itemValue as string)}
          style={styles.picker}
        >
          {generatePeriodOptions().map((period) => (
            <Picker.Item key={period} label={period} value={period} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      pickerContainer: {
        flex: 1, // Allows the container to expand and fit available space
      },
      picker: {
        height: '90%',
        width: '100%', // Make sure the picker takes up the full width of its container
      },
      label: {
        fontSize: 16,
        marginBottom: 5,
      },
  });

  export default TimeDropdown;