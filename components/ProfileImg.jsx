import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { NAV_THEME } from '../lib/constants';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useColorScheme } from '../contexts/useColorScheme';
import { useAuth } from '../contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/ddxx2tgik/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'my_unsigned_preset';

const ProfileImg = ({ size = 56, onClick, isLoading }) => {
    const { userProfile, updateProfile } = useAuth();
    const { isDarkColorScheme } = useColorScheme();
    const [profileImg, setProfileImg] = useState(userProfile?.photoURL || null);
    const [localLoading, setLocalLoading] = useState(false);

    const updateProfileImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') return;

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 0.8,
            });
            
            if (result.canceled || !result.assets[0].uri) return;
            
            const { uri } = result.assets[0];
            setLocalLoading(true);
            
            try {
                setProfileImg(uri);
                const fileInfo = await FileSystem.getInfoAsync(uri);
                if (!fileInfo.exists) {
                    throw new Error('File not found');
                }
                const base64 = await FileSystem.readAsStringAsync(uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                const formData = new FormData();
                formData.append('file', `data:image/jpeg;base64,${base64}`);
                formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
                
                const response = await fetch(CLOUDINARY_URL, {
                    method: 'POST',
                    body: formData,
                });
                
                const data = await response.json();
                
                if (data.error) {
                    throw new Error(data.error.message);
                }
                await updateProfile({ photoURL: data.secure_url });
                
            } catch (error) {
                setProfileImg(userProfile?.photoURL || null);
            } finally {
                setLocalLoading(false);
            }
        } catch (error) {
            setLocalLoading(false);
        }
    };

    const getInitials = () => {
        if (!userProfile?.displayName) return '';
        const nameParts = userProfile.displayName.split(' ');
        return nameParts[0]?.charAt(0) + (nameParts[1]?.charAt(0) || '');
    };

    const reStructuredName = getInitials();
    const themeColor = NAV_THEME[isDarkColorScheme === "light" ? "light" : "dark"];
    const iconSize = size / 5;
    const iconPosition = size / 20;
    
    return (
        <View className="relative" style={{ width: size, height: size }}>
            <View
                style={{
                    backgroundColor: themeColor.primary_background,
                    width: size,
                    height: size,
                    borderRadius: size / 2
                }}
                className="items-center justify-center overflow-hidden">
                {profileImg ? 
                    <Image 
                        source={{ uri: profileImg }} 
                        style={{ width: size, height: size, borderRadius: size / 2 }} 
                    /> : 
                    reStructuredName && 
                        <Text style={{ fontSize: size / 4 }} className="font-bold text-white">
                            {reStructuredName}
                        </Text>
                }
            </View>
            {onClick && (
                <TouchableOpacity
                    onPress={updateProfileImage}
                    style={{
                        backgroundColor: themeColor.background,
                        width: iconSize,
                        height: iconSize,
                        borderRadius: iconSize / 2,
                        position: 'absolute',
                        bottom: iconPosition,
                        right: iconPosition,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    disabled={isLoading || localLoading}
                >
                    {(isLoading || localLoading) ? (
                        <ActivityIndicator size="small" color={themeColor.text} />
                    ) : (
                        <AntDesign name="camera" size={iconSize / 2} color={themeColor.text} />
                    )}
                </TouchableOpacity>
            )}
        </View>
    );
};

export default ProfileImg;
