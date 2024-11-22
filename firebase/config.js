
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyA6rNOCsiuqcvlXB7qX_6glVVIG1pTs6Js",
  authDomain: "recording-application.firebaseapp.com",
  projectId: "recording-application",
  storageBucket: "recording-application.firebasestorage.app",
  messagingSenderId: "646181256821",
  appId: "1:646181256821:web:136d1d097dda4f4d18023c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);