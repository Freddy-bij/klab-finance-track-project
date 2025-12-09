


import { auth, provider } from "./firebase-config.js";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {


    const loginEmail = document.querySelector('#loginForm input[type="email"]');
    const loginPassword = document.querySelector('#loginForm input[type="password"]');
    const loginBtn = document.querySelector('#loginForm button');
    const googleBtn = document.querySelector('#loginForm .fa-google-plus')?.parentElement;

    const registerForm = document.querySelector('#registerForm');
    const registerInputs = registerForm ? registerForm.querySelectorAll("input") : [];
    const registerBtn = registerForm ? registerForm.querySelector("button") : null;
    
    // ========== LOGIN ==========
    if (loginBtn && loginEmail && loginPassword) { 
        loginBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            const email = loginEmail.value.trim();
            const password = loginPassword.value;

         
            if (!email || !password) {
                alert("Please fill in all fields");
                return;
            }

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                console.log("Login successful:", userCredential.user);
                alert("Login successful!");
                window.location.href = "dashboard.html";
            } catch (error) {
                console.error("Login error:", error);
                let errorMessage = "Login failed: ";
                
                switch(error.code) {
                    case 'auth/invalid-email':
                        errorMessage += "Invalid email format";
                        break;
                    case 'auth/user-disabled':
                        errorMessage += "This account has been disabled";
                        break;
                    case 'auth/user-not-found':
                        errorMessage += "No account found with this email";
                        break;
                    case 'auth/wrong-password':
                        errorMessage += "Incorrect password";
                        break;
                    case 'auth/invalid-credential':
                        errorMessage += "Invalid email or password";
                        break;
                    default:
                        errorMessage += error.message;
                }
                
                alert(errorMessage);
            }
        });
    }

    // ========== REGISTER ==========
    if (registerBtn && registerInputs.length >= 3) {
        registerBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            const fullName = registerInputs[0].value.trim();
            const email = registerInputs[1].value.trim();
            const password = registerInputs[2].value;

           
            if (!fullName || !email || !password) {
                alert("Please fill in all fields");
                return;
            }

            if (password.length < 8) {
                alert("Password must be at least 8 characters long");
                return;
            }

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                console.log("Registration successful:", userCredential.user);
                alert("Account created successfully! Please login.");
               
                registerInputs[0].value = '';
                registerInputs[1].value = '';
                registerInputs[2].value = '';
             
                const loginTab = document.getElementById("loginTab");
                if (loginTab) {
                    loginTab.click();
                }
            } catch (error) {
                console.error("Registration error:", error);
                let errorMessage = "Registration failed: ";
                
                switch(error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage += "This email is already registered";
                        break;
                    case 'auth/invalid-email':
                        errorMessage += "Invalid email format";
                        break;
                    case 'auth/operation-not-allowed':
                        errorMessage += "Email/password accounts are not enabled";
                        break;
                    case 'auth/weak-password':
                        errorMessage += "Password is too weak";
                        break;
                    default:
                        errorMessage += error.message;
                }
                
                alert(errorMessage);
            }
        });
    }

    // ========== GOOGLE LOGIN ==========
    if (googleBtn) {
        googleBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            
            try {
                const result = await signInWithPopup(auth, provider);
                console.log("Google login successful:", result.user);
                alert("Google Login successful!");
                window.location.href = "dashboard.html";
            } catch (error) {
                console.error("Google login error:", error);
                alert("Google login failed: " + error.message);
            }
        });
    }
    
    console.log("Auth.js Logic Initialized");
});