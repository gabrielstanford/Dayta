import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';

type CustomRadioButtonProps = {
  value: string;
  status: 'checked' | 'unchecked';
  onPress: () => void;
};

const CustomRadioButton: React.FC<CustomRadioButtonProps> = ({ value, status, onPress }) => {
  return (
    <View style={styles.container}>
      <RadioButton
        value={value}
        status={status}
        onPress={onPress}
        color="darkcyan"
        uncheckedColor="transparent" // Transparent to allow for custom unchecked style
      />
      {status === 'unchecked' && <View style={styles.uncheckedStyle} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
  },
  uncheckedStyle: {
    position: 'absolute',
    width: 24, // Size of the RadioButton
    height: 24, // Size of the RadioButton
    borderRadius: 12, // To make it circular
    borderColor: 'black',
    borderWidth: 2,
    backgroundColor: 'white',
  },
});

export default CustomRadioButton;
