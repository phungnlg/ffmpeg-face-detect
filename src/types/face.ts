/**
 * FaceRect - Equivalent to the C++ FaceRect struct in the original project.
 * Represents a detected face bounding box.
 */
export interface FaceRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * DetectionResult - Output from the face detection pipeline.
 */
export interface DetectionResult {
  faces: FaceRect[];
  frameWidth: number;
  frameHeight: number;
  timestamp: number;
}

/**
 * PipelineState - Mirrors the original VideoPipeline states.
 */
export type PipelineState = 'idle' | 'starting' | 'running' | 'stopping' | 'error';

/**
 * CameraFacing - Front or back camera selection.
 */
export type CameraFacing = 'front' | 'back';
