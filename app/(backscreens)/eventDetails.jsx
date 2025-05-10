import React, { useState, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useColorScheme } from '../../contexts/useColorScheme';
import { NAV_THEME } from '../../lib/constants';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import ImageSlider from '../../components/ImageSlider';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import MapScreen from '../../components/MapView';
import { formatDateTime } from '../../services/utilService';
import JoinedProfiles from '../../components/JoinedProfiles';

const EventDetails = () => {
    const { eventDetailInfo } = useLocalSearchParams();
    const [showFullDescription, setShowFullDescription] = useState(false);
    const { isDarkColorScheme } = useColorScheme();

    // Memoize expensive operations
    const parsedEventDetail = useMemo(() => {
        try {
            return JSON.parse(eventDetailInfo);
        } catch (error) {
            console.error("Failed to parse event details:", error);
            return {};
        }
    }, [eventDetailInfo]);

    const themeColor = useMemo(() =>
        NAV_THEME[isDarkColorScheme ? "dark" : "light"],
        [isDarkColorScheme]
    );

    const toggleDescription = useCallback(() =>
        setShowFullDescription(prev => !prev),
        []
    );

    const handleBack = useCallback(() => router.back(), []);

    // Extract image data once
    const imageData = useMemo(() =>
        [parsedEventDetail.coverImageUrl, ...(parsedEventDetail.photos || [])].filter(Boolean),
        [parsedEventDetail.coverImageUrl, parsedEventDetail.photos]
    );

    const renderTags = useMemo(() => {
        return parsedEventDetail?.tags?.map((tag, index) => (
            <Text
                key={index}
                className="px-1 py-1 mx-1 text-lg rounded-md"
                style={{ color: themeColor.text, backgroundColor: themeColor.card }}
            >
                {tag}
            </Text>
        ));
    }, [parsedEventDetail.tags, themeColor]);

    // Check if description should have "show more" button
    const shouldShowMoreButton = useMemo(() =>
        parsedEventDetail.description &&
        parsedEventDetail.description.length > 120,
        [parsedEventDetail.description]
    );

    if (!parsedEventDetail || Object.keys(parsedEventDetail).length === 0) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: themeColor.background }]}>
                <Text style={{ color: themeColor.text, textAlign: 'center', marginTop: 20 }}>
                    Event information not available
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="relative" style={[styles.container, { backgroundColor: themeColor.background }]}>
            <View className="flex-row items-center justify-between p-4 border-b-[1px] border-gray-200">
                <AntDesign name="arrowleft" size={24} color={themeColor.icon} onPress={handleBack} />
                <Text
                    style={{ color: themeColor.text }}
                    className="flex-1 mx-2 text-lg text-center"
                    numberOfLines={1}
                >
                    {parsedEventDetail.title}
                </Text>
                <AntDesign name="sharealt" size={24} color={themeColor.icon} />
            </View>

            <ScrollView className="flex-1 w-full pt-5">
                {imageData.length > 0 && <ImageSlider images={imageData} />}

                <View className="flex-row items-center justify-between px-6 mt-4">
                    <View style={{ backgroundColor: themeColor.card }} className="flex-row items-center justify-between px-5 py-2 rounded-full shadow-2xl gap-x-8">
                        <Text className="text-lg" style={{ color: themeColor.text }}>
                            {parsedEventDetail?.interestedUsers?.length || 0} are Interested
                        </Text>
                        <Ionicons name="heart-circle" size={30} color="black" />
                    </View>

                    <TouchableOpacity style={{ backgroundColor: themeColor.btn }} className="flex-row items-center justify-between py-3 rounded-full shadow-xl px-7">
                        <Text style={{ color: themeColor.btnText }}>Invite</Text>
                    </TouchableOpacity>
                </View>

                <View className="px-8 pb-12">
                    <Text className="mt-6 text-2xl font-semibold" style={{ color: themeColor.text }}>
                        {parsedEventDetail.title}
                    </Text>

                    {parsedEventDetail?.tags?.length > 0 && (
                        <View className="flex-row flex-wrap items-center my-3">
                            <AntDesign name="tago" size={22} color={themeColor.icon} />
                            {renderTags}
                        </View>
                    )}

                    {parsedEventDetail?.startTime && (
                        <View className="flex-row items-center">
                            <Entypo name="time-slot" size={22} color={themeColor.icon} />
                            <Text className="pl-3 text-md" style={{ color: themeColor.text }}>
                                {formatDateTime(parsedEventDetail.startTime)}
                            </Text>
                        </View>
                    )}
                    {parsedEventDetail?.joinedUsers && (
                        <View className="flex-row items-center mt-3">
                            <AntDesign name="addusergroup" size={22} color={themeColor.icon} />
                            <JoinedProfiles joinedUserIds={parsedEventDetail.joinedUsers} themeColor={themeColor} containerStyle="pl-3" />
                        </View>
                    )}
                    
                    <Text className="mt-10 text-lg font-semibold" style={{ color: themeColor.text }}>
                        About this Event
                    </Text>

                    {parsedEventDetail.description ? (
                        <>
                            <Text
                                className="mt-4 text-lg text-gray-500"
                                numberOfLines={showFullDescription ? undefined : 3}
                            >
                                {parsedEventDetail.description}
                            </Text>

                            {shouldShowMoreButton && (
                                <TouchableOpacity
                                    onPress={toggleDescription}
                                    className="mt-2"
                                >
                                    <Text style={{ color: themeColor.primary, fontWeight: '500' }}>
                                        {showFullDescription ? 'Show less' : 'Show more'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </>
                    ) : (
                        <Text className="mt-4 text-lg italic" style={{ color: themeColor.textSecondary }}>
                            No description available
                        </Text>
                    )}

                    {parsedEventDetail.location?.address && (
                        <View className="mt-8">
                            <View className="flex-row items-center py-1 gap-x-2">
                                <SimpleLineIcons name="direction" size={22} color={themeColor.icon} />
                                <Text className="text-lg font-semibold" style={{ color: themeColor.text }}>
                                    {parsedEventDetail.location.address}
                                </Text>
                            </View>
                            {/* Only render map if location exists */}
                            <MapScreen location={parsedEventDetail.location} />
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 40 : 0,
    },
});

export default React.memo(EventDetails);
