import React, { useState, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useColorScheme } from '../../contexts/useColorScheme';
import { NAV_THEME } from '../../lib/constants';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import ImageSlider from '../../components/ImageSlider';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import MapScreen from '../../components/MapView';
import { formatDateTime } from '../../services/utilService';
import JoinedProfiles from '../../components/JoinedProfiles';
import SwipeButton from 'rn-swipe-button';

// Extracted components for better readability
const Header = React.memo(({ title, themeColor, handleBack }) => (
  <View className="flex-row items-center justify-between p-4 border-b-[1px] z-10" style={{ borderColor: themeColor.border }}>
    <AntDesign name="arrowleft" size={24} color={themeColor.icon} onPress={handleBack} />
    <Text
      style={{ color: themeColor.text }}
      className="flex-1 mx-2 text-lg text-center"
      numberOfLines={1}
    >
      {title}
    </Text>
    <AntDesign name="sharealt" size={24} color={themeColor.icon} />
  </View>
));

const InterestSection = React.memo(({ count, isFavorite, toggleFavorite, themeColor }) => (
  <TouchableOpacity onPress={toggleFavorite} className="flex-row items-center justify-between px-5 py-1 border border-gray-400 rounded-full shadow-2xl gap-x-8">
    <Text className="text-lg" style={{ color: themeColor.text }}>
      {count || 0} are Interested
    </Text>
    <Ionicons name="heart-circle" size={30} color={isFavorite ? 'red' : 'black'} />
  </TouchableOpacity>
));

const LocationSection = React.memo(({ location, themeColor }) => (
  <View className="mt-8">
    <View className="flex-row items-center py-1 gap-x-2">
      <SimpleLineIcons name="direction" size={22} color={themeColor.icon} />
      <Text className="text-lg font-semibold" style={{ color: themeColor.text }}>
        {location.address}
      </Text>
    </View>
    <MapScreen location={location} />
  </View>
));

const EventDetails = () => {
  const { eventDetailInfo } = useLocalSearchParams();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { isDarkColorScheme } = useColorScheme();
  const [favEvent, setFavEvent] = useState(false);

  // Memoize expensive operations
  const parsedEventDetail = useMemo(() => {
    try {
      return JSON.parse(eventDetailInfo);
    } catch (error) {
      console.error("Failed to parse event details:", error);
      return {};
    }
  }, [eventDetailInfo]);

  const themeColor = useMemo(() =>
    NAV_THEME[isDarkColorScheme ? "dark" : "light"],
    [isDarkColorScheme]
  );

  const toggleDescription = useCallback(() =>
    setShowFullDescription(prev => !prev),
    []
  );

  const handleBack = useCallback(() => router.back(), []);

  const toggleFavEvent = useCallback(() => {
    setFavEvent(prev => !prev);
  }, []);

  // Extract image data once
  const imageData = useMemo(() =>
    [parsedEventDetail.coverImageUrl, ...(parsedEventDetail.photos || [])].filter(Boolean),
    [parsedEventDetail.coverImageUrl, parsedEventDetail.photos]
  );

  const renderTags = useMemo(() => {
    return parsedEventDetail?.tags?.map((tag, index) => (
      <Text
        key={index}
        className="px-4 py-1 text-lg rounded-md shadow-2xl"
        style={{ color: themeColor.text, backgroundColor: themeColor.border }}
      >
        {tag}
      </Text>
    ));
  }, [parsedEventDetail.tags, themeColor]);

  // Check if description should have "show more" button
  const shouldShowMoreButton = useMemo(() =>
    parsedEventDetail.description &&
    parsedEventDetail.description.length > 120,
    [parsedEventDetail.description]
  );

  if (!parsedEventDetail || Object.keys(parsedEventDetail).length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColor.background }]}>
        <Text style={{ color: themeColor.text, textAlign: 'center', marginTop: 20 }}>
          Event information not available
        </Text>
      </SafeAreaView>
    );
  }

  const handleSwipeSuccess = useCallback(() => {
    console.log("Joined event");
    // Add your event joining logic here
  }, []);

  return (
    <SafeAreaView className="relative" style={[styles.container, { backgroundColor: themeColor.background }]}>
      <Header title={parsedEventDetail.title} themeColor={themeColor} handleBack={handleBack} />

      <ScrollView className="z-10 flex-1 w-full pt-5">
        {imageData.length > 0 && <ImageSlider images={imageData} />}

        <View className="flex-row items-center justify-between px-6 mt-4">
          <InterestSection 
            count={parsedEventDetail?.interestedUsers?.length} 
            isFavorite={favEvent}
            toggleFavorite={toggleFavEvent}
            themeColor={themeColor}
          />

          <TouchableOpacity 
            style={{ backgroundColor: themeColor.btn }} 
            className="flex-row items-center justify-between py-3 rounded-full shadow-xl px-7"
          >
            <Text style={{ color: themeColor.btnText }}>Invite</Text>
          </TouchableOpacity>
        </View>

        <View className="px-8 pb-12">
          <Text className="mt-6 text-2xl font-semibold" style={{ color: themeColor.text }}>
            {parsedEventDetail.title}
          </Text>

          {parsedEventDetail?.tags?.length > 0 && (
            <View className="flex-row flex-wrap items-center my-3 gap-x-3">
              <AntDesign name="tago" size={22} color={themeColor.icon} />
              {renderTags}
            </View>
          )}

          {parsedEventDetail?.startTime && (
            <View className="flex-row items-center">
              <Entypo name="time-slot" size={22} color={themeColor.icon} />
              <Text className="pl-3 text-md" style={{ color: themeColor.text }}>
                {formatDateTime(parsedEventDetail.startTime)}
              </Text>
            </View>
          )}
          
          {parsedEventDetail?.joinedUsers && (
            <View className="flex-row items-center mt-3">
              <AntDesign name="addusergroup" size={22} color={themeColor.icon} />
              <JoinedProfiles joinedUserIds={parsedEventDetail.joinedUsers} themeColor={themeColor} containerStyle="pl-3" />
            </View>
          )}
          
          {parsedEventDetail?.maxCapacity && (
            <View className="flex-row items-center mt-3">
              <Entypo name="ticket" size={22} color={themeColor.icon} />
              <Text className="pl-3 text-md" style={{ color: themeColor.text }}>
                {parsedEventDetail.maxCapacity} tickets left
              </Text>
            </View>
          )}

          <Text className="mt-6 text-lg font-semibold" style={{ color: themeColor.text }}>
            About this Event
          </Text>

          {parsedEventDetail.description ? (
            <>
              <Text
                className="mt-4 text-lg text-gray-500"
                numberOfLines={showFullDescription ? undefined : 3}
              >
                {parsedEventDetail.description}
              </Text>

              {shouldShowMoreButton && (
                <TouchableOpacity
                  onPress={toggleDescription}
                  className="mt-2"
                >
                  <Text style={{ color: themeColor.primary, fontWeight: '500' }}>
                    {showFullDescription ? 'Show less' : 'Show more'}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <Text className="mt-4 text-lg italic" style={{ color: themeColor.textSecondary }}>
              No description available
            </Text>
          )}

          {parsedEventDetail.location?.address && (
            <LocationSection location={parsedEventDetail.location} themeColor={themeColor} />
          )}
        </View>
      </ScrollView>
      
      <View 
        style={{ borderColor: themeColor.border }} 
        className="absolute border-[30px] rounded-full h-60 w-60 -right-16 top-1/2"
      />

      <View className="fixed z-20 w-full px-8 mt-3 bottom-6">
        <SwipeButton
          title="Swipe to Join"
          titleColor={themeColor.text}
          titleStyles={{ fontSize: 15 }}
          containerStyles={{ margin: 0 }}
          onSwipeSuccess={handleSwipeSuccess}
          railBackgroundColor={themeColor.border}
          railBorderColor={themeColor.border}
          railFillBorderColor={'#159F6A'}
          railFillBackgroundColor={'#159F6A'}
          thumbIconBackgroundColor={themeColor.background}
          thumbIconBorderColor="white"
          thumbIconComponent={() => 
            <AntDesign name="doubleright" size={24} color={themeColor.icon} />
          } 
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
});

export default React.memo(EventDetails);