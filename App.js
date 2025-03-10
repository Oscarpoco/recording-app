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
import * as ImagePicker from "expo-image-picker";

// ENDS

// FIREBASE
import { auth, firestore  } from './firebase/config.js';
import 
{ 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  sendPasswordResetEmail, 
  updateProfile   
} from "firebase/auth";

import { doc, setDoc, getDoc, onSnapshot  } from "firebase/firestore";


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

  // PROFILE
  const [isProfile, setIsProfile] = useState(false);
  const [userInformation, setUserInformation] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [fullNames, setFullNames] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isToggled, setIsToggled] = useState(false);

  const [userDetails, setUserDetails] = useState({
    bio: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribeFirestore = null;

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const userRef = doc(firestore, 'users', user.uid);

        // Fetch the document once
        getDoc(userRef).then((doc) => {
          if (doc.exists()) {
            setUserDetails({
              bio: doc.data().bio || '',
              phone: doc.data().phone || '',
            });
          } else {
            setError('User document not found in Firestore');
          }
          setLoading(false);
        }).catch((error) => {
          console.error('Error fetching user document:', error);
          setError('Error fetching user data');
          setLoading(false);
        });

        // Listen for real-time changes
        unsubscribeFirestore = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            setUserDetails({
              bio: doc.data().bio || '',
              phone: doc.data().phone || '',
            });
          } else {
            setError('User document not found in Firestore');
          }
        }, (error) => {
          console.error('Error in snapshot listener:', error);
          setError('Error fetching user data');
        });
      } else {
        // User is logged out
        if (unsubscribeFirestore) {
          unsubscribeFirestore();
        }
        setUserDetails({
          bio: '',
          phone: '',
        });
        setError(null);
        setLoading(false);
      }
    });

    // Cleanup the auth state listener
    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }
    };
  }, []);



  // FIREBASE REGISTER AND LOGIN

  // Check for authenticated user
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          
          try {
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

    setLoading(true);
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
        text2: `Account ${email} created successfully!`,
        position: 'bottom',
      });
      
      const login = await signInWithEmailAndPassword(auth, email, password);


      const user = login.user;
      // console.log("UserData", user);

      // Save user info to AsyncStorage for persistence
      await AsyncStorage.setItem('user', JSON.stringify(user));

      // Store user information in state for immediate access
      setUserInformation(user);

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
    
    } finally {
      setLoading(false);
    }
  };

  // Function to handle user login
  const login = async () => {

    setLoading(true);
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


      const user = userCredential.user;

      // Save user info to AsyncStorage for persistence
      await AsyncStorage.setItem('user', JSON.stringify(user));

      // Store user information in state for immediate access
      setUserInformation(user);

      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: `Welcome back! ${user?.name || user?.email || ''}`,
        position: 'bottom',
      });

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
    } finally {
      setLoading(false);
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

      setUserInformation(null);
      await AsyncStorage.removeItem('user');
      setUserDetails({
        bio:'',
        phone:  '',
      });
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

  // EDIT PROFILE

  // UPDATE USER
  const updateUserDetails = async (user, { name, bio, phone }) => {

    setLoading(true)
    try {
      
      if (name) {
        await updateProfile(user, {
          displayName: name,
        });
      }
  
      const userDocRef = doc(firestore, "users", user.uid);
      await setDoc(
        userDocRef,
        {
          bio,
          phone
        },
        { merge: true } 
      );
  
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'User details updated successfully!',
        position: 'bottom',
        duration: 3000
      });

    } catch (error) {
      console.error("Error updating user details:", error);

      Toast.show({
        type: 'error',
        text1: 'Failed',
        text2: `Error : ${error}`,
        position: 'bottom',
        duration: 3000
      });

      throw error;
    } finally{
      setLoading(false)
    }
  };


  // UPDATE PROFILE PHOTO
const updateProfilePhoto = async (userInformation, file) => {
  setLoading(true)
  try {
    // Convert blob to base64
    const base64Data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Save to AsyncStorage
    await AsyncStorage.setItem(
      `${userInformation.uid}_profilePhoto`,
      base64Data
    );

    // Show success toast
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Profile photo updated successfully!',
      position: 'bottom',
      duration: 3000,
    });

    return base64Data; // Return the base64 data as the photo URL
  } catch (error) {
    console.error("Error updating profile photo:", error);
    
    Toast.show({
      type: 'error',
      text1: 'Failed',
      text2: `Error: ${error.message}`,
      position: 'bottom',
      duration: 3000,
    });

    throw error;
  } finally{
    setLoading(false)
  }
};

// UPDATE COVER PHOTO
const updateCoverPhoto = async (userInformation, file) => {
  try {
    // Convert blob to base64
    const base64Data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Save to AsyncStorage
    await AsyncStorage.setItem(
      `${userInformation.uid}_coverPhoto`,
      base64Data
    );

    // Show success toast
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: 'Cover photo updated successfully!',
      position: 'bottom',
      duration: 3000,
    });

    return base64Data; // Return the base64 data as the photo URL
  } catch (error) {
    console.error("Error updating cover photo:", error);
    
    Toast.show({
      type: 'error',
      text1: 'Failed',
      text2: `Error: ${error.message}`,
      position: 'bottom',
      duration: 3000,
    });

    throw error;
  }
};

// Handle Profile Photo Update
const handleProfilePhotoUpdate = async (userInformation) => {

  setLoading(true)
  try {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Permission to access the gallery is needed.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7, 
      base64: true, 
    });

    if (!result.canceled && result.assets[0]) {
      const response = await fetch(result.assets[0].uri);
      const file = await response.blob();

      const photoURL = await updateProfilePhoto(userInformation, file);
      return photoURL;
    }
  } catch (error) {
    console.error("Error in handleProfilePhotoUpdate:", error);
    Alert.alert(
      "Upload Failed",
      "There was a problem updating your profile photo. Please try again."
    );
  } finally{
    setLoading(false);
  }
};

// Handle Cover Photo Update
const handleCoverPhotoUpdate = async (userInformation) => {
  try {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Permission to access the gallery is needed.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7, 
      base64: true, 
    });

    if (!result.canceled && result.assets[0]) {
      const response = await fetch(result.assets[0].uri);
      const file = await response.blob();

      const coverPhotoURL = await updateCoverPhoto(userInformation, file);
      return coverPhotoURL;
    }
  } catch (error) {
    console.error("Error in handleCoverPhotoUpdate:", error);
    Alert.alert(
      "Upload Failed",
      "There was a problem updating your cover photo. Please try again."
    );
  }
};

// Helper function to load saved photos
const loadSavedPhotos = async (userInformation) => {
  try {
    const [profilePhoto, coverPhoto] = await Promise.all([
      AsyncStorage.getItem(`${userInformation.uid}_profilePhoto`),
      AsyncStorage.getItem(`${userInformation.uid}_coverPhoto`)
    ]);

    return {
      profilePhoto,
      coverPhoto
    };
  } catch (error) {
    console.error("Error loading saved photos:", error);
    return {
      profilePhoto: null,
      coverPhoto: null
    };
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
      setTitle('rec');
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
        duration: 500,
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
            isProfile={isProfile}
            setIsProfile={setIsProfile}
            updateCoverPhoto={updateCoverPhoto}
            updateUserDetails={updateUserDetails}
            updateProfilePhoto={updateProfilePhoto}
            loadSavedPhotos={loadSavedPhotos}
            handleCoverPhotoUpdate={handleCoverPhotoUpdate}
            handleProfilePhotoUpdate={handleProfilePhotoUpdate}
            setUserInformation={setUserInformation}
            userDetails={userDetails}
            loading ={loading}
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
          loading ={loading}
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
            loading ={loading}
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
    position: 'relative'
  },

  toast: 
  {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 50,
    zIndex: 20
  },

});
