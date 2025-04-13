import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';

const tabStyle = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    tab: {
        backgroundColor: '#fff',
    },
    btn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: 20,
        color: 'white',
        backgroundColor: 'black',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
})


const TabBar = ({ state, descriptors, navigation }) => {
    const { buildHref } = useLinkBuilder();

    const icons = {
        index: (props) =><Ionicons name="chatbubble-ellipses-outline" size={24} color="black" {...props} />,
        notification: (props) => <AntDesign name="notification" size={24} color="black"  {...props} />,
        events: (props) => <AntDesign name="plus" size={24} color="black" {...props} />,
    }
    return (
        <View style={tabStyle.container}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;
        
          
                if (['_sitemap', '+not-found'].includes(route.name)) {
                    return null;
                }
                const isFocused = state.index === index;

                const onPress = () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    console.log('long press');
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };
                if (options.btn) {
                    return (
                        <TouchableOpacity
                            key={route.name}
                            href={buildHref(route.name, route.params)}
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarButtonTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={tabStyle.btn}
                        >
                            {
                                icons[route.name] ? icons[route.name]({ color: 'white', size: 25 }) : null
                            }
                            <Text style={{ color: 'white', fontSize: 18 }}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                }
                return (
                    <TouchableOpacity
                        key={route.name}
                        href={buildHref(route.name, route.params)}
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarButtonTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={tabStyle.tab}
                    >
                        {
                            icons[route.name] ? icons[route.name]({ color:  'black', size: 30 }) : null
                        }
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

export default TabBar;
