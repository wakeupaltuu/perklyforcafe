//this is firebase.ts file that initializes firebase and exports the auth and db instances for use in other parts of the application

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDFEm45Qne2wVe18H4okxQOctYjent8C9Y",
  authDomain: "perklycafe.firebaseapp.com",
  projectId: "perklycafe",
  storageBucket: "perklycafe.firebasestorage.app",
  messagingSenderId: "818194807389",
  appId: "1:818194807389:web:a56c8611d81a1877136bb4",
  measurementId: "G-7DKYLZ7H1L"
};

// Initialize Firebase immediately (not inside try/catch)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err?.code === 'failed-precondition') {
      console.warn('Firestore persistence was not enabled because multiple tabs/windows are open for this app.');
    } else if (err?.code === 'unimplemented') {
      console.warn('Firestore persistence is not available in this browser environment.');
    } else {
      console.warn('Firestore persistence could not be enabled:', err);
    }
  });
} catch (err) {
  console.warn('Firestore persistence is unavailable in this environment:', err);
}

export const isFirebaseConfigured = true;

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return { name: result.user.displayName, email: result.user.email };
};

export const logoutFirebase = async () => {
  await signOut(auth);
};

export { auth, db };