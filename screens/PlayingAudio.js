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
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// EXPO 
import * as Sharing from 'expo-sharing';
import { Audio } from 'expo-av';
import { format } from 'date-fns';



export default function Play({ changeView, recordings, setRecordings }) {

  // STATES
  const [sound, setSound] = useState(null);
  const [currentRecording, setCurrentRecording] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState(false);

  // FORM
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [input3, setInput3] = useState('');
 

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
          status.positionMillis + 2000,
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
        const newPosition = Math.max(status.positionMillis - 2000, 0);
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

  // FORM SUBMISSION
  const handleSubmit = () => {
    Alert.alert('Form Submitted', `Input 1: ${input1}, Input 2: ${input2}, Input 3: ${input3}`);
  };

  return (
    <View style={styles.allRecordingsParent}>

      <View style={styles.headerContent}>
        <View style={styles.searchContainer}>
          <View style={styles.searchParent}>
            <Octicons name="search" size={25} color="rgba(255, 255, 255, .5)" />
            <TextInput
              placeholder="Search your recordings"
              placeholderTextColor="rgba(255, 255, 255, .5)"
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
                    {recording.title || 'Untitled'} - {format(new Date(recording.timestamp), 'PPPpp')}
                  </Text>
                  <Text style={styles.recordingDuration}>
                    {new Date(recording.duration * 1000).toISOString().substr(11, 8)}
                  </Text>
                  <View style={styles.playButton}>
                    {isLoading && currentlyPlaying === recording.key ? (
                      <ActivityIndicator color="white" />
                    ) : (
                     <View></View>
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
                <MaterialCommunityIcons name="delete" size={25} color="#FFF" />
              </Pressable>

              <Pressable onPress={rewind}>
                <Entypo name="ccw" size={30} color="#FFF" />
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
                  size={50}
                  color={currentlyPlaying === currentRecording.key ? 'red' : '#fff'}
                />
              </Pressable>
            

              <Pressable onPress={fastForward} >
                <Entypo name="cw" size={30} color="#FFF" />
              </Pressable>

              <Pressable 
                onPress={() => shareRecording(currentRecording.uri)}
              
              >
                <Octicons name="share-android" size={20} color="#FFF" />
              </Pressable>
            </View>
          </View>
        </View>
      ) : (

        <View style={styles.recordButtonParent}>
          <Pressable 
            onPress={() => setSettings(true)}
            style={styles.navSettings}
          >
            <MaterialIcons 
              name="settings" 
              size={40} 
              color="#FFF" 
            />
          </Pressable>
          
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
        </View>
      )}

      {/* SETTINGS */}

    {settings && 
    
      (
        <View style={styles.settingsParent}>
            <View style={styles.returnButtonIcon}>
              <Pressable onPress={() =>setSettings(false)}>
                <MaterialCommunityIcons name="keyboard-backspace" size={40} color="#fff" />
              </Pressable>
            </View>

            <View style={styles.settingsChild}>

              <View>
                <Text style={styles.settingsHeader}>Feedback</Text>
              </View>

              {/* FORM */}
              <View style={styles.formContainer}>
                {/* Input 1 */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your Name"
                    value={input1}
                    onChangeText={setInput1}
                  />
                </View>

                {/* Input 2 */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your Email"
                    value={input2}
                    onChangeText={setInput2}
                  />
                </View>

                {/* Input 3 */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Message</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter your Message"
                    value={input3}
                    onChangeText={setInput3}
                    multiline={true}
                    numberOfLines={4}
                  />
                </View>

                {/* Submit Button */}
                <Pressable style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Submit</Text>
                </Pressable>
              

                <View style={styles.reachUsParent}>

                    <View style={styles.reachUsChild}>
                      <Pressable style={styles.circleIcon}>
                        <Entypo 
                          name="email" 
                          size={25} 
                          color="rgba(255, 255, 255, .7)" 
                        />
                      </Pressable>

                      <Text style={styles.reachUsText}>m@support.co.za</Text>

                    </View>

                    <View style={styles.reachUsChild}>

                      <Pressable style={styles.circleIcon}>
                        <MaterialIcons 
                          name="phone-android" 
                          size={25} 
                          color="rgba(255, 255, 255, .7)" 
                        />
                      </Pressable>

                      <Text style={styles.reachUsText}>+27 660 850 741</Text>
                      
                    </View>

                    <View style={styles.reachUsChild}>
                      <Pressable style={styles.circleIcon}>
                        <MaterialIcons 
                          name="phone-android" 
                          size={25} 
                          color="rgba(255, 255, 255, .7)" 
                        />
                      </Pressable>
                      
                      <Text style={styles.reachUsText}>+27 810 449 718</Text>
                      
                    </View>
                </View>

                <Text style={styles.versionText}>version 1.0.0</Text>

              </View>

            </View>
        </View>
      )

    }
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

  recordButtonParent:
  {
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },

  settingsParent:
  {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1
  },

  settingsChild:
  {
    width: '100%',
    height: '90%',
    backgroundColor: 'rgba(255, 255, 255, .8)',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 20,
  },

  settingsHeader:
  {
    fontSize: 24,
    fontWeight: 900,
    letterSpacing: 2
  },

  navSettings:
  {
    position: 'absolute',
    left: 30,
    bottom: 10,
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
    height: 160,
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
    borderWidth: 1.5,
    borderBottomColor: 'rgba(255, 255, 255, .2)',
    paddingHorizontal: 7,
  },

  recordingItem: 
  {
    backgroundColor: '#444',
    padding: 10,
    paddingVertical: 11,
    width: '100%',
    borderRadius: 10,
    marginBottom: 9,
    position: 'relative',
  },
  recordingText: 
  {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  recordingDuration: 
  {
    color: '#ccc',
    fontSize: 13,
  },

  playButton:
  {
    position: 'absolute',
    right: 20,
    top: 20,
  },

  // FORM
  formContainer: {
    paddingVertical: 40,
    paddingHorizontal: 15,
    borderRadius: 10,
    height: '100%',
    width: '100%',
  },

  inputGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, .3)',
    padding: 10,
    fontSize: 16,
    color: 'rgba(0, 0, 0, .1',
  },

  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  textArea: {
    height: 100, 
    textAlignVertical: 'top',
    borderWidth: 1,
    borderRadius: 10,
  },

  reachUsParent:
  {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
    marginTop: 20
  },

  circleIcon:
  {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .1)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  reachUsChild: 
  {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '33.33%',
    paddingVertical: 10,
  },

  reachUsText:
  {
    fontWeight: 900,
    marginTop: 10,
    color: 'rgba(0, 0, 0, .5)',
    fontSize: 12
  },

  versionText:
  {
    fontWeight: 900,
    color: 'rgba(0, 0, 0, .5)',
    textAlign: 'center',

  },

  returnButtonIcon:
  {
    fontWeight: 900,
    color: 'rgba(0, 0, 0, .5)',
    marginTop: 20,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    width: '100%'
  },

});