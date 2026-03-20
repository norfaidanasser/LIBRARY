import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    query, 
    orderBy,
    onSnapshot,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAx38EXoudizcyiHRsIz7oLR3VmRboo9Dk",
  authDomain: "neulibrary-2845c.firebaseapp.com",
  projectId: "neulibrary-2845c",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ================= NAVIGATION =================
window.showSection = function(sectionId, el){
    document.querySelectorAll(".contentSection").forEach(s => s.classList.remove("active"));
    document.querySelectorAll(".navLinks li").forEach(l => l.classList.remove("active"));
    document.getElementById(sectionId).classList.add("active");
    el.classList.add("active");
};

// ================= GLOBAL DATA =================
let allUsers = [];
let allLogs = [];

// ================= REALTIME USERS =================
onSnapshot(collection(db,"users"), (snapshot)=>{
    allUsers = [];
    snapshot.forEach(doc => {
        allUsers.push({id: doc.id, ...doc.data()});
    });

    loadStats();
    loadUsers();
    renderCharts();
});

// ================= REALTIME LOGS =================
onSnapshot(query(collection(db,"logs"), orderBy("loginTime","desc")), (snapshot)=>{
    allLogs = [];
    snapshot.forEach(doc => {
        allLogs.push(doc.data());
    });

    loadLogs();
    renderCharts();
});

// ================= STATS =================
function loadStats(){
    let visitors=0, students=0, faculty=0;

    allUsers.forEach(u=>{
        const role = (u.role || "").trim().toLowerCase();
        if(role.includes("visitor")) visitors++;
        else if(role.includes("student")) students++;
        else if(role.includes("faculty")) faculty++;
    });

    document.getElementById("visitorsToday").textContent = visitors;
    document.getElementById("studentsToday").textContent = students;
    document.getElementById("facultyToday").textContent = faculty;
    document.getElementById("totalVisits").textContent = allUsers.length;
}

// ================= USERS TABLE + BLOCK =================
function loadUsers(){
    const table = document.getElementById("usersTable");
    table.innerHTML = "";

    allUsers.forEach(u=>{
        const blocked = u.blocked || false;
        table.innerHTML += `
        <tr>
            <td>${u.name || "-"}</td>
            <td>${u.email || "-"}</td>
            <td>${u.role || "-"}</td>
            <td>${u.program || "N/A"}</td>
            <td>
                <button onclick="toggleBlock('${u.id}', ${blocked})"
                    style="background:${blocked ? '#16a34a':'#dc2626'};color:white;border:none;padding:5px 10px;border-radius:6px;">
                    ${blocked ? 'UNBLOCK':'BLOCK'}
                </button>
            </td>
        </tr>`;
    });
}

// 🔥 BLOCK / UNBLOCK
window.toggleBlock = async (id, status)=>{
    await updateDoc(doc(db,"users",id),{
        blocked: !status
    });
};

// ================= LOGS =================
function loadLogs(){
    const table = document.getElementById("logTable");
    table.innerHTML = "";

    allLogs.forEach(d=>{
        let loginTime = "N/A";
        if(d.loginTime && d.loginTime.toDate){
            const date = d.loginTime.toDate();
            loginTime = date.toLocaleString("en-PH", { dateStyle:"medium", timeStyle:"short" });
        }

        table.innerHTML += `
        <tr>
            <td>${d.name || "-"}</td>
            <td>${d.role || "-"}</td>
            <td>${d.email || "-"}</td>
            <td>${loginTime}</td>
            <td>${d.purpose || "-"}</td>
        </tr>`;
    });
}

// ================= CHARTS =================
let roleChart, purposeChart, dailyChart;

function renderCharts(){
    // ===== ROLE =====
    const roles = {visitor:0, student:0, faculty:0};
    allUsers.forEach(u=>{
        const r = (u.role || "").trim().toLowerCase();
        if(r.includes("visitor")) roles.visitor++;
        else if(r.includes("student")) roles.student++;
        else if(r.includes("faculty")) roles.faculty++;
    });

    if(roleChart) roleChart.destroy();
    roleChart = new Chart(document.getElementById("roleChart"),{
        type:"doughnut",
        data:{
            labels:["Visitor","Student","Faculty"],
            datasets:[{data:[roles.visitor, roles.student, roles.faculty], backgroundColor:["#3b82f6","#22c55e","#f59e0b"]}]
        }
    });

    // ===== PURPOSE =====
    const purposeCount = {};
    allLogs.forEach(l=>{
        const p = l.purpose || "Unknown";
        purposeCount[p] = (purposeCount[p] || 0) + 1;
    });

    if(purposeChart) purposeChart.destroy();
    purposeChart = new Chart(document.getElementById("purposeChart"),{
        type:"bar",
        data:{
            labels: Object.keys(purposeCount),
            datasets:[{label:"Purpose", data:Object.values(purposeCount), backgroundColor:"#6366f1"}]
        }
    });

    // ===== DAILY =====
    const daily = {};
    allLogs.forEach(l=>{
        if(!l.loginTime || !l.loginTime.toDate) return;
        const d = l.loginTime.toDate().toLocaleDateString();
        daily[d] = (daily[d] || 0) + 1;
    });

    const sortedDates = Object.keys(daily).sort((a,b)=> new Date(a)-new Date(b));

    if(dailyChart) dailyChart.destroy();
    dailyChart = new Chart(document.getElementById("dailyChart"),{
        type:"line",
        data:{
            labels: sortedDates,
            datasets:[{label:"Daily Visits", data:sortedDates.map(d=>daily[d]), borderColor:"#ef4444", fill:false}]
        }
    });
}

// ================= LOGOUT =================
window.logoutAdmin = function(){
    window.location.href = "admin_login.html";
};