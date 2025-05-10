import React from 'react';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';

const CreatedEvents = () => {
    return (
        <SafeAreaView className={`flex-1 p-2 ${Platform.OS === 'android' ? 'pt-16' : ''}`}>
            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default CreatedEvents;
