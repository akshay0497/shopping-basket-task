import { initializeApp, getApps } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCjcUFmcRGPw-HUnP1LmNnnvFTq4NaiO48",
  authDomain: "basketweb-5f529.firebaseapp.com",
  projectId: "basketweb-5f529",
  storageBucket: "basketweb-5f529.firebasestorage.app",
  messagingSenderId: "317744575901",
  appId: "1:317744575901:web:85fd4d29cdd8c2d3342b74",
  measurementId: "G-GPLQKPR8HE"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore
export const db = getFirestore(app);

// Optional: Use emulator for local development
// if (process.env.NODE_ENV === 'development') {
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }

//console.log('Firebase initialized with project:', firebaseConfig.projectId);