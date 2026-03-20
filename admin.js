import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  doc 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// 🔥 YOUR FIREBASE CONFIG (REPLACE THIS)
const firebaseConfig = {
  apiKey: "AIzaSyAx38EXoudizcyiHRsIz7oLR3VmRboo9Dk",
  authDomain: "neulibrary-2845c.firebaseapp.com",
  projectId: "neulibrary-2845c",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// =============================
// 🔐 ADMIN LOGIN
// =============================
window.adminLogin = function () {
  const email = document.getElementById('adminEmail').value;
  const password = document.getElementById('adminPassword').value;
  const msg = document.getElementById('loginMsg');

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      msg.style.color = "green";
      msg.textContent = "Login successful!";
      window.location.href = 'admin_dashboard.html';
    })
    .catch((error) => {
      msg.style.color = "red";
      msg.textContent = error.message;
    });
};


// =============================
// 🚪 LOGOUT
// =============================
window.logoutAdmin = function () {
  signOut(auth).then(() => {
    window.location.href = "admin_login.html";
  });
};


// =============================
// 🔒 PROTECT DASHBOARD
// =============================
onAuthStateChanged(auth, (user) => {
  if (!user) {
    if (window.location.pathname.includes("admin_dashboard.html")) {
      window.location.href = "admin_login.html";
    }
  }
});


// =============================
// 📥 LOAD VISITOR LOGS (FIRESTORE)
// =============================
window.loadVisitorLogs = async function () {
  const tbody = document.getElementById('visitorLogTable');
  if (!tbody) return;

  tbody.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "visitors"));

  querySnapshot.forEach((docSnap) => {
    const v = docSnap.data();
    const id = docSnap.id;

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${v.name}</td>
      <td>${v.role}</td>
      <td>${v.program}</td>
      <td>${v.purpose}</td>
      <td>${v.time}</td>
      <td>${v.status}</td>
      <td><button onclick="blockVisitor('${id}')">Block</button></td>
    `;

    tbody.appendChild(row);
  });
};


// =============================
// 🚫 BLOCK VISITOR (UPDATE FIRESTORE)
// =============================
window.blockVisitor = async function (id) {
  const visitorRef = doc(db, "visitors", id);

  await updateDoc(visitorRef, {
    status: "Blocked"
  });

  loadVisitorLogs();
};


// =============================
// 📊 FILTER STATS (BASIC)
// =============================
window.filterStats = async function () {
  const querySnapshot = await getDocs(collection(db, "visitors"));

  let total = 0;

  querySnapshot.forEach(() => total++);

  document.getElementById('totalVisitors').textContent = total;
  document.getElementById('todayVisitors').textContent = total;
  document.getElementById('weekVisitors').textContent = total;
  document.getElementById('monthVisitors').textContent = total;
};


// =============================
// ➕ ADD VISITOR (OPTIONAL)
// =============================
window.addVisitor = async function (visitorData) {
  await addDoc(collection(db, "visitors"), {
    ...visitorData,
    status: "Checked-In"
  });

  loadVisitorLogs();
};


// =============================
// 🚀 AUTO LOAD WHEN DASHBOARD OPENS
// =============================
if (document.getElementById('visitorLogTable')) {
  loadVisitorLogs();
}