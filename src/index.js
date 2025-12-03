
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

function switchTab(tab) {
    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        
        loginTab.classList.add('bg-blue-500', 'text-white');
        loginTab.classList.remove('text-gray-400');
        
        registerTab.classList.add('text-gray-400');
        registerTab.classList.remove('bg-purple-500', 'text-white');
    } else {
        
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        
        
        registerTab.classList.add('bg-purple-500', 'text-white');
        registerTab.classList.remove('text-gray-400');
        
        loginTab.classList.add('text-gray-400');
        loginTab.classList.remove('bg-blue-500', 'text-white');
    }
    
    window.location.hash = tab;
}

loginTab.addEventListener('click', () => switchTab('login'));
registerTab.addEventListener('click', () => switchTab('register'));

// Restore active tab on page load
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.slice(1);
    if (hash === 'register') {
        switchTab('register');
    }
});