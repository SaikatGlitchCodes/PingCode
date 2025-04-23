import React, { memo, useState, useEffect } from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';

import { useAuth } from '../../contexts/AuthContext';
import { useColorScheme } from '../../contexts/useColorScheme';
import { NAV_THEME } from '../../lib/constants';

import ProfileImg from '../../components/ProfileImg';
import InterestsSelector from '../../components/InterestsSelector';

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

const UserInfoSection = memo(({ themeColor, profile, onUpdate, isEditing, setIsEditing }) => {
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [bio, setBio] = useState(profile?.bio || '');

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  const handleSave = () => {
    onUpdate({ displayName, bio });
    setIsEditing(false);
  };

  return (
    <View className="items-center justify-center flex-1 pt-8 gap-y-2">
      <ProfileImg
        size={170}
        onClick={true}
      />

      {isEditing ? (
        <>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            className="w-4/5 p-1 mt-3 text-2xl text-center border-b"
            style={{
              color: themeColor.text,
              borderBottomColor: themeColor.border
            }}
            placeholder="Display Name"
            placeholderTextColor={themeColor.icon}
          />

          <TextInput
            value={bio}
            onChangeText={setBio}
            className="text-base text-center border-b p-1 mt-1.5 w-4/5"
            style={{
              color: themeColor.text,
              borderBottomColor: themeColor.border
            }}
            placeholder="Add your bio here..."
            placeholderTextColor={themeColor.icon}
            multiline
          />

          <TouchableOpacity
            onPress={handleSave}
            className="bg-[#FCC600] py-2 px-5 rounded-full mt-3"
          >
            <Text className="font-medium text-black">Save Profile</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={{ color: themeColor.text }} className="text-2xl">
            {profile?.displayName || 'User'}
          </Text>
          <Text style={{ color: themeColor.icon }} className="px-4 text-base text-center">
            {profile?.bio || "Add your bio here..."}
          </Text>
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            className="flex-row items-center mt-2.5"
          >
            <AntDesign name="edit" size={16} color={themeColor.icon} />
            <Text style={{ color: themeColor.icon }} className="ml-1.5">Edit Profile</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
});

const ThemeToggle = memo(({ themeColor, isDarkColorScheme, toggleColorScheme }) => {
  const themeMode = isDarkColorScheme ? "dark" : "light";
  const colors = NAV_THEME[themeMode].interest;

  return (
    <View
      className="flex-row justify-between items-center py-2.5 px-4 rounded-lg border my-3"
      style={{
        backgroundColor: colors.toggleBg,
        borderColor: colors.toggleBorder,
      }}
    >
      <Text style={{ color: themeColor.text }} className="text-base">Dark theme</Text>
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

const SignOutButton = memo(({ signOut }) => (
  <TouchableOpacity
    className="py-3 border border-[#ff1e1e94] rounded-lg"
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
  const { signOut, userProfile, updateProfile } = useAuth();
  const { isDarkColorScheme, toggleColorScheme } = useColorScheme();
  const [isEditing, setIsEditing] = useState(false);
  const themeColor = NAV_THEME[isDarkColorScheme ? "dark" : "light"];

  // Handle profile data updates
  const handleUpdateProfile = async (profileData) => {
    try {
      const result = await updateProfile(profileData);
      if (!result.success) {
        Alert.alert('Error', result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  return (
    <SafeAreaView className={`flex-1 p-5 ${Platform.OS === 'android' ? 'pt-10' : ''}`}>
      <ScrollView className="flex-1 mt-5" showsVerticalScrollIndicator={false}>
        <ProfileHeader themeColor={themeColor} />
        <UserInfoSection
          themeColor={themeColor}
          profile={userProfile}
          onUpdate={handleUpdateProfile}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />

        <View className="flex-1 mt-3">
          <Text style={{ color: themeColor.text }} className="text-xl">Preferences</Text>

          <ThemeToggle
            themeColor={themeColor}
            isDarkColorScheme={isDarkColorScheme}
            toggleColorScheme={toggleColorScheme}
          />

          <View className="py-4">
            <InterestsSelector
              toggle={true}
            />
          </View>
        </View>
        <SignOutButton signOut={signOut} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
