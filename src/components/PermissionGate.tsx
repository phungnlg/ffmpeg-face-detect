/**
 * PermissionGate - Handles camera permission requests.
 *
 * The original Android project declares camera permission in AndroidManifest.xml
 * and the system handles the permission dialog. In Expo, we need to explicitly
 * request camera permissions before accessing the camera.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCameraPermissions } from 'expo-camera';

interface PermissionGateProps {
  children: React.ReactNode;
}

export default function PermissionGate({ children }: PermissionGateProps) {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Permission status is loading
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.icon}>📷</Text>
          <Text style={styles.title}>Camera Access Required</Text>
          <Text style={styles.description}>
            This app needs camera access to perform real-time face detection.
            The original Android version uses RTSP video streams via FFmpeg -
            this Expo version uses the device camera with ML Kit instead.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={requestPermission}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Grant Camera Access</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d0d1a',
    padding: 24,
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    gap: 16,
    maxWidth: 340,
    borderWidth: 1,
    borderColor: '#333',
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e0e0e0',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#00C853',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
});
