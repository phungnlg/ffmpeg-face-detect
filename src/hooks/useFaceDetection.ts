/**
 * useFaceDetection hook - Orchestrates the face detection pipeline.
 *
 * This is the React Native equivalent of VideoPipeline in the original project.
 * Original pipeline: RtspDecoder -> FrameConverter -> FaceDetector -> Renderer
 * RN pipeline:       CameraView -> takePicture -> ML Kit detect -> overlay render
 *
 * The hook manages:
 * - Periodic frame capture from the camera
 * - Face detection on captured frames
 * - State updates to the detection store
 */

import { useRef, useCallback, useEffect } from 'react';
import type { CameraView } from 'expo-camera';
import { detectFaces, initFaceDetector } from '../utils/faceDetector';
import { useDetectionStore } from '../store/detectionStore';

const DETECTION_INTERVAL_MS = 300; // ~3 FPS detection (balances performance vs responsiveness)

export function useFaceDetection() {
  const cameraRef = useRef<CameraView>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isProcessingRef = useRef(false);

  const {
    pipelineState,
    startPipeline,
    stopPipeline,
    setDetectionResult,
    setPipelineState,
    setErrorMessage,
  } = useDetectionStore();

  /**
   * Initialize ML Kit face detector on mount.
   * Equivalent to FaceDetector::init(cascade_path) in the original.
   */
  useEffect(() => {
    initFaceDetector().then((ok) => {
      if (!ok) {
        console.warn('[Pipeline] Face detector init failed, detection may not work');
      }
    });
  }, []);

  /**
   * Process a single frame - capture + detect.
   * Equivalent to VideoPipeline::on_frame() in the original:
   *   1. FrameConverter::convert() -> takePictureAsync (camera handles YUV->RGB)
   *   2. FaceDetector::detect()    -> ML Kit detectFaces()
   *   3. draw_faces() + render     -> React Native overlay rendering
   */
  const processFrame = useCallback(async () => {
    if (isProcessingRef.current || !cameraRef.current) return;
    isProcessingRef.current = true;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.3,
        skipProcessing: true,
        shutterSound: false,
      });

      if (!photo) {
        isProcessingRef.current = false;
        return;
      }

      const faces = await detectFaces(photo.uri);

      useDetectionStore.getState().setDetectionResult({
        faces,
        frameWidth: photo.width,
        frameHeight: photo.height,
        timestamp: Date.now(),
      });
    } catch (error) {
      // Silently handle frame capture errors (camera may be transitioning)
    } finally {
      isProcessingRef.current = false;
    }
  }, []);

  /**
   * Start the detection pipeline.
   * Equivalent to VideoPipeline::start() - begins the decode/detect loop.
   */
  const start = useCallback(() => {
    if (intervalRef.current) return;

    startPipeline();

    intervalRef.current = setInterval(() => {
      if (useDetectionStore.getState().pipelineState === 'running') {
        processFrame();
      }
    }, DETECTION_INTERVAL_MS);
  }, [startPipeline, processFrame]);

  /**
   * Stop the detection pipeline.
   * Equivalent to VideoPipeline::stop() - halts the decode loop and releases resources.
   */
  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isProcessingRef.current = false;
    stopPipeline();
  }, [stopPipeline]);

  /**
   * Cleanup on unmount.
   */
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return {
    cameraRef,
    start,
    stop,
    isRunning: pipelineState === 'running',
  };
}
