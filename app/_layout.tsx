// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';
// import { useEffect } from 'react';
// import 'react-native-reanimated';

// import { useColorScheme } from '@/hooks/useColorScheme';

// // Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     return null;
//   }

//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <Stack>
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="+not-found" />
//       </Stack>
//     </ThemeProvider>
//   );
// }
// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import {AppProvider, useAppContext} from '@/contexts/AppContext'
import SplashScreen from './splash_screen';
import { useRouter } from 'expo-router';

const AuthCheck: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading) {
      if (user) {
        
      } else {
        router.replace('/loginscreen'); // Redirect to the login page if not logged in
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <SplashScreen />;
  }

  return null; // This will be handled by useEffect redirect
};

const RootLayout: React.FC = () => {
  return (
    <AuthProvider>
      <AuthCheck />
      <AppProvider>
      <Stack>
        {/* Define your routes here */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="loginscreen"/>
        <Stack.Screen name="signupscreen" />
        {/* Add other screens as necessary */}
      </Stack>
      </AppProvider>
    </AuthProvider>
  );
};

export default RootLayout;