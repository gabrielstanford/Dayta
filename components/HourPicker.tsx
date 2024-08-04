import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface HourPickerProps {
  onHourChange: (hour: number) => void;
}

const HourPicker: React.FC<HourPickerProps> = ({ onHourChange }) => {
  const [hour, setHour] = useState<number>(0);

  const incrementHour = () => {
    let newHour = hour + 1;
    if (newHour > 12) newHour = 0;
    setHour(newHour);
    onHourChange(newHour);
  };

  const decrementHour = () => {
    let newHour = hour - 1;
    if (newHour < 0) newHour = 12;
    setHour(newHour);
    onHourChange(newHour);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="+" onPress={incrementHour} />
      </View>
      <Text style={styles.hourText}>{hour}</Text>
      <View style={styles.buttonContainer}>
        <Button title="-" onPress={decrementHour} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginHorizontal: 10,
  },
  hourText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 15,
  },
});

export default HourPicker;
