// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyDytStROWnzOCHV3ZPjAuSkoMH3pTLjyAM",
    authDomain: "e-commerce-website-99bbd.firebaseapp.com",
    projectId: "e-commerce-website-99bbd",
    storageBucket: "e-commerce-website-99bbd.firebasestorage.app",
    messagingSenderId: "864875675840",
    appId: "1:864875675840:web:d87ff605ae6628b0872d25"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

