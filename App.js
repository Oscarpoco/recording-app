import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Animated  } from 'react-native';
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

export default function App() {

  // STATES

  const [recordings, setRecordings] = useState([]);
  const [view, setView] = useState('splash');
  const opacity = useRef(new Animated.Value(1)).current;

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
            if (key.startsWith('recording_')) { // Ensure it's a recording entry
              const recording = JSON.parse(value);
              return { ...recording, key }; // Include the key for unique identification
            }
            return null;
          })
          .filter(recording => recording !== null); // Remove any non-recording entries
  
        setRecordings(recordings);
      } catch (error) {
        console.error('Failed to load recordings', error);
        Alert.alert('Error', 'Failed to load recordings.');
      }
    };
  
    loadRecordings();
  }, []);
  
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
          />


        ) : view === 'recording' ? (
          <Recordings 
            changeView={changeView} 
          />


        ) : (
          <Play 
            changeView={changeView} 
            recordings={recordings}
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
