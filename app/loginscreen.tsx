import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import { useRouter } from 'expo-router';

interface Props {
  navigation: {
    navigate: (screen: string) => void;
  };
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error: any) {
      Alert.alert('Incorrect Email/Password. Please Try Again');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="darkcyan"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="darkcyan"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} color="mintcream" />
      </View>
      <TouchableOpacity style={styles.signUpContainer} onPress={() => router.push('/signupscreen')}>
        <Text style={styles.signUpText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'darkcyan',
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: 'mintcream',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    color: 'darkcyan',
    backgroundColor: 'mintcream',
  },
  buttonContainer: {
    marginTop: 12,
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  signUpContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  signUpText: {
    color: 'bisque',
    fontSize: 16,
  },
});

export default LoginScreen;