import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Reemplaza esto con tu configuración de Firebase
  apiKey: "AIzaSyCkAP-Hampwz5Dd-e1l8fQQkYKrsIn82Ew",
  authDomain: "pollmaster-aab4f.firebaseapp.com",
  projectId: "pollmaster-aab4f",
  storageBucket: "pollmaster-aab4f.appspot.com",
  messagingSenderId: "208056456373",
  appId: "1:208056456373:web:650fc0c28ba99d5c3c1afc"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


