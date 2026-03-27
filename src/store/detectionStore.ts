import { create } from 'zustand';
import type { DetectionResult, PipelineState, CameraFacing } from '../types/face';

/**
 * Detection store - Central state management for the face detection pipeline.
 * Mirrors the state managed by VideoPipeline + MainActivity in the original Android project.
 */
interface DetectionStore {
  // Pipeline state
  pipelineState: PipelineState;
  setPipelineState: (state: PipelineState) => void;

  // Detection results
  detectionResult: DetectionResult | null;
  setDetectionResult: (result: DetectionResult | null) => void;

  // Face count (equivalent to VideoPipeline::face_count_)
  faceCount: number;

  // Camera settings
  cameraFacing: CameraFacing;
  toggleCameraFacing: () => void;

  // RTSP URL input (for future native module integration)
  rtspUrl: string;
  setRtspUrl: (url: string) => void;

  // Error handling
  errorMessage: string | null;
  setErrorMessage: (message: string | null) => void;

  // Pipeline controls
  startPipeline: () => void;
  stopPipeline: () => void;
  reset: () => void;
}

export const useDetectionStore = create<DetectionStore>((set) => ({
  pipelineState: 'idle',
  setPipelineState: (state) => set({ pipelineState: state }),

  detectionResult: null,
  setDetectionResult: (result) =>
    set({
      detectionResult: result,
      faceCount: result?.faces.length ?? 0,
    }),

  faceCount: 0,

  cameraFacing: 'front',
  toggleCameraFacing: () =>
    set((state) => ({
      cameraFacing: state.cameraFacing === 'front' ? 'back' : 'front',
    })),

  rtspUrl: 'rtsp://10.182.100.68:8554/stream',
  setRtspUrl: (url) => set({ rtspUrl: url }),

  errorMessage: null,
  setErrorMessage: (message) => set({ errorMessage: message }),

  startPipeline: () =>
    set({
      pipelineState: 'running',
      errorMessage: null,
    }),

  stopPipeline: () =>
    set({
      pipelineState: 'idle',
      detectionResult: null,
      faceCount: 0,
    }),

  reset: () =>
    set({
      pipelineState: 'idle',
      detectionResult: null,
      faceCount: 0,
      errorMessage: null,
    }),
}));
