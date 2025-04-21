import '../global.css';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, View } from 'react-native';
import { NAV_THEME } from '../lib/constants';
import { useColorScheme } from '../contexts/useColorScheme';
import { setAndroidNavigationBar } from '../lib/android-navigation-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SplashScreen from './splashScreen';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

const LIGHT_THEME = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  ErrorBoundary,
} from 'expo-router';

function AppLayout() {
  const { user } = useAuth();

  return (
    <View className='relative flex-1'>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_left' }}>
        {user ? (
          <>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="profile" />
          </>
        ) : (
          <Stack.Screen name="(auth)" />
        )}
        {/* <Stack.Screen name="+not-found" options={{ presentation: 'modal' }} /> */}
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem('theme');
      if (Platform.OS === 'web') {
        document.documentElement.classList.add('bg-background');
      }
      if (!theme) {
        AsyncStorage.setItem('theme', colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === 'dark' ? 'dark' : 'light';
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);
        setAndroidNavigationBar(colorTheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      setAndroidNavigationBar(colorTheme);
      setIsColorSchemeLoaded(true);
    })().finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
        <AuthProvider>
          <AppLayout />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}