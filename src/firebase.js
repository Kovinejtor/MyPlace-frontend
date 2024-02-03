// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrs6ZeomUNRER3n3m4ycEaaaRU4vX3isE",
  authDomain: "myplace-4ca53.firebaseapp.com",
  projectId: "myplace-4ca53",
  storageBucket: "myplace-4ca53.appspot.com",
  messagingSenderId: "976986137881",
  appId: "1:976986137881:web:10fee6f8e4a34712b05188",
  measurementId: "G-47KTNG9XS2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage }; // Export the variables