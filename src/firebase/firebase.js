// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADPBPiLeVfQR5Ba2SFcHiFUUXHr3WkFik",
  authDomain: "hackatoon-576ca.firebaseapp.com",
  projectId: "hackatoon-576ca",
  storageBucket: "hackatoon-576ca.firebasestorage.app",
  messagingSenderId: "582329315884",
  appId: "1:582329315884:web:9f4bcb4fbef759340b5789",
  measurementId: "G-LEHF9D8BBS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export instances takay LoginPage aur baqi pages par use ho sakein
export const auth = getAuth(app);
export const db = getFirestore(app);