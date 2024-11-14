import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const MusicPlayer = () => {
  const [progress] = useState(new Animated.Value(0));

  // Simulate progress updating (e.g., from a music player or recorder)
  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 100000, // Adjust for desired progress duration (e.g., 10 seconds)
      useNativeDriver: false, // Required for width animation
    }).start();
  }, [progress]);

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[styles.progressBar, { width: progress.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          }) }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  progressBarContainer: {
    width: 330,
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
});

export default MusicPlayer;
