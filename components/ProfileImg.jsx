import React from 'react';
import { Image, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { NAV_THEME } from '../lib/constants';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useColorScheme } from '../lib/useColorScheme';

const ProfileImg = ({ name, img, size = 56, onClick, isLoading }) => {
    const reStructuredName = name?.split(' ')?.[0]?.charAt(0) + (name?.split(' ')?.[1]?.charAt(0) || '');
    const { isDarkColorScheme } = useColorScheme();
    const themeColor = NAV_THEME[isDarkColorScheme === "light" ? "light" : "dark"];
    
    // Calculate derived dimensions based on size
    const iconSize = size / 6;
    const iconPosition = size / 10;
    
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
                {
                    img && <Image source={{ uri: img }} style={{ width: size, height: size, borderRadius: size / 2 }} />
                }
                {
                    (!img && name) && <Text style={{ fontSize: size / 4 }} className="font-bold text-white ">{reStructuredName}</Text>
                }
            </View>
            {onClick && (
                <TouchableOpacity 
                    onPress={onClick} 
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
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color={themeColor.text} />
                    ) : (
                        <AntDesign name="camera" size={iconSize/2} color={themeColor.text} />
                    )}
                </TouchableOpacity>
            )}
        </View>
    );
}

export default ProfileImg;
