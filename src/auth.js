import { auth, provider } from "./firebase-config.js";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";


const loginEmail = document.querySelector('#loginForm input[type="email"]');
const loginPassword = document.querySelector('#loginForm input[type="password"]');
const loginBtn = document.querySelector('#loginForm button');

const googleBtn = document.querySelector('#loginForm .fa-google-plus').parentElement;

const registerForm = document.querySelector('#registerForm');
const registerInputs = registerForm.querySelectorAll("input");
const registerBtn = registerForm.querySelector("button");

// ========== LOGIN ==========
loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
        await signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value);

        alert("Login successful!");
        window.location.href = "dashboard.html";
    } catch (error) {
        alert("Error: " + error.message);
    }
});

// ========== REGISTER ==========
registerBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const fullName = registerInputs[0].value;
    const email = registerInputs[1].value;
    const password = registerInputs[2].value;

    try {
        await createUserWithEmailAndPassword(auth, email, password);

        alert("Account created!");
        document.getElementById("registerTab").click(); // Go back to login
    } catch (error) {
        alert("Error: " + error.message);
    }
});

// ========== GOOGLE LOGIN ==========
googleBtn.addEventListener("click", async () => {
    try {
        await signInWithPopup(auth, provider);
        alert("Google Login successful!");
        window.location.href = "dashboard.html";
    } catch (error) {
        alert("Error: " + error.message);
    }
});

console.log("Auth.js Loaded");
