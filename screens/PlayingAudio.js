import {
  StyleSheet,
  TextInput,
  View,
  ScrollView,
  Text,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Image,
  TouchableOpacity
} from 'react-native';

import Toast from 'react-native-toast-message';


// SCREEN 
import MusicPlayer from './ProgressBar.js';

// REACT
import React, { useEffect, useState, useCallback } from 'react';

// STORAGE
import AsyncStorage from '@react-native-async-storage/async-storage';

// ICONS
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// EXPO 
import * as Sharing from 'expo-sharing';
import { Audio } from 'expo-av';
import { format } from 'date-fns';



export default function Play(
  { 
    changeView, 
    recordings, 
    setRecordings, 
    onRefresh, 
    refreshing, 
    isEditting, 
    setIsEditting, 
    settings, 
    setSettings,
    userInformation 
  }) 
  {

  // STATES
  const [sound, setSound] = useState(null);
  const [currentRecording, setCurrentRecording] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      console.log(`Playing: ${uri}`); 
  
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
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to play the recording.',
        position: 'bottom',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);
  

  const onPlaybackStatusUpdate = useCallback((status) => {
    console.log('Playback status update:', status);
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
        await sound.unloadAsync(); // Ensure sound is unloaded
        setSound(null);
      }
      setCurrentlyPlaying(null);
      setCurrentRecording(null);
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
        
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Sharing is not available on this device.',
          position: 'bottom',
        });

      }
    } catch (error) {
      console.error('Failed to share recording:', error);
    
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to share the recording.',
        position: 'bottom',
      });
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
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Recording deleted successfully.',
        position: 'bottom',
      });

    } catch (error) {
      console.error('Failed to delete recording:', error);
  
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete the recording.',
        position: 'bottom',
      });
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
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Recording deleted successfully.',
      position: 'bottom',
    });
  };

  return (
    <View style={styles.allRecordingsParent}>

      <View style={styles.headerContent}>
        <View style={styles.searchContainer}>

          <View style={styles.AccountHeader}>
              <Text style={styles.AccountText}>Welcome {userInformation?.displayName || 'Guest'} 👋</Text>
              <TouchableOpacity onPress={()=> changeView('profile')} style={styles.menu}>
                  <Entypo name="menu" size={25} color="rgba(255, 255, 255, .5)" />
              </TouchableOpacity>
          </View>

          <View style={styles.searchParent}>
            <Octicons name="search" size={20} color="rgba(255, 255, 255, .5)" />
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
          <ScrollView style={styles.list}
          
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }

          >
            {filteredRecordings.map((recording) => (
              <TouchableOpacity 
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
                     <View style = {styles.editButton} >
                        <TouchableOpacity onPress={()=> setIsEditting(true)}>
                          <MaterialIcons name="edit-note" size={40} color="rgba(255, 255, 255, .5)" />
                        </TouchableOpacity>
                     </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
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
              <TouchableOpacity 
                onPress={() => deleteRecording(currentRecording.key)}
                
              >
                <MaterialCommunityIcons name="delete" size={25} color="#FFF" />
              </TouchableOpacity>

              <TouchableOpacity onPress={rewind}>
                <Entypo name="ccw" size={30} color="#FFF" />
              </TouchableOpacity>

              <TouchableOpacity 
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
              </TouchableOpacity>
            

              <TouchableOpacity onPress={fastForward} >
                <Entypo name="cw" size={30} color="#FFF" />
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => shareRecording(currentRecording.uri)}
              
              >
                <Octicons name="share-android" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (

        <View style={styles.recordButtonParent}>
          
          <TouchableOpacity 
            onPress={() => changeView('record')}
            style={styles.navSibling}
          >
            <MaterialCommunityIcons 
              name="record-circle" 
              size={45} 
              color="#FF0000" 
            />
          </TouchableOpacity>
        </View>
      )}

      {/* SETTINGS */}

    {settings && 
    
      (
        <View style={styles.settingsParent}>
            <View style={styles.returnButtonIcon}>
              <TouchableOpacity 
              onPress={() =>{
                setSettings(false);
                changeView('profile');
              }
              }>
                <MaterialCommunityIcons name="keyboard-backspace" size={40} color="#fff" />
              </TouchableOpacity>
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
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              

                <View style={styles.reachUsParent}>

                    <View style={styles.reachUsChild}>
                      <TouchableOpacity style={styles.circleIcon}>
                        <Entypo 
                          name="email" 
                          size={25} 
                          color="rgba(255, 255, 255, .7)" 
                        />
                      </TouchableOpacity>

                      <Text style={styles.reachUsText}>m@support.co.za</Text>

                    </View>

                    <View style={styles.reachUsChild}>

                      <TouchableOpacity style={styles.circleIcon}>
                        <MaterialIcons 
                          name="phone-android" 
                          size={25} 
                          color="rgba(255, 255, 255, .7)" 
                        />
                      </TouchableOpacity>

                      <Text style={styles.reachUsText}>+27 660 850 741</Text>
                      
                    </View>

                    <View style={styles.reachUsChild}>
                      <TouchableOpacity style={styles.circleIcon}>
                        <MaterialIcons 
                          name="phone-android" 
                          size={25} 
                          color="rgba(255, 255, 255, .7)" 
                        />
                      </TouchableOpacity>
                      
                      <Text style={styles.reachUsText}>+27 810 449 718</Text>
                      
                    </View>
                </View>

                <Text style={styles.versionText}>version 1.0.0</Text>

              </View>

            </View>
        </View>
      )

    }

        {/* EDDITING */}
        {isEditting &&(
          <View style={styles.editingParent} >

            <TouchableOpacity
              style={styles.editingOverlay}
              onPress={() => setIsEditting(false)} 
            />

            <View style={styles.editingChild}>
              <Text style={styles.editTitleText}>Edit  title</Text>
              <View style={styles.editInputWrapper}>
                <TextInput
                placeholder='Type a new title'
                ></TextInput>
                <TouchableOpacity>
                  <Text style={styles.editButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          
          </View>
        )}
        {/* ENDS */}

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
    justifyContent: 'flex-start',
    position: 'relative',
    backgroundColor: '#000',
    paddingVertical: 20,
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
    zIndex: 100
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
    backgroundColor: '#444',
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
    gap: 10,
  },

  // SEARCH
  searchParent: {
    width: '100%',
    backgroundColor: '#333',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 0,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 10,
    opacity: .5
  },
  searchInput: 
  {
    fontSize: 15,
    width: '85%',
    height: 40,
    textAlignVertical: 'center',
    color: 'rgba(255, 255, 255, .5)'
  },

  AccountHeader:
  {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingTop: 25,
  },

  menu:
  {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, .1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  AccountText:
  {
    color: 'rgba(255, 255, 255, .7)',
    fontSize: 18,
    fontWeight: 900,

  },

//   RECORDING LIST
  myRecordings: 
  {
    height: '80%',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderWidth: .5,
    borderBottomColor: 'rgba(255, 255, 255, .1)',
    paddingHorizontal: 7,
    marginTop: 15,

  },

  recordingItem: 
  {
    backgroundColor: '#333',
    padding: 10,
    paddingVertical: 11,
    width: '100%',
    borderRadius: 15,
    marginBottom: 10.5,
    position: 'relative',
  },
  recordingText: 
  {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },

  recordingDuration: 
  {
    color: '#ccc',
    fontSize: 13,
  },

  editButton:
  {
    position: 'absolute',
    right: -5,
    top: -43,
    backgroundColor: '#444',
    padding: 4,
    zIndex: 11,
    borderRadius: 11,
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

  editingParent:
  {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, .7)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'absolute',
    flex: 1,
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 50,
    paddingHorizontal: 10,
  },

  editingChild:
  {
    width: '100%',
    height: 'auto',
    backgroundColor: 'rgba(255, 255, 255, .9)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    gap: 20
  },

  editInputWrapper:
  {
    width: '100%',
    height: 'auto',
    backgroundColor: 'rgba(255, 255, 255, .9)',
    justifyContent: 'space-between',
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    zIndex: 20
  },

  editButtonText:
  {
    color: '#000',
    fontSize: 18,
    fontWeight: 900
  },

  editTitleText:
  {
    color: '#000',
    fontSize: 24,
    fontWeight: 900
  },

  editingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

});