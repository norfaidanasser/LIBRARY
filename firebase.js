// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAx38EXoudizcyiHRsIz7oLR3VmRboo9Dk",
  authDomain: "neulibrary-2845c.firebaseapp.com",
  projectId: "neulibrary-2845c",
  storageBucket: "neulibrary-2845c.firebasestorage.app",
  messagingSenderId: "535306647114",
  appId: "1:535306647114:web:c8fdd021985ac665bc58b3",
  measurementId: "G-5Z7KEQQJMG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


// admin.js
import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

window.loginAdmin = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Login successful!");
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
};