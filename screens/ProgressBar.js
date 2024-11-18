import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Pressable } from 'react-native';

const MusicPlayer = ({ duration, isPlaying, sound }) => {
  const [progressValue] = useState(new Animated.Value(0));
  const [currentPosition, setCurrentPosition] = useState(0);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let isMounted = true;
    let progressInterval;

    const updateProgress = async () => {
      if (sound && isPlaying) {
        try {
          const status = await sound.getStatusAsync();
          if (status.isLoaded && isMounted) {
            const position = status.positionMillis;
            const totalDuration = duration * 1000; // Convert to milliseconds
            const progress = position / totalDuration;
            
            progressValue.setValue(progress);
            setCurrentPosition(position);
          }
        } catch (error) {
          console.error('Error updating progress:', error);
        }
      }
    };

    // Start progress updates when playing
    if (isPlaying && sound) {
      progressInterval = setInterval(updateProgress, 100);
      updateProgress(); // Initial update
    }

    // Reset progress when not playing
    if (!isPlaying) {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      // Don't reset to 0 immediately to allow for pause functionality
    }

    // Cleanup
    return () => {
      isMounted = false;
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [isPlaying, sound, duration, progressValue]);

  // Reset progress when a new sound is loaded
  useEffect(() => {
    if (!isPlaying) {
      progressValue.setValue(0);
      setCurrentPosition(0);
    }
  }, [sound, isPlaying]);

  const onProgressBarPress = async (event) => {
    if (sound) {
      try {
        const { locationX } = event.nativeEvent;
        const progressBarWidth = 330; // Make sure this matches your container width
        const progress = Math.max(0, Math.min(1, locationX / progressBarWidth));
        const newPosition = progress * (duration * 1000);
        
        await sound.setPositionAsync(newPosition);
        progressValue.setValue(progress);
        setCurrentPosition(newPosition);
      } catch (error) {
        console.error('Error seeking:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Pressable 
        onPress={onProgressBarPress}
        style={styles.progressBarContainer}
      >
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </Pressable>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(currentPosition)}</Text>
        <Text style={styles.timeText}>{formatTime(duration * 1000)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  progressBarContainer: {
    width: 330,
    height: 10,
    backgroundColor: '#333',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 5,
  },
  timeContainer: {
    width: 330,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  timeText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 900,
  },
});

export default MusicPlayer;