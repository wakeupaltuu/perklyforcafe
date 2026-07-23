import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';

// Note: If running without Firebase config, we gracefully degrade to the local Zustand store.
// Normally, we would proxy all calls to Firebase if the config is present.

const firebaseConfigStr = import.meta.env.VITE_FIREBASE_CONFIG;
let app;
let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;

try {
  const firebaseConfig = {
    apiKey: "AIzaSyDFEm45Qne2wVe18H4okxQOctYjent8C9Y",
    authDomain: "perklycafe.firebaseapp.com",
    projectId: "perklycafe",
    storageBucket: "perklycafe.firebasestorage.app",
    messagingSenderId: "818194807389",
    appId: "1:818194807389:web:a56c8611d81a1877136bb4",
    measurementId: "G-7DKYLZ7H1L"
  };
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.warn("Firebase not configured. Falling back to local storage.", e);
}

export const isFirebaseConfigured = !!app;

// Simple wrapper for Auth
export const loginWithGoogle = async () => {
  if (auth && isFirebaseConfigured) {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return { name: result.user.displayName, email: result.user.email };
  } else {
    // Mock login if Firebase is missing
    return { name: "Alex CoffeeLover", email: "alex@example.com" };
  }
};

export const logoutFirebase = async () => {
  if (auth && isFirebaseConfigured) {
    await signOut(auth);
  }
};

export { auth, db };
