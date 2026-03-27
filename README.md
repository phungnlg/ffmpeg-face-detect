# FFmpeg Face Detect - React Native/Expo Edition

A React Native/Expo adaptation of the native Android face detection app. The original uses **FFmpeg (C++ NDK)** to decode RTSP video streams and **OpenCV Haar cascades** for face detection. This version uses the **device camera** with **Google ML Kit** face detection instead, providing equivalent real-time face detection functionality in a cross-platform React Native app.

## Screenshot

<p align="center">
  <img src="screenshots/screenshot-1774508101254.png" width="300" alt="FFmpeg Face Detect - real-time face detection"/>
</p>

## Architecture Comparison

```
Original (Android/C++)                  Expo (React Native/TypeScript)
──────────────────────                  ──────────────────────────────
MainActivity.kt                   ->   App.tsx
VideoSurfaceView.kt                ->   CameraFeed.tsx
NativeBridge.kt (JNI)             ->   useFaceDetection.ts (hook)
VideoPipeline.cpp                  ->   useFaceDetection.ts (orchestration)
RtspDecoder.cpp (FFmpeg)           ->   expo-camera (CameraView)
FrameConverter.cpp (swscale)       ->   (handled by camera internally)
FaceDetector.cpp (OpenCV Haar)     ->   faceDetector.ts (ML Kit)
ANativeWindow rendering            ->   FaceOverlay.tsx (React Native views)
```

## Data Flow

```
Original:
  RTSP Stream -> FFmpeg Decode -> YUV->RGB Convert -> OpenCV Detect -> ANativeWindow Render

Expo:
  Device Camera -> Frame Capture -> ML Kit Detect -> React Native Overlay Render
```

## What This Demonstrates

- **Expo Camera Integration**: Real-time camera preview using `expo-camera` CameraView
- **ML Kit Face Detection**: Google ML Kit face detection via `@infinitered/react-native-mlkit-face-detection`
- **Bounding Box Overlay**: Animated face bounding boxes rendered as React Native views with Reanimated
- **Clean Architecture**: Pipeline pattern matching the original (capture -> detect -> render)
- **State Management**: Zustand store mirroring the original VideoPipeline state
- **RTSP URL Field**: Preserved for future native module integration with FFmpeg

## Project Structure

```
src/
├── components/
│   ├── CameraFeed.tsx        # Camera preview (equivalent to VideoSurfaceView)
│   ├── ControlPanel.tsx      # Start/Stop UI (equivalent to activity_main.xml controls)
│   ├── FaceOverlay.tsx       # Bounding box renderer (equivalent to draw_faces())
│   ├── Header.tsx            # App title bar
│   └── PermissionGate.tsx    # Camera permission handler
├── hooks/
│   └── useFaceDetection.ts   # Detection pipeline (equivalent to VideoPipeline)
├── store/
│   └── detectionStore.ts     # Zustand state (equivalent to pipeline state + face_count_)
├── types/
│   └── face.ts               # TypeScript types (equivalent to FaceRect struct)
└── utils/
    └── faceDetector.ts       # ML Kit wrapper (equivalent to face_detector.cpp)
```

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS: Xcode 15+ (for dev build)
- Android: Android Studio + NDK (for dev build)

### Install

```bash
npm install
```

### Run (Development Build)

This app uses native modules (ML Kit) and requires a development build:

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

> **Note**: This app cannot run in Expo Go because it uses `@infinitered/react-native-mlkit-face-detection`, which requires native code. Use `npx expo run:ios` or `npx expo run:android` to create a development build.

## Key Differences from Original

| Aspect | Original (Android/C++) | Expo (React Native) |
|--------|----------------------|---------------------|
| Video Source | RTSP stream via FFmpeg | Device camera via expo-camera |
| Face Detection | OpenCV Haar cascade | Google ML Kit |
| Rendering | ANativeWindow (C++) | React Native Views + Reanimated |
| Platform | Android only | iOS + Android |
| Build System | Gradle + CMake + NDK | Expo + Metro |
| Language | Kotlin + C++ | TypeScript |
| State | std::atomic + std::mutex | Zustand store |

## Dependencies

| Library | Purpose |
|---------|---------|
| expo-camera | Camera preview and frame capture |
| @infinitered/react-native-mlkit-face-detection | Google ML Kit face detection |
| react-native-reanimated | Animated bounding box overlays |
| zustand | State management for detection pipeline |
| expo-status-bar | Status bar configuration |

## Original Project

The original native Android version uses:
- **FFmpeg** for RTSP stream decoding (libavformat, libavcodec, libswscale)
- **OpenCV** for Haar cascade face detection
- **Android NDK** with JNI bridge between Kotlin UI and C++ pipeline
- Architecture: `RtspDecoder -> FrameConverter -> FaceDetector -> Renderer`
