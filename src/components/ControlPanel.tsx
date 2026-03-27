/**
 * ControlPanel - Start/Stop controls and face count display.
 *
 * Equivalent to the UI controls in activity_main.xml:
 * - RTSP URL input (EditText)
 * - Start/Stop buttons
 * - Face count display (TextView)
 *
 * The RTSP URL field is preserved for future native module integration
 * (connecting to actual RTSP streams via FFmpeg).
 */

import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useDetectionStore } from '../store/detectionStore';

interface ControlPanelProps {
  onStart: () => void;
  onStop: () => void;
  isRunning: boolean;
}

export default function ControlPanel({
  onStart,
  onStop,
  isRunning,
}: ControlPanelProps) {
  const faceCount = useDetectionStore((s) => s.faceCount);
  const rtspUrl = useDetectionStore((s) => s.rtspUrl);
  const setRtspUrl = useDetectionStore((s) => s.setRtspUrl);
  const toggleCameraFacing = useDetectionStore((s) => s.toggleCameraFacing);
  const cameraFacing = useDetectionStore((s) => s.cameraFacing);

  return (
    <View style={styles.container}>
      {/* RTSP URL input - preserved for future native FFmpeg integration */}
      <View style={styles.urlContainer}>
        <Text style={styles.urlLabel}>RTSP URL (future integration)</Text>
        <TextInput
          style={styles.urlInput}
          value={rtspUrl}
          onChangeText={setRtspUrl}
          placeholder="rtsp://host:port/stream"
          placeholderTextColor="#666"
          editable={!isRunning}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />
      </View>

      {/* Face count display - equivalent to face_count TextView */}
      <View style={styles.faceCountContainer}>
        <View style={[styles.faceIndicator, faceCount > 0 && styles.faceIndicatorActive]} />
        <Text style={styles.faceCountText}>
          Faces detected: {faceCount}
        </Text>
      </View>

      {/* Control buttons - equivalent to Start/Stop buttons in original */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.startButton, isRunning && styles.buttonDisabled]}
          onPress={onStart}
          disabled={isRunning}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, isRunning && styles.buttonTextDisabled]}>
            START
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.flipButton]}
          onPress={toggleCameraFacing}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>
            {cameraFacing === 'front' ? 'REAR' : 'FRONT'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.stopButton, !isRunning && styles.buttonDisabled]}
          onPress={onStop}
          disabled={!isRunning}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, !isRunning && styles.buttonTextDisabled]}>
            STOP
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  urlContainer: {
    gap: 4,
  },
  urlLabel: {
    fontSize: 11,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  urlInput: {
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#e0e0e0',
    fontFamily: 'monospace',
    borderWidth: 1,
    borderColor: '#333',
  },
  faceCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  faceIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#444',
  },
  faceIndicatorActive: {
    backgroundColor: '#00FF00',
  },
  faceCountText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e0e0e0',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#00C853',
  },
  flipButton: {
    backgroundColor: '#2979FF',
    flex: 0.6,
  },
  stopButton: {
    backgroundColor: '#FF1744',
  },
  buttonDisabled: {
    backgroundColor: '#333',
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
  },
  buttonTextDisabled: {
    color: '#666',
  },
});
