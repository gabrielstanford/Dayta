import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'titleText' | 'journalText' | 'durationTitle' | 'buttons';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'titleText' ? styles.titleText : undefined,
        type === 'journalText' ? styles.journalText : undefined,
        type === 'durationTitle' ? styles.durationTitle : undefined,
        type === 'buttons' ? styles.buttons : undefined,

        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#F5F5F5'
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
  journalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'bisque'
  },
  durationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  },
  buttons: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    color: 'bisque',
    // Ensure text does not wrap and show ellipsis
    overflow: 'hidden',
    // Additional style to ensure consistent two-line display
    maxHeight: 36, // Adjust based on font size, assumes roughly 18px line height
    lineHeight: 18, // Line height to control spacing between lines
  },
  titleText: {
      
      fontWeight: 'bold',
      color: '#F5F5F5'
    
  },
});
