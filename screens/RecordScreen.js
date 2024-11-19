
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';

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

export default function Record({changeView, title, setTitle, saveRecording, isRecording, stopRecording, startRecording, cancelRecording, formatTime, time}) {
  
    return (
      <View style={styles.recordParent}>

        <View style ={styles.returnButtonParent}>
          {/* BACK BUTTON */}
          <Pressable style={styles.returnButton} onPress={() => changeView('play')}>
            <MaterialCommunityIcons name="keyboard-backspace" size={40} color="#fff" />
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
        </View>
  
        {/* VISUALIZATION */}

        <View style={styles.contentParent}>

          <View style={styles.content}>
                <Text style={styles.settingsHeader}>Recoder</Text>
          </View>

          <View style={styles.visualization}>
            <MaterialCommunityIcons name="waveform" size={100} color="rgba(0, 0, 0, .5)" />
            <MaterialCommunityIcons name="waveform" size={170} color="rgba(0, 0, 0, .8)" />
            <MaterialCommunityIcons name="waveform" size={100} color="rgba(0, 0, 0, .5)" />
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
        marginBottom: 40,
    },
    // ENDS

    navChild:
    {
        width: 50 , height: 50,
        borderRadius: 50,
        backgroundColor: 'rgba(0, 0, 0, .3)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    navSibling:
    {
        width: 70 , height: 70,
        borderRadius: 50,
        backgroundColor: 'rgba(0, 0, 0, .3)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    time:
    {
        fontSize: 50,
        fontWeight: 'bold',
        letterSpacing: 5,
        marginBottom: 30,
        color: 'rgba(0, 0, 0, .7)',
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

    contentParent:
    {
      height: '80%',
      width: '100%',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, .6)',
      borderRadius: 40,
      position: 'relative'

    },

    visualization:
    {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 0
    },

    returnButtonParent:
    {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginTop: 30,
      gap: 30,
      paddingVertical: 10,
      paddingHorizontal: 10,
    },

    title:
    {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 5,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: 'rgba(255, 255, 255, .6)',
        width: '80%'
    },
    // ENDS

    returnButton:
    {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 10,
    },

    settingsHeader:
    {
      fontSize: 28,
      fontWeight: 900,
      letterSpacing: 2,
    },

    content:
    {
      position: 'absolute',
      top: 20
    },

});