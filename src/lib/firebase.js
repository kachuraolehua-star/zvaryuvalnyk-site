import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAdj2QFTMGksAo1vGc2Be-MPIZICzHmIoQ",
    authDomain: "zvaryuvalnyk-45771.firebaseapp.com",
    projectId: "zvaryuvalnyk-45771",
    storageBucket: "zvaryuvalnyk-45771.firebasestorage.app",
    messagingSenderId: "1048382467770",
    appId: "1:1048382467770:web:c6c9317b50ec8f11c1dc83"
};

// Защита от двойной инициализации при hot-reload
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Стандартная инициализация — experimentalForceLongPolling не нужен на Vercel/Node.js
const db = getFirestore(app);

export { app, db };