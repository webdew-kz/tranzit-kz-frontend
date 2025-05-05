/** @format */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC_XVKweXOZURAqGF9KNzVXHdMhxrzlvp0",
    authDomain: "tranzit-1d045.firebaseapp.com",
    projectId: "tranzit-1d045",
    storageBucket: "tranzit-1d045.firebasestorage.app",
    messagingSenderId: "1083097584867",
    appId: "1:1083097584867:web:5de8016c44b023f04e21d6",
    measurementId: "G-D5YT33QSJL",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
