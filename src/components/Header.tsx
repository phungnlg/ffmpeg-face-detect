/**
 * Header - App title bar.
 *
 * Equivalent to the ActionBar/Toolbar showing "FFmpeg Face Detect"
 * in the original Android app.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Header() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>FFmpeg Face Detect</Text>
      <Text style={styles.subtitle}>React Native / Expo + ML Kit</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e0e0e0',
  },
  subtitle: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
});
