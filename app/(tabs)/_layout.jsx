import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import TabBar from '../../components/TabBar';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useColorScheme } from '../../lib/useColorScheme';
import { NAV_THEME } from '../../lib/constants';

const _layout = () => {
    const themeColor = NAV_THEME[useColorScheme === "light" ? "light" : "dark"];
    return (
        <Tabs 
            tabBar={props=> <TabBar {...props} />}>
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
                    headerLeft: ()=> <Text style={{fontSize: 18, color: themeColor.text}}>PingCode</Text>,
                    headerTitle : () => null,
                    headerRight: () => <AntDesign name="search1" size={24} color={themeColor.text} />,
                }} 
                />
            <Tabs.Screen 
                name="notification" 
                options={{ title: 'Notification' }} 
                />
            <Tabs.Screen 
                name="events" 
                options={{ title: 'Events', btn:true }} 
                />  
        </Tabs>
    );
}

const styles = StyleSheet.create({})

export default _layout;
