// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDs0BLclJHN_BMFCXsTseAdq1xYcH8nGCE",
  authDomain: "realtor-clone-reactapp.firebaseapp.com",
  projectId: "realtor-clone-reactapp",
  storageBucket: "realtor-clone-reactapp.appspot.com",
  messagingSenderId: "897109847259",
  appId: "1:897109847259:web:3629f411a0ecede50630fe"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();