import '../global.css';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, View } from 'react-native';
import { NAV_THEME } from '../lib/constants';
import { useColorScheme } from '../lib/useColorScheme';
import { setAndroidNavigationBar } from '../lib/android-navigation-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SplashScreen from './splashScreen';

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


export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
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
  if (isLoading) {
    return <SplashScreen />;
  }
  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
        <View className='relative flex-1'>
          <Stack> 
            { !isAuthenticated ? 
            <Stack.Screen
              key="auth"
              name='(auth)'
              options={{
                headerShown: false,
              }}
            /> :
            <Stack.Screen
              key="tabs"
              name='(tabs)'
              options={{
                headerShown: false,
              }}
            />}
            <Stack.Screen
              key="not-found"
              name='+not-found'
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </View>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}