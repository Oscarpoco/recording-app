import {
  StyleSheet,
  TextInput,
  View,
  ScrollView,
  Pressable,
  Text,
  Alert,
  ActivityIndicator
} from 'react-native';


// SCREEN 
import MusicPlayer from './ProgressBar';

// REACT
import React, { useEffect, useState, useCallback } from 'react';

// STORAGE
import AsyncStorage from '@react-native-async-storage/async-storage';

// ICONS
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

// EXPO 
import * as Sharing from 'expo-sharing';
import { Audio } from 'expo-av';



export default function Play({ changeView, recordings, setRecordings }) {

  // STATES
  const [sound, setSound] = useState(null);
  const [currentRecording, setCurrentRecording] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // INIT AUDIO
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });
      } catch (error) {
        console.error('Failed to setup audio mode:', error);
      }
    };
    setupAudio();
  }, []);

  // ENDS

  // CLEANUP 
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // ENDS


  // PLAY RECORDING

  const playRecording = useCallback(async (uri, key, recording) => {
    try {
      setIsLoading(true);

      // Stop current playback if exists
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
      setCurrentlyPlaying(key);
      setCurrentRecording(recording);

    } catch (error) {
      console.error('Failed to play recording:', error);
      Alert.alert('Error', 'Failed to play the recording.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onPlaybackStatusUpdate = useCallback((status) => {
    if (status.didJustFinish) {
      setCurrentlyPlaying(null);
      setCurrentRecording(null);
    }
  }, []);

  // END RECORDING


  // FAST FORWARD RECORDING

  const fastForward = useCallback(async () => {
    if (!sound) return;

    try {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        const newPosition = Math.min(
          status.positionMillis + 10000,
          status.durationMillis
        );
        await sound.setPositionAsync(newPosition);
      }
    } catch (error) {
      console.error('Fast forward failed:', error);
    }
  }, [sound]);

  // ENDS


  // REWIND
  const rewind = useCallback(async () => {
    if (!sound) return;

    try {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        const newPosition = Math.max(status.positionMillis - 10000, 0);
        await sound.setPositionAsync(newPosition);
      }
    } catch (error) {
      console.error('Rewind failed:', error);
    }
  }, [sound]);

  // ENDS


  // STOP RECORDING
  const stopPlayback = useCallback(async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        setCurrentlyPlaying(null);
        setCurrentRecording(null);
      }
    } catch (error) {
      console.error('Failed to stop playback:', error);
    }
  }, [sound]);
  // ENDS


  // SHARE
  const shareRecording = useCallback(async (uri) => {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Error', 'Sharing is not available on this device.');
      }
    } catch (error) {
      console.error('Failed to share recording:', error);
      Alert.alert('Error', 'Failed to share the recording.');
    }
  }, []);
  // ENDS


  // DELETE
  const deleteRecording = useCallback(async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      setRecordings(prev => prev.filter(recording => recording.key !== key));
      
      // Stop playback if the deleted recording was playing
      if (currentRecording?.key === key) {
        await stopPlayback();
      }
      
      Alert.alert('Success', 'Recording deleted successfully.');
    } catch (error) {
      console.error('Failed to delete recording:', error);
      Alert.alert('Error', 'Failed to delete the recording.');
    }
  }, [currentRecording, stopPlayback, setRecordings]);

  // ENDS


  // FILTER FOR SEARCH

  const filteredRecordings = recordings.filter(recording =>
    recording.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ENDS

  return (
    <View style={styles.allRecordingsParent}>

      <View style={styles.headerContent}>
        <View style={styles.searchContainer}>
          <View style={styles.searchParent}>
            <Octicons name="search" size={25} color="#fff" />
            <TextInput
              placeholder="Search your recordings"
              placeholderTextColor="#fff"
              selectionColor="#333"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <View style={styles.myRecordings}>
          <ScrollView style={styles.list}>
            {filteredRecordings.map((recording) => (
              <Pressable 
                key={recording.key}
                onPress={() =>
                  currentlyPlaying === recording.key
                    ? stopPlayback()
                    : playRecording(recording.uri, recording.key, recording)
                }
              >
                <View style={styles.recordingItem}>
                  <Text style={styles.recordingText} numberOfLines={1}>
                    {recording.title || 'Untitled'}
                  </Text>
                  <Text style={styles.recordingDuration}>
                    {new Date(recording.duration * 1000).toISOString().substr(11, 8)}
                  </Text>
                  <View style={styles.playButton}>
                    {isLoading && currentlyPlaying === recording.key ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <FontAwesome6
                        name={currentlyPlaying === recording.key ? 'stop' : 'play'} // refer from this code
                        size={25}
                        color={currentlyPlaying === recording.key ? 'red' : 'white'}
                      />
                    )}
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>

      {currentRecording ? (
        <View style={styles.playbackParent}>
          <View style={styles.playbackChild}>
            <View style={styles.playBackFunctions}>
              <View style={styles.progressTitle}>
                <Text style={styles.progressDurationTitle} numberOfLines={1}>
                  {currentRecording.title}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <MusicPlayer
                  duration={currentRecording.duration}
                  isPlaying={currentlyPlaying === currentRecording.key}
                  sound={sound}
                />
              </View>
            </View>

            <View style={styles.actionsButtons}>
              <Pressable 
                onPress={() => deleteRecording(currentRecording.key)}
                
              >
                <MaterialCommunityIcons name="delete" size={30} color="#FFF" />
              </Pressable>

              <Pressable onPress={rewind}>
                <Entypo name="ccw" size={35} color="#FFF" />
              </Pressable>

              <Pressable 
                onPress={() => 
                  currentlyPlaying === currentRecording.key
                    ? stopPlayback()
                    : playRecording(currentRecording.uri, currentRecording.key, currentRecording)
                }
                style={styles.recordButton}
              >
                <FontAwesome6 
                  name={currentlyPlaying === currentRecording.key ? 'stop' : 'play'}
                  size={60}
                  color={currentlyPlaying === currentRecording.key ? 'red' : '#fff'}
                />
              </Pressable>
            

              <Pressable onPress={fastForward} >
                <Entypo name="cw" size={35} color="#FFF" />
              </Pressable>

              <Pressable 
                onPress={() => shareRecording(currentRecording.uri)}
              
              >
                <Octicons name="share-android" size={25} color="#FFF" />
              </Pressable>
            </View>
          </View>
        </View>
      ) : (
        <Pressable 
          onPress={() => changeView('record')}
          style={styles.navSibling}
        >
          <MaterialCommunityIcons 
            name="record-circle" 
            size={45} 
            color="#FF0000" 
          />
        </Pressable>
      )}
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
    position: 'relative'
  },
  // NAV SIBLING
  navSibling: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, .7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,

  },

  playbackParent:
  {
    width: '100%',
    height: 240,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    marginTop: 5,
    position: 'absolute',
    bottom: 0,
    zIndex: 1
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
    gap: 25,
    alignItems: 'center',

  },

  progressTitle:
  {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 2,
  },

  headerContent: 
  {
    height: '90%',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 15,
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
    height: '90%',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderBottomColor: 'rgba(255, 255, 255, .3)',
    paddingHorizontal: 7,
  },

  recordingItem: 
  {
    backgroundColor: '#444',
    padding: 10,
    paddingVertical: 11,
    width: '100%',
    borderRadius: 10,
    marginBottom: 11,
    position: 'relative',
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