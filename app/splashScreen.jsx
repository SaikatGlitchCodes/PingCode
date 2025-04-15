import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

const SplashScreen = () => {
    return (
        <SafeAreaView>
            <View>
                <Text className="text-black text-3xl font-bold">Splash Screen</Text>
                <Text className="text-black text-lg">Loading...</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default SplashScreen;
