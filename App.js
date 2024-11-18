import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Animated, Alert  } from 'react-native';
import { SafeAreaView } from 'react-native';

// CUSTOM SCREENS

import Record from './screens/RecordScreen';
import Recordings from './screens/recordingsScreen';
import Splash from './screens/splashScreen';
import Play from './screens/PlayingAudio';

// ENDS

// USE STATE

import { useState, useEffect, useRef } from 'react';

// ENDS

// EXPO
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

export default function App() {

  // STATES

  const [recordings, setRecordings] = useState([]);
  const [view, setView] = useState('splash');
  const [selectedAudio, setSelectedAudio] = useState(null);
  const opacity = useRef(new Animated.Value(1)).current;

  // RECORDING STATE
  const [title, setTitle] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null);
  const [recording, setRecording] = useState(null);
  const [recordedURI, setRecordedURI] = useState(null); 

  // ENDS

  // RECORDING FUNCTIONS
  // Start recording function
  const startRecording = async () => {
    if (!title) {
      Alert.alert('Please enter a title to start recording.');
      return;
    }

    try {
      // Request audio recording permissions
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert('Permission to access microphone is required!');
        return;
      }

      // Prepare recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
      setTime(0);
      intervalRef.current = setInterval(() => setTime((prev) => prev + 1), 1000);
    } catch (err) {
      console.error('Failed to start recording:', err);
      Alert.alert('Error starting recording:', err.message);
    }
  };

  // Stop recording function
  const stopRecording = async () => {
    if (!recording) return;

    clearInterval(intervalRef.current);
    setIsRecording(false);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI(); 
      setRecordedURI(uri);
      setRecording(null);
    } catch (err) {
      console.error('Error stopping recording:', err);
    }
  };

  // Cancel recording function
  const cancelRecording = () => {
    if (isRecording) stopRecording();
    setTime(0);
    setRecording(null);
    setRecordedURI(null);
  };

  // Save recording function
  const saveRecording = async () => {
    if (!recordedURI || !title) {
      Alert.alert('Please record audio and enter a title before saving.');
      return;
    }

    const recordingData = {
      title,
      uri: recordedURI,
      duration: time,
      timestamp: new Date().toISOString(),
    };

    try {
      const jsonData = JSON.stringify(recordingData);
      await AsyncStorage.setItem(`recording_${Date.now()}`, jsonData);
      Alert.alert('Recording saved successfully!');
      setTitle('');
      setTime(0);
      setRecordedURI(null);
      changeView('play')
    } catch (error) {
      console.error('Error saving recording:', error);
      Alert.alert('Failed to save recording.');
    }
  };

  // Format time
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  // ENDS

  // FETCH RECORDINGS
  useEffect(() => {
    const loadRecordings = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const recordingsData = await AsyncStorage.multiGet(keys);
  
        // Parse and filter recordings, ensuring `uri` field is included
        const recordings = recordingsData
          .map(([key, value]) => {
            if (key.startsWith('recording_')) { 
              const recording = JSON.parse(value);
              return { ...recording, key }; 
            }
            return null;
          })
          .filter(recording => recording !== null); 
  
        setRecordings(recordings);
      } catch (error) {
        console.error('Failed to load recordings', error);
        Alert.alert('Error', 'Failed to load recordings.');
      }
    };
  
    loadRecordings();
  }, [recordings]);
  
  // ENDS

  // USE EFFECT TO AUTOMATICALLY CHANGE VIEW AFTER 2 SECONDS
  useEffect(() => {
    const timer = setTimeout(() => {
      setView('play'); 
    }, 2000);

    return () => clearTimeout(timer); 
  }, []);

  // ENDS


  // FUNCTION TO MANIPULATE THE VIEW STATE 

  const changeView = (view) => {
 

    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {


      setView(view);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  // ENDS

  return (

    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.container, { opacity }]}>

        {/* RENDERING SCREENS */}

        {view === 'splash' ? (
          <Splash />


        ) : view === 'record' ? (
          <Record 
            changeView={changeView} 
            title ={title}
            setTitle={setTitle}
            saveRecording={saveRecording}
            isRecording={isRecording}
            stopRecording={stopRecording}
            startRecording={startRecording}
            cancelRecording={cancelRecording}
            time={time}
            formatTime={formatTime}

          />


        ) : view === 'recording' ? (
          <Recordings 
            changeView={changeView} 
          />


        ) : (
          <Play 
            changeView={changeView} 
            recordings={recordings}
            setRecordings={setRecordings}
          />
        )}


        {/* STATUSBAR */}
        <StatusBar style="light" />

      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: 
  {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

});
