/**
 * FaceDetector utility - Equivalent to face_detector.cpp in the original project.
 *
 * Original C++ pipeline: OpenCV Haar cascade (detectMultiScale)
 * RN/Expo equivalent: Google ML Kit Face Detection via @infinitered/react-native-mlkit-face-detection
 *
 * This module wraps the RNMLKitFaceDetector class and provides a detect() function
 * matching the original FaceDetector::detect() interface.
 */

import {
  RNMLKitFaceDetector,
  RNMLKitFaceDetectorOptions,
} from '@infinitered/react-native-mlkit-face-detection';
import type { FaceRect } from '../types/face';

// Detection options matching the original Haar cascade parameters:
// - scaleFactor 1.1 -> ML Kit handles this internally with performanceMode
// - minNeighbors 3 -> ML Kit uses minFaceSize instead
// - minFaceSize 80x80 -> minFaceSize 0.15 (15% of image width)
const DETECTOR_OPTIONS: RNMLKitFaceDetectorOptions = {
  performanceMode: 'fast',
  landmarkMode: false,
  contourMode: false,
  classificationMode: false,
  minFaceSize: 0.15,
  isTrackingEnabled: true,
};

// Singleton detector instance
let detector: RNMLKitFaceDetector | null = null;

/**
 * Get or create the face detector instance.
 * Equivalent to FaceDetector::init() with cascade loading.
 */
function getDetector(): RNMLKitFaceDetector {
  if (!detector) {
    detector = new RNMLKitFaceDetector(DETECTOR_OPTIONS);
    console.log('[FaceDetector] ML Kit detector created');
  }
  return detector;
}

/**
 * Initialize the face detector.
 * Equivalent to FaceDetector::init(cascade_path) in the original.
 */
export async function initFaceDetector(): Promise<boolean> {
  try {
    const det = getDetector();
    await det.initialize(DETECTOR_OPTIONS);
    console.log('[FaceDetector] ML Kit initialized successfully, status:', det.status);
    return det.status === 'ready';
  } catch (error) {
    console.error('[FaceDetector] Failed to initialize ML Kit:', error);
    return false;
  }
}

/**
 * Detect faces in an image.
 * Equivalent to FaceDetector::detect(const cv::Mat& rgb_frame).
 *
 * @param imageUri - URI of the captured frame
 * @returns Array of FaceRect bounding boxes
 */
export async function detectFaces(imageUri: string): Promise<FaceRect[]> {
  try {
    const det = getDetector();
    if (det.status !== 'ready' && det.status !== 'done') {
      // Try initializing if not ready
      await det.initialize(DETECTOR_OPTIONS);
    }

    const result = await det.detectFaces(imageUri);

    if (!result || !result.faces) return [];

    return result.faces.map((face) => ({
      x: face.frame.origin.x,
      y: face.frame.origin.y,
      width: face.frame.size.x,
      height: face.frame.size.y,
    }));
  } catch (error) {
    console.error('[FaceDetector] Detection failed:', error);
    return [];
  }
}

/**
 * Check if face detector is ready.
 */
export function isDetectorReady(): boolean {
  return detector?.status === 'ready' || detector?.status === 'done';
}
