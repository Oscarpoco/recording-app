
import { StyleSheet, Text, View, Pressable, TextInput, Alert } from 'react-native';

// REACT 
import { useState, useRef  } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// EXPO
import { Audio } from 'expo-av';

// ICONS
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Record({changeView}) {
    // STATE
    const [title, setTitle] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [time, setTime] = useState(0);
    const intervalRef = useRef(null);
    const [recording, setRecording] = useState(null); // Current recording instance
    const [recordedURI, setRecordedURI] = useState(null); // URI of the saved recording
  
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
        const uri = recording.getURI(); // Get the URI of the recording
        setRecordedURI(uri);
        setRecording(null);
        Alert.alert('Recording stopped successfully!');
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
  
    return (
      <View style={styles.recordParent}>
        {/* BACK BUTTON */}
        <Pressable style={styles.returnButton} onPress={() => changeView('play')}>
          <Ionicons name="chevron-back" size={40} color="#fff" />
        </Pressable>
  
        {/* TITLE */}
        <TextInput
          placeholder="Add title"
          placeholderTextColor="#B0B0B0"
          selectionColor="#000"
          maxLength={15}
          style={styles.title}
          value={title}
          onChangeText={setTitle}
        />
  
        {/* VISUALIZATION */}
        <View style={styles.visualization}>
          <MaterialCommunityIcons name="waveform" size={90} color="#03FF3E" />
          <MaterialCommunityIcons name="waveform" size={150} color="#B600FF" />
          <MaterialCommunityIcons name="waveform" size={90} color="#FF0000" />
        </View>
  
        {/* TIME */}
        <View>
          <Text style={styles.time}>{formatTime(time)}</Text>
        </View>
  
        {/* BOTTOM NAV */}
        <View style={styles.navParent}>
          <Pressable style={styles.navChild} onPress={cancelRecording}>
            <Entypo name="cross" size={30} color="#333" />
          </Pressable>
  
          <Pressable style={styles.navSibling} onPress={isRecording ? stopRecording : startRecording}>
            <MaterialCommunityIcons
              name={isRecording ? 'pause-circle' : 'record-circle'}
              size={50}
              color="#FF0000"
            />
          </Pressable>
  
          <Pressable style={styles.navChild} onPress={saveRecording}>
            <MaterialIcons name="done" size={30} color="#333" />
          </Pressable>
        </View>
      </View>
    );
  }

const styles = StyleSheet.create({

    // PARENT 
    recordParent: 
    {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'column',
        backgroundColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 10,
        gap: 30
    },
    // ENDS

    // NAVIGATION
    navParent:
    {
        // backgroundColor: '#333',
        width: '100%',
        paddingVertical: 7,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 30,
        elevation: 5
    },
    // ENDS

    navChild:
    {
        width: 50 , height: 50,
        borderRadius: 50,
        backgroundColor: '#079AE9',
        justifyContent: 'center',
        alignItems: 'center',
    },

    navSibling:
    {
        width: 80 , height: 80,
        borderRadius: 50,
        backgroundColor: '#079AE9',
        justifyContent: 'center',
        alignItems: 'center',
    },

    time:
    {
        fontSize: 50,
        fontWeight: 'bold',
        letterSpacing: 5,
        marginBottom: 30,
        color: '#fff'
    },

    button:
    {
        backgroundColor: '#83888E45',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 3
    },

    buttonText:
    {
        fontWeight: 'bold',
        fontSize: 20,
        letterSpacing: 2,
        color: '#fff'

    },

    visualization:
    {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1
    },

    title:
    {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
        letterSpacing: 5,
        marginBottom: 50,
        borderWidth: 2,
        borderColor: '#333',
        borderRadius: 10,
        paddingHorizontal: 80
    },
    // ENDS

    returnButton:
    {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 40,
    }

});