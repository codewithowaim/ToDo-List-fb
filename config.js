import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAI0Ftr1-7ybf1xKeuY1jWuZXCEkCMrwJ0",
  authDomain: "to-do-list-fb-7f4ac.firebaseapp.com",
  projectId: "to-do-list-fb-7f4ac",
  storageBucket: "to-do-list-fb-7f4ac.firebasestorage.app",
  messagingSenderId: "17484252105",
  appId: "1:17484252105:web:3f81f3ad8e28f9d2b15e18",
  measurementId: "G-Y9C8FTY3QS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export{
    app,
    db
}