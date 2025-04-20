import { router, Tabs, useNavigation } from 'expo-router';
import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureDetector, Gesture, GestureHandlerRootView, Directions } from 'react-native-gesture-handler';
import TabBar from '../../components/TabBar';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useColorScheme } from '../../lib/useColorScheme';
import { NAV_THEME } from '../../lib/constants';
import ProfileImg from '../../components/ProfileImg';

const _layout = () => {
    const { isDarkColorScheme } = useColorScheme();
    const themeColor = NAV_THEME[isDarkColorScheme ? "dark" : "light"];
    const navigation = useNavigation();
    const [currentTab, setCurrentTab] = useState('events');
    
    // Define the tab order for navigation
    const tabRoutes = ['index', 'notification', 'events'];

    // Create a swipe gesture handler
    const swipeGesture = Gesture.Pan()
        .activeOffsetX([-20, 20]) // Requires a minimum movement to activate
        .onEnd((event) => {
            if (Math.abs(event.translationX) < 50) return; // Ignore small movements

            const currentIndex = tabRoutes.indexOf(currentTab)-1;
            if (currentIndex === -1) return;

            // Calculate new index based on swipe direction
            const isSwipingRight = event.translationX > 0;
            const newIndex = isSwipingRight ?
                Math.max(0, currentIndex - 1) :
                Math.min(tabRoutes.length - 1, currentIndex + 1);
            
            console.log(`Swiped ${isSwipingRight ? 'right' : 'left'} to ${tabRoutes[newIndex]} from current tab ${currentTab}`);    
        });

    // Update current tab when navigation changes
    useEffect(() => {
        const unsubscribe = navigation.addListener('state', (e) => {
            const route = e.data.state.routes[e.data.state.index];
            if (route && tabRoutes.includes(route.name)) {
                setCurrentTab(route.name);
            }
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <GestureDetector gesture={swipeGesture}>
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
                                headerLeft: () => <Text style={{ fontSize: 18, color: themeColor.text }} onPress={() => {
                                    router.push('/profile');
                                }}><ProfileImg name="Saikat Samanta" img="https://www.logoai.com/uploads/resources/2023/06/19/fa7fe9edacbfae0e5ad69f061d0153b8.jpeg" size={50} /></Text>,
                                headerTitle: () => null,
                                headerRight: () => <AntDesign name="search1" size={24} color={themeColor.icon} />,
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
            </GestureDetector>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({})

export default _layout;
