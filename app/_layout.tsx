import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useColorScheme } from '@/hooks/useColorScheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const user = await AsyncStorage.getItem('username');
      setIsLoggedIn(!!user);
    };
    checkLogin();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {isLoggedIn ? (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="screens/LoginScreen" options={{ headerShown: false }} />
            <Stack.Screen name="screens/RegisterScreen" options={{ title: 'Register' }} />
          </>
        )}

        {/* Additional Screens accessible from anywhere */}
        <Stack.Screen name="screens/ListingsScreen" options={{ title: 'Listings' }} />
        <Stack.Screen name="screens/CreateListingScreen" options={{ title: 'New Listing' }} />
        <Stack.Screen name="screens/EditListingScreen" options={{ title: 'Edit Listing' }} />
        <Stack.Screen name="screens/LoginScreen" options={{ title: 'Login' }} />
        <Stack.Screen name="screens/RegisterScreen" options={{ title: 'Register' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
