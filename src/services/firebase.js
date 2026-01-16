import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAlwubcvsxYZ-ij_d9Q9g-K20bNU2-f_9w",
  authDomain: "gamely-5e977.firebaseapp.com",
  projectId: "gamely-5e977",
  storageBucket: "gamely-5e977.firebasestorage.app",
  messagingSenderId: "481658284788",
  appId: "1:481658284788:web:86b90561f1b3bcd8430ca1",
  measurementId: "G-T4VW5R8RCN" 
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
