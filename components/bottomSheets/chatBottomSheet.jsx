import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useColorScheme } from '../../contexts/useColorScheme';
import { NAV_THEME } from '../../lib/constants';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../../contexts/AuthContext';

const ChatBottomSheet = () => {
    const { isDarkColorScheme } = useColorScheme();
    const themeColor = NAV_THEME[isDarkColorScheme ? "dark" : "light"];
    const { userProfile } = useAuth();
    return (
        <View className="flex-col items-center justify-center flex-1">
            <Text className="mb-4 text-lg" style={{ color: themeColor.text }}>Scan to add user's in list</Text>
            <QRCode
                value={userProfile?.displayName}
                size={250}
                backgroundColor={themeColor.truesheet}
            />
        </View>
    );
}

const styles = StyleSheet.create({})

export default ChatBottomSheet;
