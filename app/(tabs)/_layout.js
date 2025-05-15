import { router, Tabs } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TabBar from '../../components/TabBar';
import {AntDesign, MaterialCommunityIcons} from '@expo/vector-icons';
import { useColorScheme } from '../../contexts/useColorScheme';
import { NAV_THEME } from '../../lib/constants';

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
                        headerRight: () => <View className="flex-row gap-x-4"> 
                                    <MaterialCommunityIcons name="skull-scan-outline" size={24} color={themeColor.icon} onPress={() => { router.push('/(backscreens)/qrScanner') }} />
                                    <AntDesign name="search1" size={24} color={themeColor.icon} onPress={() => { router.push('/(backscreens)/userSearch') }} /> 
                            </View>,
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
