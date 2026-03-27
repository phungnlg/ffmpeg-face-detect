/**
 * CameraFeed - Camera preview with face detection overlay.
 *
 * Equivalent to VideoSurfaceView in the original Android project.
 * The original uses a custom SurfaceView with ANativeWindow for direct C++ rendering.
 * This component uses expo-camera's CameraView for the preview and renders
 * face bounding boxes as React Native views on top.
 */

import React, { useState, useCallback } from 'react';
import { View, StyleSheet, LayoutRectangle } from 'react-native';
import { CameraView } from 'expo-camera';
import FaceOverlay from './FaceOverlay';
import { useDetectionStore } from '../store/detectionStore';

interface CameraFeedProps {
  /** Ref forwarded to the CameraView for frame capture */
  cameraRef: React.RefObject<CameraView | null>;
}

export default function CameraFeed({ cameraRef }: CameraFeedProps) {
  const cameraFacing = useDetectionStore((s) => s.cameraFacing);
  const pipelineState = useDetectionStore((s) => s.pipelineState);
  const [viewLayout, setViewLayout] = useState<LayoutRectangle | null>(null);

  const handleLayout = useCallback(
    (event: { nativeEvent: { layout: LayoutRectangle } }) => {
      setViewLayout(event.nativeEvent.layout);
    },
    []
  );

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={cameraFacing}
        active={pipelineState === 'running'}
      />

      {/* Face bounding box overlay - equivalent to FaceDetector::draw_faces() */}
      {pipelineState === 'running' && <FaceOverlay viewLayout={viewLayout} />}

      {/* Inactive state overlay */}
      {pipelineState !== 'running' && (
        <View style={styles.inactiveOverlay}>
          <View style={styles.crosshair}>
            <View style={[styles.crosshairLine, styles.crosshairH]} />
            <View style={[styles.crosshairLine, styles.crosshairV]} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#1a1a2e',
  },
  camera: {
    flex: 1,
  },
  inactiveOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crosshair: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crosshairLine: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 255, 0, 0.3)',
  },
  crosshairH: {
    width: 60,
    height: 1,
  },
  crosshairV: {
    width: 1,
    height: 60,
  },
});
