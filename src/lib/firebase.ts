import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "gen-lang-client-0298511597",
  appId: "1:157550021999:web:d4e7465bcef4746c8bac9a",
  apiKey: "AIzaSyAE9dga2qiGtmOe24OaGQbTs1MxN6jpIJc",
  authDomain: "gen-lang-client-0298511597.firebaseapp.com",
  firestoreDatabaseId: "default",
  storageBucket: "gen-lang-client-0298511597.firebasestorage.app",
  messagingSenderId: "157550021999"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export default app;
