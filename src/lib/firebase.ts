import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';

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