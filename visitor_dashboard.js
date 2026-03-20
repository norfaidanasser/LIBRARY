
const params = new URLSearchParams(window.location.search);

const name = params.get("name");
const role = params.get("role");
const program = params.get("program");
const email = params.get("email");

document.getElementById("dashName").textContent = name;
document.getElementById("dashRole").textContent = role;
document.getElementById("dashProgram").textContent = program;
document.getElementById("dashEmail").textContent = email;

document.getElementById("welcomeMsg").textContent =
"Welcome " + name + " to NEU Library!";

document.getElementById("entryTime").textContent =
new Date().toLocaleString();

function checkPurpose(){

const purpose = document.getElementById("purpose").value;
const otherInput = document.getElementById("otherPurpose");

if(purpose === "Other"){
otherInput.style.display = "block";
}else{
otherInput.style.display = "none";
}

}

function checkIn(){

let purpose = document.getElementById("purpose").value;

if(purpose === "Other"){
purpose = document.getElementById("otherPurpose").value;
}

const time = new Date().toLocaleTimeString();

const table = document.getElementById("logTable");

const row = `
<tr>
<td>${name}</td>
<td>${purpose}</td>
<td>${time}</td>
<td>Checked-In</td>
</tr>
`;

table.innerHTML += row;

alert("Check-In recorded!");

}

function checkOut(){

alert("You have checked out of the library.");

window.location.href = "index.html";

}