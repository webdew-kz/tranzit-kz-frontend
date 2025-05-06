/** @format */

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC_XVKweXOZURAqGF9KNzVXHdMhxrzlvp0",
    authDomain: "tranzit-1d045.firebaseapp.com",
    projectId: "tranzit-1d045",
    storageBucket: "tranzit-1d045.firebasestorage.app",
    messagingSenderId: "1083097584867",
    appId: "1:1083097584867:web:5de8016c44b023f04e21d6",
    measurementId: "G-D5YT33QSJL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
