import { router, Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import TabBar from '../../components/TabBar';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useColorScheme } from '../../lib/useColorScheme';
import { NAV_THEME } from '../../lib/constants';
import ProfileImg from '../../components/ProfileImg';

const _layout = () => {
    const { isDarkColorScheme } = useColorScheme();
    const themeColor = NAV_THEME[isDarkColorScheme ? "dark" : "light"];
    return (
        <Tabs 
            tabBar={props=> <TabBar {...props} />} initialRouteName='events'>
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
                    headerLeft: ()=> <Text style={{fontSize: 18, color: themeColor.text}} onPress={()=>{
                        router.push('/profile');
                    }}><ProfileImg name="Saikat Samanta" img="https://www.logoai.com/uploads/resources/2023/06/19/fa7fe9edacbfae0e5ad69f061d0153b8.jpeg" size={50}  /></Text>,
                    headerTitle : () => null,
                    headerRight: () => <AntDesign name="search1" size={24} color={themeColor.icon} />,
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
