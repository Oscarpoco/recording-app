import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Animated, Alert, View,SafeAreaView, Dimensions } from 'react-native';
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

// FIREBASE
import { auth } from './firebase/config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail  } from "firebase/auth";

// EXPO
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

export default function App() {

  // STATES

  const [recordings, setRecordings] = useState([]);
  const [view, setView] = useState('splash');


  // RECORDING STATE
  const [title, setTitle] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null);
  const [recording, setRecording] = useState(null);
  const [recordedURI, setRecordedURI] = useState(null); 
  const [refreshing, setRefreshing] = useState(false);
  const [isEditting, setIsEditting] = useState(false);
  const [settings, setSettings] = useState(false);
  const [isProfile, setIsProfile] = useState(false);
  const [userInformation, setUserInformation] = useState(null);
  const [isToggled, setIsToggled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [fullNames, setFullNames] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');



  // FIREBASE REGISTER AND LOGIN

  // Check for authenticated user
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          
          try {
            await AsyncStorage.setItem('user', JSON.stringify(user));
            setUserInformation(user);
          } catch (error) {
            console.error("Error saving user to AsyncStorage:", error);
          }
          setView("play");
        } else {
          console.log("No user logged in");
          setView("sign"); 
        }
      });
  
      // Clean up the listener on unmount
      return unsubscribe;
    }, []);

 


  // Function to handle user registration
  const register = async () => {
    try {
      if (!email || !password) {
        
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: "Email and password are required!",
          position: 'bottom',
        });
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: "Registration complete! You can now log in.",
        position: 'bottom',
      });
      
      setView("play");
      setPassword('');
      setEmail('');
      setConfirmPassword('');

    } catch (error) {
      console.error("Registration Error:", error.code, error.message);
      let errorMessage = "Registration Failed";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already in use.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      }
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
        position: 'bottom',
      });
    
    }
  };

  // Function to handle user login
  const login = async () => {
    try {
      if (!email || !password) {
        
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: "Email and password are required!",
          position: 'bottom',
        });

        return;
      }
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: "Welcome back!",
        position: 'bottom',
      });

      console.log('my info', userInformation)

      setView("play");
      setPassword('');
      setEmail('');
      setConfirmPassword('');

    } catch (error) {
      console.error("Login Error:", error.code, error.message);
      let errorMessage = "Login Failed";
      if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "No user found with this email.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      }
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
        position: 'bottom',
      });
    }
  };


  // Function to log out
  const logout = async () => {
    try {
      await auth.signOut();
      
      Toast.show({
        type: 'success',
        text1: 'Logged out',
        text2: "You have been logged out.",
        position: 'bottom',
      });

      setUserInformation(null)
      setView("sign");
    } catch (error) {
      console.error("Logout Error:", error.message);
      
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: "Logout Failed",
        position: 'bottom',
      });
    }
  };

  // RESET PASSWORD
  const sendPasswordReset = async (email) => {
  
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent successfully');
      
      Toast.show({
        type: 'success',
        text1: 'Password Reset Email Sent',
        text2: 'Check your email to reset your password.',
        position: 'bottom',
        duration: 3000
      });

    } catch (error) {
      console.error('Error sending password reset email:', error);
      
      // Handle specific errors
      if (error.code === 'auth/user-not-found') {
        console.log('No user found with this email address.');
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No user found with this email.',
          position: 'bottom',
        });
      } else if (error.code === 'auth/invalid-email') {
        console.log('The email address is invalid.');
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'The email address is invalid.',
          position: 'bottom',
        });
      } else {
        console.log('Error sending reset email:', error.message);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message,
          position: 'bottom',
        });
      }
    }
  };
  // ENDS

  // TOGGLE BUTTON
  const toggleButton = () => {
    setIsToggled(!isToggled);
  };


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
        userId: userInformation.uid
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
  
  

  // FORMAT TIME
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
        if (userInformation) {
          const userId = userInformation.uid; 

          const keys = await AsyncStorage.getAllKeys();
          const recordingsData = await AsyncStorage.multiGet(keys);

          const recordings = recordingsData
            .map(([key, value]) => {
              if (key.startsWith('recording_')) {
                const recording = JSON.parse(value);
                if (recording.userId === userId) {  
                  return { ...recording, key };
                }
              }
              return null;
            })
            .filter(recording => recording !== null);

          setRecordings(recordings);
        }
      } catch (error) {
        console.error('Failed to load recordings', error);

        ToastAndroid.showWithGravity(
          'Failed to load recordings.',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
      }
    };

    loadRecordings();
  }, [userInformation]); 

  // REFRESH
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (userInformation) {
        const userId = userInformation.uid;
        const keys = await AsyncStorage.getAllKeys();
        const storedRecordings = await AsyncStorage.multiGet(keys);
        
        // Filter and update recordings based on userId
        const updatedRecordings = storedRecordings
          .map(([key, value]) => {
            const recording = JSON.parse(value);
            if (recording.userId === userId) {  
              return { key, ...recording };
            }
            return null;
          })
          .filter(recording => recording !== null);

        setRecordings(updatedRecordings);
        ToastAndroid.showWithGravity(
          'Recordings list updated.',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
      }
    } catch (error) {
      console.error('Failed to refresh recordings:', error);
      ToastAndroid.showWithGravity(
        'Failed to refresh recordings.',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    } finally {
      setRefreshing(false);
    }
  };
  
  // ENDS


  // USE EFFECT TO AUTOMATICALLY CHANGE VIEW AFTER 2 SECONDS
  useEffect(() => {
    const timer = setTimeout(() => {
      setView('sign'); 
    }, 3000);

    return () => clearTimeout(timer); 
  }, []);

  // ENDS


  // FUNCTION TO MANIPULATE THE VIEW STATE 

  const translateX = useRef(new Animated.Value(0)).current;

  const changeView = (view) => {
   
    Animated.timing(translateX, {
      toValue: -1, 
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
    
      setView(view);
  
      translateX.setValue(Dimensions.get('window').width); 
      Animated.timing(translateX, {
        toValue: 0, 
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  // ENDS

  return (

    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.container, { transform: [{ translateX }] }]}>

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
            settings={settings}
            setSettings={setSettings}
            userInformation={userInformation}
          />
        ) : view === 'profile' ? (
          <Account

          changeView={changeView}
          setSettings={setSettings}
          toggleButton={toggleButton}
          isToggled={isToggled}
          logout={logout}
          userInformation={userInformation}
          sendPasswordReset={sendPasswordReset}
      

          />

        ) : view === 'sign' ? (
          <SignIn
          
          changeView={changeView}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          login={login}
          
          />
        ) : view === 'signUp' ? (
            <SignUp
            
            changeView={changeView}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            fullNames={fullNames}
            setFullNames={setFullNames}
            register={register}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            
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
