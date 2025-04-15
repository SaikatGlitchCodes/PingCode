import { Stack } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
export default function RootLayout() {
    return (
        <View className='relative flex-1'>
            <Stack initialRouteName='sign-in'>
                <Stack.Screen
                    key="signin"
                    name='sign-in'
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    key="signup"
                    name='sign-up'
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>
        </View>
    );
}