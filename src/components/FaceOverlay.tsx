/**
 * FaceOverlay - Renders face bounding boxes on top of the camera view.
 *
 * Equivalent to FaceDetector::draw_faces() in the original C++ project,
 * which draws cv::rectangle on detected faces with green color.
 *
 * This component maps detection coordinates to the camera preview dimensions
 * and renders semi-transparent bounding boxes with animated borders.
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, LayoutRectangle } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import type { FaceRect } from '../types/face';
import { useDetectionStore } from '../store/detectionStore';

interface FaceOverlayProps {
  /** Layout dimensions of the camera view container */
  viewLayout: LayoutRectangle | null;
}

/**
 * Maps a face rect from detection coordinates to view coordinates.
 * The original project renders directly to ANativeWindow buffer at frame resolution.
 * Here we scale from ML Kit's image coordinates to the view's layout coordinates.
 */
function mapFaceToView(
  face: FaceRect,
  frameWidth: number,
  frameHeight: number,
  viewWidth: number,
  viewHeight: number,
  isFrontCamera: boolean
): { left: number; top: number; width: number; height: number } {
  const scaleX = viewWidth / frameWidth;
  const scaleY = viewHeight / frameHeight;

  // Use the smaller scale to maintain aspect ratio (camera preview uses 'cover')
  const scale = Math.max(scaleX, scaleY);

  // Calculate offset for centering
  const offsetX = (viewWidth - frameWidth * scale) / 2;
  const offsetY = (viewHeight - frameHeight * scale) / 2;

  let left = face.x * scale + offsetX;
  const top = face.y * scale + offsetY;
  const width = face.width * scale;
  const height = face.height * scale;

  // Mirror for front camera
  if (isFrontCamera) {
    left = viewWidth - left - width;
  }

  return { left, top, width, height };
}

export default function FaceOverlay({ viewLayout }: FaceOverlayProps) {
  const detectionResult = useDetectionStore((s) => s.detectionResult);
  const cameraFacing = useDetectionStore((s) => s.cameraFacing);

  const boxes = useMemo(() => {
    if (!detectionResult || !viewLayout) return [];

    return detectionResult.faces.map((face, index) => ({
      ...mapFaceToView(
        face,
        detectionResult.frameWidth,
        detectionResult.frameHeight,
        viewLayout.width,
        viewLayout.height,
        cameraFacing === 'front'
      ),
      id: index,
    }));
  }, [detectionResult, viewLayout, cameraFacing]);

  if (!viewLayout) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {boxes.map((box) => (
        <Animated.View
          key={box.id}
          entering={FadeIn.duration(100)}
          exiting={FadeOut.duration(100)}
          style={[
            styles.faceBox,
            {
              left: box.left,
              top: box.top,
              width: box.width,
              height: box.height,
            },
          ]}
        >
          {/* Corner markers - similar to the green rectangles in the original */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </Animated.View>
      ))}
    </View>
  );
}

const CORNER_SIZE = 16;
const CORNER_THICKNESS = 3;
// Green color matching the original cv::Scalar(0, 255, 0) bounding boxes
const FACE_COLOR = '#00FF00';

const styles = StyleSheet.create({
  faceBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: FACE_COLOR,
    borderRadius: 4,
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
  },
  topLeft: {
    top: -CORNER_THICKNESS,
    left: -CORNER_THICKNESS,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderTopColor: FACE_COLOR,
    borderLeftColor: FACE_COLOR,
  },
  topRight: {
    top: -CORNER_THICKNESS,
    right: -CORNER_THICKNESS,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderTopColor: FACE_COLOR,
    borderRightColor: FACE_COLOR,
  },
  bottomLeft: {
    bottom: -CORNER_THICKNESS,
    left: -CORNER_THICKNESS,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderBottomColor: FACE_COLOR,
    borderLeftColor: FACE_COLOR,
  },
  bottomRight: {
    bottom: -CORNER_THICKNESS,
    right: -CORNER_THICKNESS,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderBottomColor: FACE_COLOR,
    borderRightColor: FACE_COLOR,
  },
});
