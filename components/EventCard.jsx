import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Text, ActivityIndicator } from 'react-native';
import ProfileImg from './ProfileImg';
import { getUserProfile } from '../services/userService';
import { useColorScheme } from '../contexts/useColorScheme';
import { NAV_THEME } from '../lib/constants';
import { useRouter } from 'expo-router';

const formatDateTime = (dateTimeStr) => {
  const date = new Date(dateTimeStr);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) return dateTimeStr;
  
  const options = { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true
  };
  
  return date.toLocaleString('en-US', options);
};

const EventCard = ({ event }) => {
    const [creatorProfile, setCreatorProfile] = useState(null);
    const [joinedProfiles, setJoinedProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { isDarkColorScheme } = useColorScheme();
    const themeColor = NAV_THEME[isDarkColorScheme ? "dark" : "light"];
    
    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const { data } = await getUserProfile(event.item.createdBy);
                setCreatorProfile(data);
            
                const joinedUsers = event.item.joinedUsers.slice(0, 5);
                const profilePromises = joinedUsers.map((userId) => getUserProfile(userId));
                const profiles = await Promise.all(profilePromises);
                setJoinedProfiles(profiles.filter(profile => profile != null));
            } catch (error) {
                console.error("Error fetching profiles:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchProfiles();
    }, [event.item.createdBy, event.item.joinedUsers]);
    
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
            {!loading && joinedProfiles.length > 0 && (
                    <View className="absolute mt-3 top-1 left-2">
                        <View className="flex-row">
                            {joinedProfiles.map((profile, index) => (
                                <View key={index} style={{ marginLeft: index > 0 ? -10 : 0, zIndex: 10 - index }}>
                                    <ProfileImg size={25} userProfile={profile.data} borderWidth={1} borderColor="white" />
                                </View>
                            ))}
                            
                            {event.item.joinedUsers.length > 5 && (
                                <View className="justify-center ml-1">
                                    <Text className="text-xs" style={{ color: themeColor.textSecondary }}>
                                        +{event.item.joinedUsers.length - 5} more
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}
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
