import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import TabBar from '../../components/TabBar';
import AntDesign from '@expo/vector-icons/AntDesign';

const _layout = () => {
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
                    headerLeft: ()=> <Text style={{fontSize: 18,}}>PingCode</Text>,
                    headerTitle : () => null,
                    headerRight: () => <AntDesign name="search1" size={24} color="black" />,
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
