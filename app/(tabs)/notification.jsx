import React from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const Notification = () => {
    return (
        <SafeAreaView style={{
            paddingTop: Platform.OS === 'android' ? 40 : 0,
            padding: 20, flex: 1
        }}>
            <View>
                <Text>Notification</Text>
            </View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({})

export default Notification;
