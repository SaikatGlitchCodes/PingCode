import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import ProfileImg from './ProfileImg';
import { getUserProfile } from '../services/userService';

const JoinedProfiles = ({ joinedUserIds, themeColor, containerStyle="absolute mt-3 top-1 left-2" }) => {
    const [joinedProfiles, setJoinedProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchJoinedProfiles = async () => {
            try {
                const usersToFetch = joinedUserIds.slice(0, 5);
                const profilePromises = usersToFetch.map((userId) => getUserProfile(userId));
                const profiles = await Promise.all(profilePromises);
                setJoinedProfiles(profiles.filter(profile => profile != null));
            } catch (error) {
                console.error("Error fetching joined profiles:", error);
            } finally {
                setLoading(false);
            }
        };
        
        if (joinedUserIds && joinedUserIds.length > 0) {
            fetchJoinedProfiles();
        } else {
            setLoading(false);
        }
    }, [joinedUserIds]);
    
    if (loading) return null;
    if (joinedProfiles.length === 0) return null;
    
    const totalJoinedUsers = joinedUserIds.length;

    return (
        <View className={containerStyle}>
            <View className="flex-row">
                {joinedProfiles.map((profile, index) => (
                    <View key={index} style={{ marginLeft: index > 0 ? -10 : 0, zIndex: 10 - index }}>
                        <ProfileImg 
                            size={25} 
                            userProfile={profile.data} 
                            borderWidth={1} 
                            borderColor="white" 
                        />
                    </View>
                ))}
                
                {totalJoinedUsers > 5 && (
                    <View className="justify-center ml-1">
                        <Text className="text-xs" style={{ color: themeColor.textSecondary }}>
                            +{totalJoinedUsers - 5} more
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export default JoinedProfiles;
