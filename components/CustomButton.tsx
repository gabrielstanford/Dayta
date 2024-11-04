import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions, ViewStyle, TextStyle } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  width?: number;
  height?: number;
  paddingVertical?: number;
  paddingHorizontal?: number;
  color?: string; // Color for the button background
  fontSize?: number; // New fontSize prop
  disabled?: boolean;
  style?: ViewStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  width = screenWidth * 0.8, // Default width
  height = 48, // Default height
  paddingVertical = 12, // Default padding vertical
  paddingHorizontal = 20, // Default padding horizontal
  color = '#F5F5F5', // Default button color
  fontSize = 16, // Default font size
  disabled = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        style,
        disabled && styles.disabledButton,
        { width, height, paddingVertical, paddingHorizontal, backgroundColor: color }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, { fontSize }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2, // Adds shadow for Android
  } as ViewStyle,
  buttonText: {
    color: '#1B1B1B',
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
    overflow: 'hidden', // Prevents text from overflowing
  } as TextStyle,
  disabledButton: {
    backgroundColor: '#c0c0c0', // Disabled button color
  } as ViewStyle,
});

export default CustomButton;
