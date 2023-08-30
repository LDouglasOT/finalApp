
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZ0Dc5HQXCkrwfmJuoZcrSAVT_vcE_Bi0",
  authDomain: "flirtify-616c0.firebaseapp.com",
  projectId: "flirtify-616c0",
  storageBucket: "flirtify-616c0.appspot.com",
  messagingSenderId: "305402540915",
  appId: "1:305402540915:web:a2ea8b773d478e5cd90b06",
  measurementId: "G-G2C9KGD4XV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);