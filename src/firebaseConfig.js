// Update with Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDkdF_ybJWZSiyteE4WPU2GqwBZ9Go-rwg",
    authDomain: "chrity-eb05b.firebaseapp.com",
    projectId: "chrity-eb05b",
    storageBucket: "chrity-eb05b.firebasestorage.app",
    messagingSenderId: "836745576981",
    appId: "1:836745576981:web:51d57cfbfba7659fb6041c",
    measurementId: "G-YQ8QT7T81K"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();
