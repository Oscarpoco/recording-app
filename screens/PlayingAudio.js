import 
{
     StyleSheet, 
     TextInput, 
     View, 
     ScrollView, 
     Pressable, 
     Text, 
     Alert,

} from 'react-native';

import MusicPlayer from './ProgressBar';

import React, { useEffect, useState } from 'react';

// STORAGE
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ICONS
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

// EXPO
import { Audio } from 'expo-av';

export default function Play({ changeView, recordings }) {
  const [sound, setSound] = useState();
  const [currentRecording, setCurrentRecording] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);


   // Play a recording
   const playRecording = async (uri, key) => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setCurrentlyPlaying(null);
      }
  
      const { sound: newSound } = await Audio.Sound.createAsync({ uri });
      setSound(newSound);
      setCurrentlyPlaying(key);
  
      const status = await newSound.getStatusAsync();
      if (status.isLoaded && status.durationMillis) {
        await newSound.playAsync();
  
        // Use the duration from the sound status
        setTimeout(() => {
          setCurrentlyPlaying(null);
        }, status.durationMillis);
      } else {
        throw new Error('Sound is not loaded or duration is unavailable');
      }
    } catch (error) {
      console.error('Failed to play recording', error);
      Alert.alert('Error', 'Failed to play the recording.');
    }
  };
  

  // Stop the playback
  const stopPlayback = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        setCurrentlyPlaying(null);
      }
    } catch (error) {
      console.error('Failed to stop playback', error);
    }
  };

  // Share recording
  const shareRecording = async (uri) => {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Error', 'Sharing is not available on this device.');
      }
    } catch (error) {
      console.error('Failed to share recording', error);
      Alert.alert('Error', 'Failed to share the recording.');
    }
  };

  // Delete recording
  const deleteRecording = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      const updatedRecordings = recordings.filter((recording) => recording.key !== key);
      setRecordings(updatedRecordings);
      Alert.alert('Success', 'Recording deleted successfully.');
    } catch (error) {
      console.error('Failed to delete recording', error);
      Alert.alert('Error', 'Failed to delete the recording.');
    }
  };

  // Unload sound when component unmounts
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.allRecordingsParent}>
      {/* TOP NAVIGATION */}

      <View padding= '4'>
        <View style={styles.searchParent}>
          <Octicons name="search" size={25} color="#fff" />
          <TextInput
            placeholder="Search your recordings"
            placeholderTextColor="#fff"
            selectionColor="#333"
            style={styles.searchInput}
          />
        </View>
      </View>
      {/* TOP NAVIGATION ENDS */}

      {/* ALL RECORDINGS */}
      <View style={styles.myRecordings}>
        <ScrollView style={styles.list}>
          {recordings.map((recording) => (
            <Pressable key={recording.key}>
              <View style={styles.recordingItem}>
                <Text style={styles.recordingText}>{recording.title || 'Untitled'}</Text>
                <Text style={styles.recordingDuration}>
                  {new Date(recording.duration * 1000).toISOString().substr(11, 8)}
                </Text>
                <Pressable
                  style={styles.playButton}
                  onPress={() =>
                    currentlyPlaying === recording.key
                      ? stopPlayback()
                      : playRecording(recording.uri, recording.key)
                  }
                >
                  <FontAwesome6
                    name={currentlyPlaying === recording.key ? 'stop' : 'play'}
                    size={25}
                    color={currentlyPlaying === recording.key ? 'red' : 'white'}
                  />
                </Pressable>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      {/* ALL RECORDINGS ENDS */}

      {/* NAVIGATION */}
      {currentRecording === null ? (
        <View style = {styles.playbackParent}>
          <View style = {styles.playbackChild}>
            {/* PROGRESS BAR, PLAYBACK FUNCTIONS */}
            <View style={styles.playBackFunctions}>
              <View style={styles.progressTitle}>
                <Text style={styles.progressDurationTitle}>Benny Mayengani</Text>
              </View>
              <View style={styles.progressBar}>
                <MusicPlayer/>
              </View>
              <View style={styles.progressDuration}>
                <Text style={styles.progressDurationText}>00:00</Text>
                <Text style={styles.progressDurationText}>05:45</Text>
              </View>
            </View>
            {/* ENDS */}

            {/* SHARE , DELETE */}
            <View style={styles.actionsButtons}>
              <Pressable onPress={() => changeView('record')}>
                  <MaterialCommunityIcons name="delete" size={30} color="#FFF" />
              </Pressable>
              <Pressable onPress={() => changeView('record')}>
                  <Entypo name="ccw" size={35} color="#FFF" />
              </Pressable>
              <Pressable onPress={() => changeView('record')}>
                  <MaterialCommunityIcons name="record-circle" size={60} color="#FF0000" />
              </Pressable>
              <Pressable onPress={() => changeView('record')}>
                  <Entypo name="cw" size={35} color="#FFF" />
              </Pressable>
              <Pressable onPress={() => changeView('record')}>
                  <Octicons name="share-android" size={25} color="#FFF" />
              </Pressable>
            </View>
            {/* ENDS */}
          </View>
        </View>
      ) : (
        // RECORD BUTTON
        <Pressable onPress={() => changeView('record')}>
          <View style={styles.navSibling}>
            <MaterialCommunityIcons name="record-circle" size={45} color="#FF0000" />
          </View>
        </Pressable>
      )}
      {/* RECORD BUTTON ENDS */}

    </View>

  );
}

// STYLING
const styles = StyleSheet.create({
  // PARENT CONTAINER
  allRecordingsParent: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    backgroundColor: '#000',
    paddingVertical: 20,
  },
  // NAV SIBLING
  navSibling: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, .7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  playbackParent:
  {
    width: '100%',
    height: '22%',
    marginTop: 5,
  },

  playbackChild:
  {
    backgroundColor: 'rgba(255, 255, 255, .3)',
    width: '100%',
    height: '100%',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },

  progressDuration:
  {
    width: 330,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  progressDurationText:
  {
    fontWeight: 900,
    color: '#fff',
  },

  progressDurationTitle:
  {
    fontWeight: 900,
    color: '#fff',
    fontSize: 18,
    letterSpacing: 1
  },

  actionsButtons:
  {
    flexDirection: 'row',
    marginBottom: 40,
    gap: 15,
    alignItems: 'center',

  },

  progressTitle:
  {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 2,
  },

  // SEARCH
  searchParent: {
    width: '100%',
    backgroundColor: '#333',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 10,
  },
  searchInput: 
  {
    fontSize: 16,
    width: '85%',
    height: 40,
    textAlignVertical: 'center',
  },

//   RECORDING LIST
  myRecordings: 
  {
    height: '70%',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderBottomColor: 'rgba(255, 255, 255, .3)',
    paddingHorizontal: 10,
  },
  recordingItem: 
  {
    backgroundColor: '#444',
    padding: 10,
    paddingVertical: 11,
    width: '100%',
    borderRadius: 10,
    marginBottom: 11,
    position: 'relative'
  },
  recordingText: 
  {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  recordingDuration: 
  {
    color: '#ccc',
    fontSize: 14,
  },

  playButton:
  {
    position: 'absolute',
    right: 20,
    top: 20,
  }

});