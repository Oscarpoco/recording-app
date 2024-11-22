import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6rNOCsiuqcvlXB7qX_6glVVIG1pTs6Js",
  authDomain: "recording-application.firebaseapp.com",
  projectId: "recording-application",
  storageBucket: "recording-application.firebasestorage.app",
  messagingSenderId: "646181256821",
  appId: "1:646181256821:web:136d1d097dda4f4d18023c",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Use `getAuth` to avoid re-initializing Firebase Auth
export const auth =
  getAuth(app) ||
  initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });