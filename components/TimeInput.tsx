import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

interface TimeInputProps {
  time: string;
  onTimeChange: React.Dispatch<React.SetStateAction<string>>;
}

const TimeInput: React.FC<TimeInputProps> = ({ time, onTimeChange }) => {

  return (
    <View style={styles.container}>
      <TextInputMask
        type={'datetime'}
        options={{
          format: 'HH:MM',
        }}
        value={time}
        onChangeText={(text) => onTimeChange(text)}
        style={styles.input}
        placeholder="00:00"
        keyboardType="numeric"
        maxLength={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 50,
    fontSize: 18,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: 'black',
  },
});

export default TimeInput;
