import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDujaR9vldmjpu62ss5kTSXX-6lfv848pI",
  authDomain: "medicfinder-ce91d.firebaseapp.com",
  projectId: "medicfinder-ce91d",
  storageBucket: "medicfinder-ce91d.appspot.com",
  messagingSenderId: "697222750939",
  appId: "1:697222750939:web:d5068503962144af1e22fe"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
