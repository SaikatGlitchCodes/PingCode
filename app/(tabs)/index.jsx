import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';

const Chat = () => {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-row items-center justify-between px-6 py-2">
                <Text>Chats</Text>
                <Entypo name="dots-three-horizontal" size={20} color="black" />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default Chat;
