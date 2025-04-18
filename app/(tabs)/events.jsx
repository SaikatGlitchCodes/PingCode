import React from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import InterestsSelector from '../../components/InterestsSelector';

const Events = () => {

    return (
        <SafeAreaView style={{
            paddingTop: Platform.OS === 'android' ? 10 : 0,
            padding: 10, flex: 1
        }}>
            <View>
                <InterestsSelector />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default Events;
