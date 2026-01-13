// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyCOjx0Q_2U3c-sCjThN9WUIkR-iIVL5Zhk",
  authDomain: "leasevault-db.firebaseapp.com",
  projectId: "leasevault-db",
  storageBucket: "leasevault-db.firebasestorage.app",
  messagingSenderId: "772088849600",
  appId: "1:772088849600:web:fbd6c884bc3d05fb10b925",
  measurementId: "G-J64LBE4V02"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);