import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, Button, Alert, Pressable, Dimensions} from 'react-native';
import {useLogout} from '@/utils/useLogout'
import {useRouter} from 'expo-router'
import {ThemedText} from '@/components/ThemedText'

const { width, height } = Dimensions.get('window');

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
      <View style={styles.titleContainer}>
        <ThemedText type="titleText">Settings</ThemedText>
      </View>
      <View style={styles.settingItem}>
        <ThemedText type="journalText" style={styles.settingLabel}>Dark Mode</ThemedText>
        <Switch
          value={isDarkMode}
          onValueChange={handleDarkModeToggle}
        />
      </View>
      <View style={styles.settingItem}>
        <ThemedText type="journalText" style={styles.settingLabel}>Notifications</ThemedText>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleNotificationsToggle}
        />
      </View>
      <View style={styles.settingItem}>
        <Pressable style={styles.settingLabel} onPress={logout}><ThemedText type="journalText">Log Out</ThemedText></Pressable>
      </View>
      <View style={styles.settingItem}>
        <Pressable style={styles.settingLabel} onPress={() => router.push("/info")}><ThemedText type="journalText">User Info</ThemedText></Pressable>
      </View>
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: height/18,
    backgroundColor: 'darkcyan',
    position: 'relative', // Container must be relative for absolute positioning of child
  },
  titleContainer: {
    alignItems: 'center',
    padding: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
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