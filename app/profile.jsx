import React, { memo } from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';

// Contexts and hooks
import { useAuth } from '../contexts/AuthContext';
import { useColorScheme } from '../lib/useColorScheme';
import { NAV_THEME } from '../lib/constants';

// Components
import ProfileImg from '../components/ProfileImg';
import InterestsSelector from '../components/InterestsSelector';
// Header component with back button
const ProfileHeader = memo(({ themeColor }) => (
  <TouchableOpacity className="flex-row items-center gap-x-3 align-center" onPress={() => router.push('(tabs)')} >
    <AntDesign
      name="arrowleft"
      size={24}
      color={themeColor.icon}
    />
    <Text className="text-xl" style={{ color: themeColor.text }}>Profile</Text>
  </TouchableOpacity>
));

// User info section component
const UserInfoSection = memo(({ themeColor }) => (
  <View className="items-center justify-center flex-1 gap-y-2">
    <ProfileImg
      name="Saikat Samanta"
      img="https://www.logoai.com/uploads/resources/2023/06/19/fa7fe9edacbfae0e5ad69f061d0153b8.jpeg"
      size={200}
      onClick={() => { }}
    />
    <Text style={{ color: themeColor.text }} className="text-2xl">
      Saikat Samanta
    </Text>
    <Text style={{ color: themeColor.icon }} className="text-base">
      Quote you lead your life with, write here
    </Text>
  </View>
));

// Theme toggle component
const ThemeToggle = memo(({ themeColor, isDarkColorScheme, toggleColorScheme }) => {
  const themeMode = isDarkColorScheme ? "dark" : "light";
  const colors = NAV_THEME[themeMode].interest;
  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: colors.toggleBg,
      borderWidth: 1,
      borderColor: colors.toggleBorder,
      marginBottom: 12,
      marginTop: 12
    }}>
      <Text style={{ color: themeColor.text }} className="text-base">Theme</Text>
      <Switch
        trackColor={{ false: '#767577', true: 'white' }}
        thumbColor={isDarkColorScheme === "light" ? 'white' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleColorScheme}
        value={isDarkColorScheme}
      />
    </View>
  );
});

// Sign out button component
const SignOutButton = memo(({ signOut }) => (
  <TouchableOpacity
    className="py-2 rounded"
    style={{ borderColor: 'red', borderWidth: 1 }}
    onPress={async () => {
      const result = await signOut();
      if (!result.success) {
        Alert.alert('Error', result.error || 'Failed to sign out');
      }
    }}
  >
    <Text className="text-xl text-center text-red-500">Sign Out</Text>
  </TouchableOpacity>
));

const Profile = () => {
  const { signOut } = useAuth();
  const { isDarkColorScheme, toggleColorScheme } = useColorScheme();
  const themeColor = NAV_THEME[isDarkColorScheme ? "dark" : "light"];

  return (
    <SafeAreaView style={{
      paddingTop: Platform.OS === 'android' ? 40 : 0,
      padding: 20,
      flex: 1
    }}>
      <View className="flex-1 mt-5">
        <ProfileHeader themeColor={themeColor} />
        <UserInfoSection themeColor={themeColor} />

        <View className="flex-1 mt-3">
          <Text style={{ color: themeColor.text }} className="text-xl">Preferences</Text>

          <ThemeToggle
            themeColor={themeColor}
            isDarkColorScheme={isDarkColorScheme}
            toggleColorScheme={toggleColorScheme}
          />
          <View className="py-4">
            <InterestsSelector toggle={true} />
          </View>

        </View>

        <SignOutButton signOut={signOut} />
      </View>
    </SafeAreaView>
  );
};

export default Profile;
