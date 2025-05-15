import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Platform, TouchableOpacity, Linking } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';

const QrScanner = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [torchOn, setTorchOn] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScannedData(data);
    console.log(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  const handleRescan = () => {
    setScanned(false);
    setScannedData(null);
  };

  const toggleTorch = () => {
    setTorchOn(!torchOn);
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => Linking.openSettings()}
        >
          <Text style={styles.buttonText}>Enable in Settings</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Scan QR Code</Text>
      </View>

      <View style={styles.cameraContainer}>
        <BarCodeScanner
          style={styles.camera}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          type={BarCodeScanner.Constants.Type.back}
        >
          <View style={styles.overlay}>
            <View style={styles.scanArea} />
          </View>
          
          <TouchableOpacity style={styles.torchButton} onPress={toggleTorch}>
            <Ionicons name={torchOn ? "flash" : "flash-off"} size={24} color="white" />
          </TouchableOpacity>
        </BarCodeScanner>
      </View>
      
      {scanned && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Scanned QR Code:</Text>
          <Text style={styles.resultData}>{scannedData}</Text>
          <TouchableOpacity style={styles.button} onPress={handleRescan}>
            <Text style={styles.buttonText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {!scanned && (
        <Text style={styles.instructionText}>
          Position QR code within the frame to scan
        </Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
    margin: 16,
    borderRadius: 16,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  torchButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 30,
  },
  resultContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultData: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#444',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  instructionText: {
    textAlign: 'center',
    margin: 16,
    color: '#666',
  },
  text: {
    textAlign: 'center',
    margin: 30,
  },
});

export default QrScanner;
