import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAsq6CX0cCTGn_CN7NLzEndE3SSUiY3SLI",
  authDomain: "recipesharingapp-ce741.firebaseapp.com",
  projectId: "recipesharingapp-ce741",
  storageBucket: "recipesharingapp-ce741.firebasestorage.app",
  messagingSenderId: "76173242158",
  appId: "1:76173242158:web:66d0d449590be85a3b14bf",
  measurementId: "G-HMYMNNJ1G3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;