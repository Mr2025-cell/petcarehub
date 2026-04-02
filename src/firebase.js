import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with real Firebase project credentials before production
// For now, these are placeholder values so the architecture is fully configured.
const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForNowPleaseReplaceIt12345",
  authDomain: "petminder-group42.firebaseapp.com",
  projectId: "petminder-group42",
  storageBucket: "petminder-group42.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789jkl0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
