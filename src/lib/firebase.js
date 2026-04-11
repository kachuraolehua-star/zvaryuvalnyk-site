import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAdj2QFTMGksAo1vGc2Be-MPIZICzHmIoQ",
    authDomain: "zvaryuvalnyk-45771.firebaseapp.com",
    projectId: "zvaryuvalnyk-45771",
    storageBucket: "zvaryuvalnyk-45771.firebasestorage.app",
    messagingSenderId: "1048382467770",
    appId: "1:1048382467770:web:c6c9317b50ec8f11c1dc83"
};

// В Next.js важно проверять, не запущена ли уже база, чтобы сервер не ругался
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Принудительно используем Long Polling, чтобы статьи грузились моментально!
const db = initializeFirestore(app, {
    experimentalForceLongPolling: true
});

export { app, db };