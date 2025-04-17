import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, Button } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { NAV_THEME } from '../../lib/constants';
import { useColorScheme } from '../../lib/useColorScheme';
import auth from '@react-native-firebase/auth';
import { useAuth } from '../../contexts/AuthContext';

const Chat = () => {
    const themeColor = NAV_THEME[useColorScheme === "light" ? "light" : "dark"];
    const { signOut } = useAuth();

    return (
        <SafeAreaView className="flex-1">
            <View className="flex-row items-center justify-between px-6 py-2">
                <Text style={{ color: themeColor.text }}>Chats</Text>
                <Entypo name="dots-three-horizontal" size={20} color={themeColor.text} />
            </View>
            <Button title='Logout' onPress={async () => {
                const result = await signOut();
                if (!result.success) {
                    // Handle error
                    Alert.alert('Error', result.error || 'Failed to sign out');
                }
            }} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default Chat;
