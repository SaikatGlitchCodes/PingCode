import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAndroidNavigationBar } from '../lib/android-navigation-bar';

// Key for storing theme preference
const THEME_STORAGE_KEY = '@theme_preference';

export function useColorScheme() {
  const { colorScheme, setColorScheme } = useNativewindColorScheme();
  
  // Load saved theme preference on initial render
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          setColorScheme(savedTheme);
          setAndroidNavigationBar(savedTheme);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    };
    
    loadSavedTheme();
  }, []);
  
  // Custom toggleColorScheme that saves preference
  const toggleColorScheme = async () => {
    try {
      const newTheme = colorScheme === 'dark' ? 'light' : 'dark';
      setColorScheme(newTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setAndroidNavigationBar(newTheme);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };
  
  // Updated setColorScheme that saves preference
  const setAndSaveColorScheme = async (theme) => {
    try {
      setColorScheme(theme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
      setAndroidNavigationBar(theme);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };
  
  return {
    colorScheme: colorScheme ?? 'dark',
    isDarkColorScheme: colorScheme === 'dark',
    setColorScheme: setAndSaveColorScheme,
    toggleColorScheme,
  };
}
