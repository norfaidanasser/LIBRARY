import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    serverTimestamp, 
    query, 
    where, 
    getDocs, 
    updateDoc, 
    doc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAx38EXoudizcyiHRsIz7oLR3VmRboo9Dk",
  authDomain: "neulibrary-2845c.firebaseapp.com",
  projectId: "neulibrary-2845c",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ================= REGISTER =================
window.registerUser = async function(){
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const role = document.getElementById('regRole').value;
    const password = document.getElementById('regPassword').value;

    // 🔥 HANDLE PROGRAM (STUDENT vs FACULTY)
    let program = document.getElementById('regProgram').value;

    if(role === "faculty"){
        program = document.getElementById('regProgramFaculty').value;
    }

    if(!name || !email || !role || !program || !password){
        alert("Please fill all fields!");
        return;
    }

    try {
        await addDoc(collection(db, "users"), {
            name,
            email,
            role,
            program,
            password,
            blocked: false,
            createdAt: serverTimestamp()
        });

        alert("Registered successfully!");

        // clear fields
        regName.value="";
        regEmail.value="";
        regRole.value="";
        regProgram.value="";
        regProgramFaculty.value="";
        regPassword.value="";

        showTab('login');

    } catch(err){
        console.error(err);
        alert("Registration failed!");
    }
};

// ================= LOGIN =================
window.loginUser = async function(){
    const role = document.getElementById('loginRole').value;
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const purpose = document.getElementById('loginPurpose').value.trim();

    if(!role || !email || !password || !purpose){
        alert("Fill all fields!");
        return;
    }

    try {
        const q = query(collection(db,"users"),
            where("email","==",email),
            where("password","==",password),
            where("role","==",role)
        );

        const snap = await getDocs(q);

        if(snap.empty){
            alert("Invalid credentials!");
            return;
        }

        const userDoc = snap.docs[0];
        const user = userDoc.data();

        // 🔥 BLOCK CHECK
        if(user.blocked){
            alert("You are blocked by admin!");
            return;
        }

        const userRef = doc(db,"users",userDoc.id);

        // 🔥 UPDATE USER STATUS
        await updateDoc(userRef,{
            loginTime: serverTimestamp(),
            purpose: purpose
        });

        // 🔥 SAVE LOGIN LOG
        await addDoc(collection(db,"logs"),{
            name: user.name,
            email: user.email,
            role: user.role,
            program: user.program,
            purpose: purpose,
            loginTime: serverTimestamp()
        });

        alert(`Welcome ${user.name}!`);

        // 🔥 REDIRECT
        window.location.href = "visitor_dashboard.html";

    } catch(err){
        console.error(err);
        alert("Login error!");
    }
};