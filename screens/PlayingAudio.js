import 
{
     StyleSheet, 
     TextInput, 
     View, 
     ScrollView, 
     Pressable, 
     Text, 
     Alert,
     Keyboard, 
     KeyboardAvoidingView 

} from 'react-native';
import React, { useEffect, useState } from 'react';

// ICONS
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

// EXPO
import { Audio } from 'expo-av';

export default function Play({ changeView, recordings }) {
  const [sound, setSound] = useState();


  // Function to play the recording
  const playRecording = async (fileUri) => {
    try {
      sound = await Audio.Sound.createAsync(
        { uri: fileUri }
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing the recording', error);
      Alert.alert('Error', 'Failed to play the recording.');
    }
  };

  return (

        <View style={styles.allRecordingsParent}>

        {/* TOP NAVIGATION */}
        <View style={styles.searchParent}>
            <Octicons name="search" size={25} color="#fff" />
            <TextInput
            placeholder="Search your recordings"
            placeholderTextColor="#fff"
            selectionColor="#333"
            style={styles.searchInput}
            />
        </View>
        {/* TOP NAVIGATION ENDS */}

        {/* ALL RECORDINGS */}
        <View style={styles.myRecordings}>
            <ScrollView style={styles.list}>
            {recordings.map((recording) => (
                <Pressable key={recording.key} >
                <View style={styles.recordingItem}>
                    <Text style={styles.recordingText}>{recording.title}</Text>
                    <Text style={styles.recordingDuration}>
                    {new Date(recording.duration * 1000).toISOString().substr(11, 8)}
                    </Text>
                    <Pressable style={styles.playButton}>
                        {/* <FontAwesome6 name="trash-alt" size={20} color="#fff" /> */}
                        <FontAwesome6 name="play" size={20} color="#fff" onPress={() => playRecording(recording.fileUri)}/>
                    </Pressable>
                </View>
                </Pressable>
            ))}
            </ScrollView>
        </View>
        {/* ENDS */}

        {/* RECORD BUTTON */}
        <Pressable onPress={() => changeView('record')}>
            <View style={styles.navSibling}>
            <MaterialCommunityIcons name="record-circle" size={50} color="#FF0000" />
            </View>
        </Pressable>
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
    justifyContent: 'space-between',
    position: 'relative',
    backgroundColor: '#000',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  // NAV SIBLING
  navSibling: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: '#079AE9',
    justifyContent: 'center',
    alignItems: 'center',
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
  searchInput: {
    fontSize: 16,
    width: '85%',
    height: 40,
    textAlignVertical: 'center',
  },

//   RECORDING LIST
  myRecordings: {
    height: '80%',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
    borderRadius: 10,
  },
  recordingItem: 
  {
    backgroundColor: '#444',
    padding: 10,
    width: '100%',
    borderRadius: 10,
    marginBottom: 10,
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
