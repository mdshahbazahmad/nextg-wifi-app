/**
 * NextG WiFi - Central Firebase Configuration
 * File: src/firebase-config.js
 */

// 1. Aapki Firebase Keys (Universal Project + NextG WiFi App ID)
const firebaseConfig = {
  apiKey: "AIzaSyCVsmFa6Xr-_EfUqh_ZS6tmzBwcdMZq0JA",
  authDomain: "universal-portal-dashboard.firebaseapp.com",
  databaseURL: "https://universal-portal-dashboard-default-rtdb.firebaseio.com",
  projectId: "universal-portal-dashboard",
  storageBucket: "universal-portal-dashboard.firebasestorage.app",
  messagingSenderId: "403036962443",
  appId: "1:403036962443:web:52b233377303ecb1c3de8e"
};

// 2. Check & Initialize Firebase App
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// 3. Global Database Instances (Har component aur button me use karne ke liye)
window.db = firebase.firestore(); // Firestore Database ke liye
window.rtdb = firebase.database(); // Realtime Database ke liye

console.log("⚡ NextG WiFi - Firebase Connected Successfully to Universal Portal!");
