import React, { useCallback, useMemo, useRef } from 'react';
import { useColorScheme } from '../../contexts/useColorScheme';
import { Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import CustomBottomSheet from '../../components/CustomBottomSheet';
import { NAV_THEME } from '../../lib/constants';

const Notification = () => {
    const sheetRef = useRef(null);
    const { isDarkColorScheme } = useColorScheme();
    const themeColor = NAV_THEME[isDarkColorScheme ? "dark" : "light"];
    // variables
    const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);
    const handleSnapPress = useCallback((index) => {
        sheetRef.current?.snapToIndex(index);
    }, []);
    return (
        <SafeAreaView style={{
            paddingTop: Platform.OS === 'android' ? 40 : 0,
            flex: 1,
        }}>
            <View className="flex-1">
                <Text style={{ color: themeColor.text }} onPress={() => handleSnapPress(2)}>Notification</Text>
                <CustomBottomSheet bottomSheetRef={sheetRef} snapPoints={snapPoints}></CustomBottomSheet>
            </View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({})

export default Notification;
