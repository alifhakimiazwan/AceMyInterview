// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3uBFBFxvyYxwg7uHAJ8ko54yyLYc6YjQ",
  authDomain: "acemyinterview-d366f.firebaseapp.com",
  projectId: "acemyinterview-d366f",
  storageBucket: "acemyinterview-d366f.firebasestorage.app",
  messagingSenderId: "667018529949",
  appId: "1:667018529949:web:d292ebbd193afdb0281874",
  measurementId: "G-FQRMGXCSXD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
