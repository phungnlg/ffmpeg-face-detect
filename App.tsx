/**
 * FFmpeg Face Detect - React Native/Expo Edition
 *
 * This is the Expo equivalent of the native Android app that uses FFmpeg (C++ NDK)
 * to receive RTSP video streams and OpenCV Haar cascades for face detection.
 *
 * Architecture mapping:
 *   Original (Android/C++)          ->  Expo (React Native/TypeScript)
 *   ─────────────────────────────────────────────────────────────────
 *   MainActivity.kt                 ->  App.tsx
 *   VideoSurfaceView.kt             ->  CameraFeed.tsx
 *   NativeBridge.kt (JNI)           ->  useFaceDetection.ts (hook)
 *   VideoPipeline.cpp               ->  useFaceDetection.ts (orchestration)
 *   RtspDecoder.cpp (FFmpeg)        ->  expo-camera (CameraView)
 *   FrameConverter.cpp (swscale)    ->  (handled by camera internally)
 *   FaceDetector.cpp (OpenCV)       ->  faceDetector.ts (ML Kit)
 *   ANativeWindow rendering         ->  FaceOverlay.tsx (React Native views)
 *
 * Data flow:
 *   Camera Feed -> Frame Capture -> ML Kit Face Detection -> Bounding Box Overlay
 */

import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import PermissionGate from './src/components/PermissionGate';
import Header from './src/components/Header';
import CameraFeed from './src/components/CameraFeed';
import ControlPanel from './src/components/ControlPanel';
import { useFaceDetection } from './src/hooks/useFaceDetection';

function MainScreen() {
  const { cameraRef, start, stop, isRunning } = useFaceDetection();

  return (
    <View style={styles.main}>
      <Header />
      <ControlPanel onStart={start} onStop={stop} isRunning={isRunning} />
      <View style={styles.cameraContainer}>
        <CameraFeed cameraRef={cameraRef} />
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <PermissionGate>
        <MainScreen />
      </PermissionGate>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d1a',
  },
  main: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
