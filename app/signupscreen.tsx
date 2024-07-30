import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import {firestore} from '@/firebase/firebase'
import { setDoc, doc } from 'firebase/firestore';

const setUserTimezone = async (userId: string, timezone: string) => {
  const userRef = doc(firestore, 'users', userId);
  await setDoc(userRef, { timezone }, { merge: true });
};

  const SignUpScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();
  
    // Function to get the user's timezone
    const getUserTimezone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
    };

  // Function to handle user signup
  const handleSignUp = async () => {
    const auth = getAuth();
    const timezone = getUserTimezone(); // Get the user's timezone

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get the user ID
      const userId = user.uid;

      // Set the user's timezone in Firestore
      await setUserTimezone(userId, timezone);

      // Navigate to the home page
      router.push('/');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to create account. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
});

export default SignUpScreen;
