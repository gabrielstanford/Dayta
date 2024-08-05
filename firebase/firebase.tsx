import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const androidFirebaseConfig = {
  apiKey: "AIzaSyD2AlKBbNrp8x3hHIVaLjQHMf7Z1bgnxxk",
  authDomain: "absorb-34b0e.firebaseapp.com",
  projectId: "absorb-34b0e",
  storageBucket: "absorb-34b0e.appspot.com",
  messagingSenderId: "897083396063",
  appId: "1:897083396063:android:f2522a0b834749e5fc3e6a",
};

const iosFirebaseConfig = {
  apiKey: "AIzaSyDxPkT8wFi6GuOzda0cbW2xTdZXctjZf-E",
  authDomain: "absorb-34b0e.firebaseapp.com",
  projectId: "absorb-34b0e",
  storageBucket: "absorb-34b0e.appspot.com",
  messagingSenderId: "897083396063",
  appId: "1:897083396063:ios:cbeb3429b5b65deefc3e6a",
};

// Select the appropriate configuration based on the platform
const firebaseConfig = Platform.OS === 'ios' ? iosFirebaseConfig : androidFirebaseConfig;

//initialize firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const firestore = getFirestore(app);

export { auth, firestore };
