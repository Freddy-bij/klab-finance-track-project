
// =========================================================================
// FIREBASE AUTHENTICATION & LOGOUT FUNCTIONALITY
// =========================================================================

import { auth } from "./firebase-config.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// Check if user is authenticated
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // If no user is logged in, redirect to login page
        window.location.href = "index.html";
    } else {
        console.log("User is logged in:", user.email);
    }
});

// Sign Out Elements
const signOutButton = document.querySelector('#signOutButton'); 
const confirmSignOutButton = document.querySelector('#confirmSignOutButton'); 
const cancelSignOutButton = document.querySelector('#cancelSignOutButton'); 
const signOutModal = document.querySelector('#signOutModal'); 

// Modal Utility Functions
const showModal = () => {
    if (signOutModal) {
        signOutModal.classList.remove('hidden');
    }
};

const hideModal = () => {
    if (signOutModal) {
        signOutModal.classList.add('hidden');
    }
};

// ========== SIGN OUT POPUP DISPLAY ==========
if (signOutButton) {
    signOutButton.addEventListener("click", () => {
        showModal();
    });
}

if (cancelSignOutButton) {
    cancelSignOutButton.addEventListener("click", () => {
        hideModal();
    });
}

if (signOutModal) {
    signOutModal.addEventListener("click", (e) => {
        if (e.target.id === 'signOutModal') {
            hideModal();
        }
    });
}

// ========== SIGN OUT FIREBASE FUNCTIONALITY ==========
if (confirmSignOutButton) {
    confirmSignOutButton.addEventListener("click", async () => {
        try {
            await signOut(auth);
            console.log("User signed out successfully");
            hideModal(); 
            alert("Sign out successful!");
            window.location.href = "index.html"; 
        } catch (error) {
            console.error("Sign out error:", error);
            alert("Error signing out: " + error.message);
        }
    });
}

console.log("🔐 Firebase auth initialized");

// =========================================================================
// TRANSACTION FILTERING & UI MANAGEMENT
// =========================================================================

let allTransactionsForFilter = []; // Store all transactions for filtering

// DOM Elements
const searchInput = document.getElementById('search-transaction');
const typeSelect = document.getElementById('filter-type');
const categorySelect = document.getElementById('filter-category');
const clearFilterBtn = document.getElementById('clear-filter-btn');

/**
 * Renders filtered transactions into the transaction page
 */
function renderFilteredTransactions(transactionsToDisplay) {
    const transactionListContainer = document.querySelector('#transaction-content .space-y-4');
    if (!transactionListContainer) return;

    transactionListContainer.innerHTML = '';

    if (transactionsToDisplay.length === 0) {
        transactionListContainer.innerHTML = `
            <div class="text-center py-12 text-gray-500 bg-white rounded-lg shadow-sm">
                <i class="fa fa-search text-5xl mb-4"></i>
                <p class="text-lg">No transactions found matching your filters.</p>
                <button onclick="clearFilters()" class="mt-4 text-green-600 hover:text-green-700 font-medium">
                    Clear Filters
                </button>
            </div>
        `;
        return;
    }

    transactionListContainer.innerHTML = transactionsToDisplay.map(t => {
        const isIncome = t.type === 'income';
        const iconClass = isIncome ? 'fa-arrow-down text-green-500' : 'fa-arrow-up text-red-500';
        const bgColor = isIncome ? 'bg-green-100' : 'bg-red-100';
        const textColor = isIncome ? 'text-green-600' : 'text-red-600';
        const amountSign = isIncome ? '+' : '-';
        
        const dateObj = new Date(t.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        return `
            <div class="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 ${bgColor} rounded-full flex items-center justify-center">
                        <i class="fa ${iconClass} text-lg"></i>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-800 text-lg">${t.description}</h3>
                        <p class="text-sm text-gray-500">${t.category} • ${formattedDate}</p>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <span class="${textColor} font-bold text-xl">${amountSign}$${t.amount.toFixed(2)}</span>
                    <div class="flex gap-2">
                        <button onclick="editTransaction('${t.id}')" class="p-2 hover:bg-blue-50 rounded-lg transition-colors" title="Edit transaction">
                            <i class="fa fa-pencil text-blue-600"></i>
                        </button>
                        <button onclick="deleteTransactionWithConfirm('${t.id}')" class="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete transaction">
                            <i class="fa fa-trash text-red-600"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Applies all active filters
 */
window.filterTransactions = function() {
    if (!searchInput || !typeSelect || !categorySelect) return;
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    const typeFilter = typeSelect.value;
    const categoryFilter = categorySelect.value;

    const filteredList = allTransactionsForFilter.filter(transaction => {
        const searchMatch = !searchTerm || 
            transaction.description.toLowerCase().includes(searchTerm) ||
            transaction.category.toLowerCase().includes(searchTerm);
        const typeMatch = !typeFilter || transaction.type === typeFilter;
        const categoryMatch = !categoryFilter || transaction.category === categoryFilter;

        return searchMatch && typeMatch && categoryMatch;
    });

    renderFilteredTransactions(filteredList);
};

/**
 * Clears all filters
 */
window.clearFilters = function() {
    if (searchInput) searchInput.value = '';
    if (typeSelect) typeSelect.value = '';
    if (categorySelect) categorySelect.value = '';
    
    if (typeof filterTransactions === 'function') {
        filterTransactions();
    }
};

if (searchInput) {
    searchInput.addEventListener('input', filterTransactions);
}

if (typeSelect) {
    typeSelect.addEventListener('change', filterTransactions);
}

if (categorySelect) {
    categorySelect.addEventListener('change', filterTransactions);
}

if (clearFilterBtn) {
    clearFilterBtn.addEventListener('click', clearFilters);
}

// ...............................................................

// TAB NAVIGATION SYSTEM

const tabLinks = document.querySelectorAll('.tab-link');
const tabContents = document.querySelectorAll('.tab-content');
const pageTitle = document.getElementById('pageTitle');

function switchTab(tabName) {
    tabContents.forEach(content => content.classList.add('hidden'));
    tabLinks.forEach(link => {
        link.classList.remove('bg-green-500', 'text-white');
        link.classList.add('text-gray-700', 'hover:bg-gray-100');
    });

    const selectedContent = document.getElementById(`${tabName}-content`);
    if (selectedContent) selectedContent.classList.remove('hidden');

    const activeLink = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeLink) {
        activeLink.classList.add('bg-green-500', 'text-white');
        activeLink.classList.remove('text-gray-700', 'hover:bg-gray-100');
    }

    if (pageTitle) {
        pageTitle.textContent = tabName.charAt(0).toUpperCase() + tabName.slice(1);
    }
    
    window.location.hash = tabName;
}

tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const tabName = link.getAttribute('data-tab');
        switchTab(tabName);
    });
});

// CHARTS INITIALIZATION

const ctx = document.getElementById('trendChart');
if (ctx) {
    const trendChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: ['Nov 1', 'Nov 5', 'Nov 10', 'Nov 15', 'Nov 20', 'Nov 25', 'Today'],
            datasets: [{
                label: 'Balance',
                data: [2400, 2300, 2900, 2200, 2500, 2700, 2250],
                borderColor: '#14b8a6',
                backgroundColor: 'rgba(20, 184, 166, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#14b8a6',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true },
                filler: { propagate: true }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 0,
                    max: 3000,
                    ticks: { stepSize: 750, color: '#9ca3af', font: { size: 12 } },
                    grid: { color: '#e5e7eb', drawBorder: false }
                },
                x: {
                    ticks: { color: '#9ca3af', font: { size: 12 } },
                    grid: { display: false }
                }
            }
        }
    });
}

const incomeExpenseCtx = document.getElementById('incomeExpenseChart');
if (incomeExpenseCtx) {
    new Chart(incomeExpenseCtx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Income',
                    data: [4000, 2800, 1800, 2500, 1500, 2300],
                    backgroundColor: '#10b981',
                    borderRadius: 6,
                },
                {
                    label: 'Expense',
                    data: [2000, 1200, 950, 1800, 1700, 1500],
                    backgroundColor: '#ef4444',
                    borderRadius: 6,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: { usePointStyle: true, padding: 15, font: { size: 11 } }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#9ca3af', font: { size: 11 } },
                    grid: { color: '#e5e7eb', drawBorder: false }
                },
                x: {
                    ticks: { color: '#9ca3af', font: { size: 11 } },
                    grid: { display: false }
                }
            }
        }
    });
}


const categoryCtx = document.getElementById('categoryChart');
if (categoryCtx) {
    new Chart(categoryCtx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Other'],
            datasets: [{
                data: [450, 320, 280, 200, 150],
                backgroundColor: ['#10b981', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6'],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    labels: { usePointStyle: true, padding: 15, font: { size: 11 } }
                }
            }
        }
    });
}

// =========================================================================
// SETTINGS TAB MANAGEMENT
// =========================================================================

const settingTabs = document.querySelectorAll('.setting-tab');
const settingContents = document.querySelectorAll('.setting-content');

function switchSettingTab(tab) {
    settingContents.forEach(section => section.classList.add('hidden'));
    settingTabs.forEach(btn => {
        btn.classList.remove('bg-white', 'shadow');
        btn.classList.add('bg-transparent');
        const icon = btn.querySelector('i');
        const text = btn.querySelector('h1');
        icon.classList.remove('text-gray-900');
        icon.classList.add('text-gray-600');
        text.classList.remove('text-gray-900');
        text.classList.add('text-gray-600');
    });

    document.getElementById(tab).classList.remove('hidden');
    const active = document.querySelector(`[data-setting="${tab}"]`);
    active.classList.add('bg-white', 'shadow');
    const icon = active.querySelector('i');
    const text = active.querySelector('h1');
    icon.classList.add('text-gray-900');
    text.classList.add('text-gray-900');
    localStorage.setItem("activeSettingTab", tab);
}

settingTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-setting');
        switchSettingTab(target);
    });
});

const toggleBtn = document.getElementById("toggleBtn");
const toggleCircle = document.getElementById("toggleCircle");

if (toggleBtn && toggleCircle) {
    let isOn = false;
    toggleBtn.addEventListener("click", () => {
        isOn = !isOn;
        if (isOn) {
            toggleBtn.classList.remove("bg-gray-300");
            toggleBtn.classList.add("bg-green-500");
            toggleCircle.classList.add("translate-x-6");
        } else {
            toggleBtn.classList.add("bg-gray-300");
            toggleBtn.classList.remove("bg-green-500");
            toggleCircle.classList.remove("translate-x-6");
        }
    });
}

// =========================================================================
// INITIALIZATION
// =========================================================================

window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.slice(1);
    if (hash && ['dashboard', 'transaction', 'categories', 'analystics', 'settings'].includes(hash)) {
        switchTab(hash);
    } else {
        switchTab('dashboard');
    }

    const savedTab = localStorage.getItem("activeSettingTab");
    if (savedTab) {
        switchSettingTab(savedTab);
    } else {
        switchSettingTab("profile");
    }
});

console.log("✅ Dashboard.js loaded successfully");

// =========================================================================
// MOBILE SIDEBAR TOGGLE
// =========================================================================
    
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const backdrop = document.createElement('div'); 

const toggleSidebar = () => {
    const isClosed = sidebar.classList.toggle("-translate-x-full");
    
    if (window.innerWidth < 768) {
        if (!isClosed) {
            document.body.appendChild(backdrop);
            backdrop.classList.add('fixed', 'inset-0', 'bg-black', 'bg-opacity-50', 'z-40');
        } else if (isClosed && backdrop.parentNode) {
            backdrop.remove();
        }
    }
};

if (menuBtn) {
    menuBtn.addEventListener("click", toggleSidebar);
}

backdrop.addEventListener("click", toggleSidebar);

window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && backdrop.parentNode) {
        backdrop.remove();
    }
});







