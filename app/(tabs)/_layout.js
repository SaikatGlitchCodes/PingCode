import { router, Tabs, useNavigation } from 'expo-router';
import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureDetector, Gesture, GestureHandlerRootView, Directions } from 'react-native-gesture-handler';
import TabBar from '../../components/TabBar';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useColorScheme } from '../../contexts/useColorScheme';
import { NAV_THEME } from '../../lib/constants';
import ProfileImg from '../../components/ProfileImg';

const _layout = () => {
    const { isDarkColorScheme } = useColorScheme();
    const themeColor = NAV_THEME[isDarkColorScheme ? "dark" : "light"];

    return (
        <View style={{ flex: 1 }}>
            <Tabs
                tabBar={props => <TabBar {...props} />}
                initialRouteName='events'>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Chat',
                        headerLeftContainerStyle: {
                            paddingLeft: 20
                        },
                        headerRightContainerStyle: {
                            paddingRight: 20
                        },
                        headerLeft: () =>
                            <TouchableOpacity className="flex-row items-center gap-x-3" onPress={() => { router.push('/(backscreens)/profile'); }}>
                                {/* <ProfileImg size={38} /> */}
                                <Text style={{ fontSize: 18, color: themeColor.text }}>PingCode</Text>
                            </TouchableOpacity>,
                        headerTitle: () => null,
                        headerRight: () => <AntDesign name="search1" size={24} color={themeColor.icon} onPress={() => { router.push('/(backscreens)/userSearch') }} />,
                    }}
                />
                <Tabs.Screen
                    name="notification"
                    options={{ title: 'Notification' }}
                />
                <Tabs.Screen
                    name="events"
                    options={{ title: 'Events', btn: true }}
                />
            </Tabs>
        </View>
    );
}

const styles = StyleSheet.create({})

export default _layout;
