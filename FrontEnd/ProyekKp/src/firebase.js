import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyARTVokbmNuBHFWKepRUnu-Cytg1i94WZU",
  authDomain: "projectkp-73a85.firebaseapp.com",
  projectId: "projectkp-73a85",
  storageBucket: "projectkp-73a85.firebasestorage.app",
  messagingSenderId: "990266344219",
  appId: "1:990266344219:web:9f994127ca9cdd13e809be",
  measurementId: "G-N98M8117PP"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Ekspor Firestore & Storage
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
