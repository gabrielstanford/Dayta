import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, Button, Alert, Pressable} from 'react-native';
import {useLogout} from '@/utils/useLogout'
import {useRouter} from 'expo-router'

const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleDarkModeToggle = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleNotificationsToggle = () => {
    setNotificationsEnabled((prev) => !prev);
  };

  const handleSave = () => {
    // Implement save logic here
    Alert.alert('Settings saved!');
  };

  const logout = useLogout();
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={handleDarkModeToggle}
        />
      </View>
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleNotificationsToggle}
        />
      </View>
      <View style={styles.settingItem}>
        <Pressable style={styles.settingLabel} onPress={logout}><Text>Log Out</Text></Pressable>
      </View>
      <View style={styles.settingItem}>
        <Pressable style={styles.settingLabel} onPress={() => router.push("/info")}><Text>User Info</Text></Pressable>
      </View>
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', // Change based on dark mode state
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingLabel: {
    flex: 1,
    fontSize: 18,
  },
});

export default Settings;