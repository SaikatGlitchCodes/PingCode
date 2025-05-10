import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

const MapScreen = ({ location = { latitude: 12.9716, longitude: 77.5946 } }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const renderMap = (containerStyle, mapStyle, zoomLevel) => (
    <View style={containerStyle}>
      <MapView
        style={mapStyle}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: zoomLevel.latDelta,
          longitudeDelta: zoomLevel.longDelta,
        }}
        provider={null} 
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
        />
      </MapView>
      <TouchableOpacity 
        style={styles.expandButton} 
        onPress={toggleFullScreen}
      >
        <Ionicons 
          name={isFullScreen ? "close" : "expand"} 
          size={24} 
          color="black" 
        />
      </TouchableOpacity>
    </View>
  );

  // Different zoom levels for normal and fullscreen modes
  const normalZoom = { latDelta: 0.01, longDelta: 0.01 };
  const fullscreenZoom = { latDelta: 0.005, longDelta: 0.005 };

  return (
    <>
      {!isFullScreen && renderMap(styles.container, styles.map, normalZoom)}
      
      <Modal
        visible={isFullScreen}
        animationType="slide"
        onRequestClose={toggleFullScreen}
        transparent={false}
      >
        {renderMap(styles.fullscreenContainer, styles.fullscreenMap, fullscreenZoom)}
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  expandButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    zIndex: 10,
  },
  fullscreenContainer: {
    flex: 1,
    position: 'relative',
  },
  fullscreenMap: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default MapScreen;
