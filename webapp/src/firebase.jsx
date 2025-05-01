// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyAzUBWbkqceQgXnlYUZoQFHTngEDyu_qaU",
  authDomain: "medicapp-21160.firebaseapp.com",
  projectId: "medicapp-21160",
  storageBucket: "medicapp-21160.appspot.com", // Storage bucket
  messagingSenderId: "624732500733",
  appId: "1:624732500733:web:7972aaf794bf8b68f58494",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Export Firebase Storage
