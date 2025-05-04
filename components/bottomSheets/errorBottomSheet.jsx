import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { useColorScheme } from '../../contexts/useColorScheme';
import { NAV_THEME } from '../../lib/constants';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import { BottomSheetContext } from '../../app/_layout';

const ErrorBottomSheet = ({ 
  message = "An error occurred", 
  actionText = "Create Account",
  navigateTo = "/(auth)/sign-up"
}) => {
  const { isDarkColorScheme } = useColorScheme();
  const themeColor = NAV_THEME[isDarkColorScheme ? "dark" : "light"];
  const router = useRouter();
  const { closeBottomSheet } = useContext(BottomSheetContext);

  const handleAction = () => {
    closeBottomSheet();
    router.push(navigateTo);
  };

  return (
    <View className="items-center flex-1">
      <LottieView 
        style={{width: 200, height: 200}} 
        source={require('../../assets/animations/error.json')} 
        autoPlay 
        loop 
      />
      
      <Text style={{color: themeColor.text}} className="mb-6 text-lg text-center">
        {message}
      </Text>
      
      <TouchableOpacity
        className="px-6 py-3 mb-4 bg-blue-500 rounded-lg"
        onPress={handleAction}
      >
        <Text className="text-base font-semibold text-white">
          {actionText}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={closeBottomSheet}>
        <Text style={{color: themeColor.text}} className="text-base">
          Cancel
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ErrorBottomSheet;
