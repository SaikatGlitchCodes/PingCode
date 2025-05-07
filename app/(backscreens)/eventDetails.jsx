import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useColorScheme } from '../../contexts/useColorScheme';
import { NAV_THEME } from '../../lib/constants';
import { AntDesign } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import ImageSlider from '../../components/ImageSlider';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import MapScreen from '../../components/MapView';

const EventDetails = () => {
    const { eventDetailInfo } = useLocalSearchParams();
    const parsedEventDetail = JSON.parse(eventDetailInfo);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const { isDarkColorScheme } = useColorScheme();
    const themeColor = NAV_THEME[isDarkColorScheme ? "dark" : "light"];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeColor.background }]}>
            <View className="flex-row items-center justify-between p-4">
                <AntDesign name="arrowleft" size={24} color={themeColor.icon} onPress={() => router.back()} />
                <Text style={{ color: themeColor.text }} className="text-lg">Event Detail</Text>
                <AntDesign name="sharealt" size={24} color={themeColor.icon} />
            </View>
            <ScrollView className="flex-1 w-full mt-3">
                <ImageSlider images={[parsedEventDetail.coverImageUrl, ...parsedEventDetail.photos]} />
                <View className="p-6">
                    <Text className="text-2xl font-bold" style={{ color: themeColor.text }}>{parsedEventDetail.title}</Text>
                    <Text className="mt-3 font-semibold" style={{ color: themeColor.text }}>About this Event</Text>

                    <Text
                        className="mt-1 text-gray-500"
                        numberOfLines={showFullDescription ? undefined : 3}
                    >
                        {parsedEventDetail.description}
                    </Text>

                    {parsedEventDetail.description && parsedEventDetail.description.length > 120 && (
                        <TouchableOpacity
                            onPress={() => setShowFullDescription(!showFullDescription)}
                            className="mt-1"
                        >
                            <Text style={{ color: themeColor.primary, fontWeight: '500' }}>
                                {showFullDescription ? 'Show less' : 'Show more'}
                            </Text>
                        </TouchableOpacity>
                    )}
                    <View className="flex-row items-center py-1 my-3">
                        <EvilIcons name="location" size={24} color="black" />
                        <Text className="mt-1 font-semibold text-gray-500" style={{ color: themeColor.text }}>
                            {parsedEventDetail.location?.address}
                        </Text>
                    </View>
                    <MapScreen/>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 40 : 0,
    },
})

export default EventDetails;
