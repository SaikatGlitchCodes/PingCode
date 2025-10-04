import React, { useMemo } from 'react';
import { Platform, SafeAreaView, StyleSheet, View, Image, useColorScheme, Text } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { NAV_THEME } from '../../lib/constants';

const CreatedEvents = () => {
    const { isDarkColorScheme } = useColorScheme();
    const themeColor = useMemo(() =>
    NAV_THEME[isDarkColorScheme ? "dark" : "light"],
    [isDarkColorScheme]
    );
    return (
        <SafeAreaView className={`flex-1 p-6 ${Platform.OS === 'android' ? 'pt-16' : ''}`}>
            <View className="flex-row items-center justify-between">
                <Image
                    source={require('../../assets/images/bolt.png')}
                    className="w-10 h-10"
                    resizeMode="contain"
                />
                <AntDesign name="close" size={24} color={themeColor.icon} />
            </View>
            <Text className="mt-4 text-2xl">Create Event </Text>
            <Text className="text-md" style={{ color: themeColor.icon }}>
                Create your own event for FREE!
            </Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default CreatedEvents;
