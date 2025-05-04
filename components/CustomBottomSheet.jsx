import React, { useCallback, useMemo, useRef } from 'react';
import { Text, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { useColorScheme } from '../contexts/useColorScheme';
import { NAV_THEME } from '../lib/constants';

const CustomBottomSheet = ({ bottomSheetRef, snapPoints, children }) => {
  const { isDarkColorScheme } = useColorScheme();
  const themeColor = NAV_THEME[isDarkColorScheme ? "dark" : "light"];

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);
  const renderBackDrop = useCallback(
    (props) => (
      <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />
    ),
    []
  );
  // renders
  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      index={-1}
      backdropComponent={renderBackDrop}
      style={{ shadowColor: themeColor.shadow }}
      backgroundStyle={{ backgroundColor: themeColor.truesheet }}
      handleIndicatorStyle={{ backgroundColor: themeColor.icon }}
    >
      <BottomSheetView style={styles.contentContainer}>
        {children}
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
});

export default CustomBottomSheet;