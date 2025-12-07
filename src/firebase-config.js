// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyCcA1SCPkyoxrku-mD1_5GbPDSUfz8XW50",
    authDomain: "finance-track-500fa.firebaseapp.com",
    projectId: "finance-track-500fa",
    storageBucket: "finance-track-500fa.firebasestorage.app",
    messagingSenderId: "90116850858",
    appId: "1:90116850858:web:a6733771feb65d711cbcd3",
    measurementId: "G-21BEF5XHDM"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export const db = getFirestore(app);