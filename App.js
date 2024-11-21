import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Animated, Alert, View,SafeAreaView } from 'react-native';
import Toast from 'react-native-toast-message';

// CUSTOM SCREENS

import Record from './screens/RecordScreen.js';
import Splash from './screens/splashScreen.js';
import Play from './screens/PlayingAudio.js';
import Account from './screens/Account.js';
import SignIn from './screens/SignIn.js';
import SignUp from './screens/SignUp.js';
import ErrorPage from './screens/Error.js';

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
  const opacity = useRef(new Animated.Value(1)).current;

  // RECORDING STATE
  const [title, setTitle] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null);
  const [recording, setRecording] = useState(null);
  const [recordedURI, setRecordedURI] = useState(null); 
  const [refreshing, setRefreshing] = useState(false);
  const [isEditting, setIsEditting] = useState(false);
  const [isProfile, setIsProfile] = useState(false);


  // ENDS


  // RECORDING FUNCTIONS
 
  const startRecording = async () => {
    if (!title) {
      Toast.show({
        type: 'error',
        text1: 'Warning',
        text2: 'Please enter a title to start recording.',
        position: 'bottom',
      });
      return;
    }
  
    try {
      // Stop ongoing recording
      if (recording) {
        await stopRecording();
      }
  
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert('Permission to access microphone is required!');
        return;
      }
  
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
  
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
  
      setRecording(newRecording);
      setIsRecording(true);
      setTime(0);
  
      intervalRef.current = setInterval(() => setTime((prev) => prev + 1), 1000);
    } catch (err) {
      console.error('Failed to start recording:', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Error starting recording: ${err.message}`,
        position: 'bottom',
      });
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
    try {
     
      await stopRecording();
      
      
      if (!recordedURI) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Recording was not completed successfully.',
          position: 'bottom',
        });
        return;
      }
  
      const recordingData = {
        title,
        uri: recordedURI, 
        duration: time,
        timestamp: new Date().toISOString(),
      };
  
      // Save the recording to AsyncStorage
      const key = `recording_${Date.now()}`;
      await AsyncStorage.setItem(key, JSON.stringify(recordingData));
  
      // Provide feedback to the user
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Recording saved successfully!',
        position: 'bottom',
      });
  
      // Reset state
      setRecordings((prev) => [...prev, { ...recordingData, key }]);
      setTitle('');
      setTime(0);
      setRecordedURI(null);
      changeView('play');
    } catch (error) {
      console.error('Error saving recording:', error);
  
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save recording.',
        position: 'bottom',
      });
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
      if (!uri) throw new Error('Recording URI is null');
  
      setRecordedURI(uri); 

    } catch (err) {
      console.error('Error stopping recording:', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Error stopping recording: ${err.message}`,
        position: 'bottom',
      });
      setRecordedURI(null); 
    } finally {
      setRecording(null);
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
       
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to load recordings.',
          position: 'bottom',
        });
      }
    };
  
    loadRecordings();
  }, [recordings]);

  // REFRESH
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Logic to reload recordings (e.g., fetching from AsyncStorage or API)
      const keys = await AsyncStorage.getAllKeys();
      const storedRecordings = await AsyncStorage.multiGet(keys);
      const updatedRecordings = storedRecordings.map(([key, value]) => ({
        key,
        ...JSON.parse(value),
      }));

      setRecordings(updatedRecordings);
      Toast.show({
        type: 'success',
        text1: 'Refreshed',
        text2: 'Recordings list updated.',
        position: 'bottom',
      });
    } catch (error) {
      console.error('Failed to refresh recordings:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to refresh recordings.',
        position: 'bottom',
      });
    } finally {
      setRefreshing(false);
    }
  };
  
  // ENDS

    
    const saved = recordings;
    // console.log('My recordings:', saved);


  // USE EFFECT TO AUTOMATICALLY CHANGE VIEW AFTER 2 SECONDS
  useEffect(() => {
    const timer = setTimeout(() => {
      setView('sign'); 
    }, 3000);

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

        {
        
        view === 'splash' ? (
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

        ) : view === 'play' ? (
          <Play 
            changeView={changeView} 
            recordings={recordings}
            setRecordings={setRecordings}
            refreshing = {refreshing}
            onRefresh={onRefresh}
            isEditting={isEditting}
            setIsEditting={setIsEditting}
            setIsProfile={setIsProfile}
          />
        ) : view === 'profile' ? (
          <Account

          changeView={changeView}

          />

        ) : view === 'sign' ? (
          <SignIn
          
          changeView={changeView}

          />
        ) : view === 'signUp' ? (
            <SignUp
            
            changeView={changeView}
            
            />
        ) : (
          <ErrorPage/>
        )
      
      
      }

        {/* TOAST */}
        <View style={styles.toast}>
          <Toast />
        </View>


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
    position: 'relative'
  },

  toast: 
  {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 50
  },

});
