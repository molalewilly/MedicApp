import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAzUBWbkqceQgXnlYUZoQFHTngEDyu_qaU",
  authDomain: "medicapp-21160.firebaseapp.com",
  projectId: "medicapp-21160",
  storageBucket: "medicapp-21160.appspot.com",
  messagingSenderId: "624732500733",
  appId: "1:624732500733:web:7972aaf794bf8b68f58494",
  measurementId: "G-B7P7EBT9HS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
