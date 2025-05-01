import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Platform, SafeAreaView, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useColorScheme } from '../../contexts/useColorScheme';
import { NAV_THEME } from '../../lib/constants';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getUserByDisplayName } from '../../services/searchService';
import ProfileImg from '../../components/ProfileImg';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { addUserConnection } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';

const UserSearch = () => {
    const { isDarkColorScheme } = useColorScheme();
    const { user } = useAuth();
    const themeColor = NAV_THEME[isDarkColorScheme ? "dark" : "light"];
    const router = useRouter();
    const inputRef = useRef(null);
    const [searchedUser, setSearchedUser] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const debounceTimeoutRef = useRef(null);
    console.log('USER : ', user.uid)
    useEffect(() => {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
        
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);
    
    const debouncedSearch = useCallback((query) => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        
        if (!query.trim()) {
            setSearchedUser([]);
            return;
        }
        
        debounceTimeoutRef.current = setTimeout(async () => {
            try {
                const { users } = await getUserByDisplayName(query.trim());
                setSearchedUser(users || []);
            } catch (error) {
                console.error('Search error:', error);
                setSearchedUser([]);
            }
        }, 500);
    }, []);
    
    const handleUserSearch = (text) => {
        setSearchQuery(text);
        debouncedSearch(text);
    };
    
    const handleSearchButtonPress = () => {
        if (searchQuery.trim()) {
            (async () => {
                try {
                    const { users } = await getUserByDisplayName(searchQuery.trim());
                    setSearchedUser(users || []);
                } catch (error) {
                    console.error('Search error:', error);
                    setSearchedUser([]);
                }
            })();
        }
    };
    return (
        <SafeAreaView className={`flex-1 p-5 ${Platform.OS === 'android' ? 'pt-10' : ''}`}
            style={{ backgroundColor: themeColor.background }}>
            <View className="mt-4">
                <Text className="mb-6 text-2xl font-bold" style={{ color: themeColor.text }}>
                    Find a User
                </Text>

                <View className="space-y-4">
                    <View className="flex-row items-center space-x-2 border rounded-lg" style={{ borderColor: themeColor.icon }}>
                        <View className="flex-1">
                            <TextInput
                                ref={inputRef}
                                placeholder="Enter user ID"
                                placeholderTextColor={themeColor.textSecondary}
                                onChangeText={handleUserSearch}
                                value={searchQuery}
                                className="h-12 px-4 text-base border-none"
                                style={{
                                    color: themeColor.text,
                                    borderColor: themeColor.border
                                }}
                                autoCapitalize="none"
                                returnKeyType="search"
                                onSubmitEditing={handleSearchButtonPress}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={handleSearchButtonPress}
                            className="items-center justify-center w-12 h-12 rounded-lg"
                        >
                            <Ionicons name="search" size={20} color={themeColor.text} />
                        </TouchableOpacity>
                    </View>

                    <Text className="mt-6 text-center" style={{ color: themeColor.text }}>
                        Enter a user ID to start chatting
                    </Text>
                    <ScrollView className="mt-4" showsVerticalScrollIndicator={false}>
                        {
                            searchedUser.map((users, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={ async () => {
                                        await addUserConnection(user.uid, users.uuid)
                                        router.push({
                                            pathname: '/chat',
                                            params: { userId: users.uuid }
                                        });
                                    }}
                                    className="flex-row items-center justify-between px-4 py-3 mb-2 rounded-lg gap-x-4 bg--gray-100"
                                    style={{ backgroundColor: themeColor.primary_background }}>
                                    <View className="flex-row items-center gap-x-3">
                                        <ProfileImg size={45} userProfile={user} />
                                        <Text className="text-xl" style={{ color: themeColor.text }}>
                                            {user.displayName}
                                        </Text>
                                    </View>
                                    <MaterialIcons name="messenger-outline" size={24} color={themeColor.text} />
                                </TouchableOpacity>
                            ))
                        }
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default UserSearch;
