import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native';

// CUSTOM SCREENS

import Record from './screens/RecordScreen';
import Recordings from './screens/recordingsScreen';
import Splash from './screens/splashScreen';
import Play from './screens/PlayingAudio';

// ENDS

// USE STATE

import { useState } from 'react';

// ENDS

export default function App() {

  // STATES

  const [view, setView] = useState('play');

  // ENDS


  // FUNCTION TO MANIPULATE THE VIEW STATE 

  const changeView = (view) => {
    setView(view);
    }

  // ENDS

  return (

    <SafeAreaView style={styles.container}>

        {/* RENDERING SCREENS */}

          {
            view === 'splash' ? (<Splash/>) // SPLASH SCREEN

          : view === 'record' ? (<Record/>) // RECORD SCREEN

          : view === 'recording' ? (<Recordings/>) // RECORDINGS SCREEN
          
          : (<Play/>) //PLAY SCREEN

          }

        {/* ENDS */}
        
        {/* STATUSBAR */}
          <StatusBar style="light" />
        {/* ENDS */}

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
