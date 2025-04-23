import React, {useEffect} from 'react';
import { StyleSheet, View, Text, SafeAreaView, Button, Platform } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { NAV_THEME } from '../../lib/constants';
import { useColorScheme } from '../../contexts/useColorScheme';
import { fetchUsersYouTexted } from '../../services/chatService';


const Chat = () => {
    const { isDarkColorScheme } = useColorScheme();
    const themeColor = NAV_THEME[isDarkColorScheme ? "dark" : "light"];
    useEffect(()=>{
        const fetchData = async () => {
            try {
                const response = await fetchUsersYouTexted();
                console.log('Response : ',response);
            } catch (error) {
                console.error('Error fetching chatted users:', error);
            }
        };
        fetchData();
    })

    return (
        <SafeAreaView style={{
            padding: 20, flex: 1
        }}>
            <View className="flex-row items-center justify-between">
                <Text style={{ color: themeColor.text }}>Chats</Text>
                <Entypo name="dots-three-horizontal" size={20} color={themeColor.icon} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default Chat;
