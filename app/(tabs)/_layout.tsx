import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Correct import for Ionicons with Expo
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

type IoniconName = keyof typeof Ionicons.glyphMap;

type TabBarIconProps = {
  name: IoniconName;
  color: string;
};

const TabBarIcon: React.FC<TabBarIconProps> = ({ name, color }) => (
  <Ionicons name={name} size={35} color={color} />
);

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'grey',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1B1B1B', // Replace 'yourColorHere' with the desired color
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'book' : 'book-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="personalize"
        options={{
          title: 'Personalize',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'repeat' : 'repeat-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recommendations"
        options={{
          title: 'Recs',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'star' : 'star-outline'} color={color} /> // Updated icon for recommendations
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'stats-chart' : 'stats-chart-outline'} color={color} /> // Updated icon for stats
          ),
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color} /> // Updated icon for settings
          ),
        }}
      />

    </Tabs>
  );
}
