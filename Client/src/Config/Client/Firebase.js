import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyDg0Ilm5Au4SJlvAaiAHlJzGWOjuVYx_UA",
    authDomain: "huong-sen.firebaseapp.com",
    projectId: "huong-sen",
    storageBucket: "huong-sen.firebasestorage.app",
    messagingSenderId: "97424667239",
    appId: "1:97424667239:web:f800135235331c32c69ac2",
    measurementId: "G-CC04G7QCS9"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);