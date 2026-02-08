import { initializeApp, getApp, getApps } from "firebase/app";

export const firebaseConfig = {
  apiKey: "AIzaSyCOjx0Q_2U3c-sCjThN9WUIkR-iIVL5Zhk",
  authDomain: "leasevault-db.firebaseapp.com",
  projectId: "leasevault-db",
  storageBucket: "leasevault-db.firebasestorage.app",
  messagingSenderId: "772088849600",
  appId: "1:772088849600:web:fbd6c884bc3d05fb10b925",
  measurementId: "G-J64LBE4V02"
};

// Initialize Firebase ONCE (reuse if already initialized)
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
