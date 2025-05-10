import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Text, ActivityIndicator } from 'react-native';
import ProfileImg from './ProfileImg';
import JoinedProfiles from './JoinedProfiles';
import { getUserProfile } from '../services/userService';
import { useColorScheme } from '../contexts/useColorScheme';
import { NAV_THEME } from '../lib/constants';
import { useRouter } from 'expo-router';
import { formatDateTime } from '../services/utilService';

const EventCard = ({ event }) => {
    const [creatorProfile, setCreatorProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { isDarkColorScheme } = useColorScheme();
    const themeColor = NAV_THEME[isDarkColorScheme ? "dark" : "light"];
    
    useEffect(() => {
        const fetchCreatorProfile = async () => {
            try {
                const { data } = await getUserProfile(event.item.createdBy);
                setCreatorProfile(data);
            } catch (error) {
                console.error("Error fetching creator profile:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchCreatorProfile();
    }, [event.item.createdBy]);
    
    return (
        <TouchableOpacity 
            className="relative w-56 mr-3 overflow-hidden rounded-lg shadow-lg h-80"
            style={{ backgroundColor: themeColor.card }}
            onPress={() => { router.push({
                pathname: '/(backscreens)/eventDetails',
                params: { eventDetailInfo: JSON.stringify(event.item)}
            }) }}
        >
            <Image 
                source={{ uri: event.item.coverImageUrl }}
                style={styles.image}
                resizeMode="cover"
                defaultSource={require('../assets/images/noeventImage.jpg')}
            />
            
            <View className="px-3 py-2">
                <Text className="mt-1 text-lg font-semibold " style={{ color: themeColor.text }}>
                    {event.item.title}
                </Text>
                
                <Text className="mt-1 text-sm" style={{ color: themeColor.textSecondary }} numberOfLines={2}>
                    {event.item.description}
                </Text>
                <Text className="my-2 text-xs" style={{ color: themeColor.textSecondary }}>
                    {formatDateTime(event.item.startTime)}
                </Text> 
                <View className="flex-row items-center mt-2">
                    {loading ? (
                        <ActivityIndicator size="small" color={themeColor.primary} />
                    ) : creatorProfile ? (
                        <>
                            <ProfileImg size={24} userProfile={creatorProfile} />
                            <Text className="ml-2 text-sm" style={{ color: themeColor.text }}>
                                {creatorProfile.displayName || 'Anonymous'}
                            </Text>
                        </>
                    ) : (
                        <Text style={{ color: themeColor.textSecondary }}>Unknown creator</Text>
                    )}
                </View>
            </View>
            
            <JoinedProfiles 
                joinedUserIds={event.item.joinedUsers}
                themeColor={themeColor} 
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 150,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        shadowColor: 'black',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity:  0.5,
        shadowRadius: 3,
        elevation: 5,
    },
});

export default EventCard;
