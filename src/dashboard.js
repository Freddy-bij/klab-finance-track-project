
// =========================================================================
// 🚀 NEW: TRANSACTION DATA & DOM ELEMENTS FOR FILTERING
// =========================================================================

// 1. Mock Transaction Data (Replace this with your actual Firebase fetching logic)
const mockTransactions = [
    { id: 1, type: 'income', description: 'Salary', category: 'Salary', amount: 3500.00, date: '2024-12-01' },
    { id: 2, type: 'expense', description: 'Groceries', category: 'Food', amount: 150.00, date: '2024-11-30' },
    { id: 3, type: 'expense', description: 'Monthly Rent', category: 'Rent', amount: 1200.00, date: '2024-11-28' },
    { id: 4, type: 'income', description: 'Freelance Project', category: 'Freelance', amount: 500.00, date: '2024-11-25' },
    { id: 5, type: 'expense', description: 'Movie Tickets', category: 'Entertainment', amount: 45.00, date: '2024-11-20' },
    { id: 6, type: 'expense', description: 'Bus Fare', category: 'Transportation', amount: 8.50, date: '2024-11-15' },
];

// 2. DOM Elements
const transactionListContainer = document.querySelector('#transaction-content .space-y-4');
const searchInput = document.getElementById('search-transaction');
const typeSelect = document.getElementById('filter-type');
const categorySelect = document.getElementById('filter-category');
const clearFilterBtn = document.getElementById('clear-filter-btn');

// =========================================================================
// 🚀 NEW: TRANSACTION FILTERING FUNCTIONS
// =========================================================================

/**
 * Renders the transactions into the list container.
 * @param {Array} transactionsToDisplay - The filtered array of transactions.
 */
function renderTransactions(transactionsToDisplay) {
    if (!transactionListContainer) return; // Exit if container is not found

    // Clear existing content
    transactionListContainer.innerHTML = '';

    if (transactionsToDisplay.length === 0) {
        transactionListContainer.innerHTML = '<p class="text-center text-gray-500 py-8">No transactions found matching your filter criteria.</p>';
        return;
    }

    transactionsToDisplay.forEach(transaction => {
        const isIncome = transaction.type === 'income';
        const amountText = isIncome ? `+$${transaction.amount.toFixed(2)}` : `-$${transaction.amount.toFixed(2)}`;
        const amountColor = isIncome ? 'text-green-600' : 'text-red-600';
        const iconClass = isIncome ? 'fa-arrow-down text-green-500' : 'fa-arrow-up text-red-500';
        const iconBg = isIncome ? 'bg-green-100' : 'bg-red-100';

        const transactionHtml = `
            <div class="flex items-center justify-between bg-white rounded-lg p-4 border-b">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 ${iconBg} rounded-full flex items-center justify-center">
                        <i class="fa ${iconClass}"></i>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-800">${transaction.description}</h3>
                        <p class="text-sm text-gray-500">${new Date(transaction.date).toDateString()}</p>
                    </div>
                </div>
                <span class="${amountColor} font-bold">${amountText}</span>
            </div>
        `;
        transactionListContainer.innerHTML += transactionHtml;
    });
}

/**
 * Applies all filters (search, type, category) to the mock data.
 */
function filterTransactions() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const typeFilter = typeSelect.value;
    const categoryFilter = categorySelect.value;

    const filteredList = mockTransactions.filter(transaction => {
        const searchMatch = transaction.description.toLowerCase().includes(searchTerm);
        const typeMatch = !typeFilter || transaction.type === typeFilter;
        const categoryMatch = !categoryFilter || transaction.category === categoryFilter;

        return searchMatch && typeMatch && categoryMatch;
    });

    renderTransactions(filteredList);
}

/**
 * Resets all filter inputs and reloads the full transaction list.
 */
function clearFilters() {
    console.log('Clearing filters...');
    searchInput.value = '';
    typeSelect.value = '';
    categorySelect.value = '';
    filterTransactions(); // Re-run filter with empty inputs
    // Re-style the clear button if needed (optional)
    clearFilterBtn.classList.remove('bg-green-600', 'text-white');
    clearFilterBtn.classList.add('hover:bg-green-600', 'text-gray-800');
}

/**
 * Initial function to load and display transactions (calls filter to display everything initially).
 */
function loadTransactions() {
    // You would fetch your data here. For now, we just apply the initial filter.
    filterTransactions();
}

// 3. Attach Listeners to Filter Inputs
if (searchInput) {
    // Listen to keyup for real-time search filtering
    searchInput.addEventListener('keyup', filterTransactions);
}

if (typeSelect) {
    // Listen to change for select inputs
    typeSelect.addEventListener('change', filterTransactions);
}

if (categorySelect) {
    // Listen to change for select inputs
    categorySelect.addEventListener('change', filterTransactions);
}

if (clearFilterBtn) {
    // Listen to the clear button
    clearFilterBtn.addEventListener('click', clearFilters);
}



const tabLinks = document.querySelectorAll('.tab-link');
const tabContents = document.querySelectorAll('.tab-content');
const pageTitle = document.getElementById('pageTitle');

function switchTab(tabName) {
    tabContents.forEach(content => {
        content.classList.add('hidden');
    });

    tabLinks.forEach(link => {
        link.classList.remove('bg-green-500', 'text-white');
        link.classList.add('text-gray-700', 'hover:bg-gray-100');
    });

    const selectedContent = document.getElementById(`${tabName}-content`);
    if (selectedContent) {
        selectedContent.classList.remove('hidden');
    }

    const activeLink = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeLink) {
        activeLink.classList.add('bg-green-500', 'text-white');
        activeLink.classList.remove('text-gray-700', 'hover:bg-gray-100');
    }

    pageTitle.textContent = tabName.charAt(0).toUpperCase() + tabName.slice(1);
    window.location.hash = tabName;
}

tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const tabName = link.getAttribute('data-tab');
        switchTab(tabName);
    });
});

window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.slice(1);
    if (hash && ['dashboard', 'transaction', 'categories', 'analystics', 'settings'].includes(hash)) {
        switchTab(hash);
    }

    // Load transactions when page loads
    setTimeout(loadTransactions, 1000); // Wait for Firebase to initialize
});

// Balance Trend Chart (Dashboard)
const ctx = document.getElementById('trendChart').getContext('2d');
const trendChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Nov 1', 'Nov 5', 'Nov 10', 'Nov 15', 'Nov 20', 'Nov 25', 'Today'],
        datasets: [{
            label: 'Balance',
            data: [2400, 2300, 2900, 2200, 2500, 2700, 2250],
            borderColor: '#14b8a6',
            backgroundColor: 'white',
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
            legend: {
                display: true
            },
            filler: {
                propagate: true
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                min: 0,
                max: 3000,
                ticks: {
                    stepSize: 750,
                    color: '#9ca3af',
                    font: {
                        size: 12
                    }
                },
                grid: {
                    color: '#e5e7eb',
                    drawBorder: false
                }
            },
            x: {
                ticks: {
                    color: '#9ca3af',
                    font: {
                        size: 12
                    }
                },
                grid: {
                    display: false
                }
            }
        }
    }
});

// Income vs Expense Chart (Analytics)
const incomeExpenseCtx = document.getElementById('incomeExpenseChart');
if (incomeExpenseCtx) {
    const incomeExpenseChart = new Chart(incomeExpenseCtx.getContext('2d'), {
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
                    data: [2000, 1200, 9500, 3800, 4700, 3500],
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
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: {
                            size: 11
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10000,
                    ticks: {
                        stepSize: 2500,
                        color: '#9ca3af',
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: '#e5e7eb',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: '#9ca3af',
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Category Pie Chart (Analytics)
const categoryCtx = document.getElementById('categoryChart');
if (categoryCtx) {
    const categoryChart = new Chart(categoryCtx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Food', 'Transportation', 'Entertainment', 'Utilities', 'Other'],
            datasets: [{
                data: [450, 320, 280, 200, 150],
                backgroundColor: [
                    '#10b981',
                    '#06b6d4',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6'
                ],
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
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: {
                            size: 11
                        },
                        generateLabels: function (chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const value = data.datasets[0].data[i];
                                    return {
                                        text: `${label}: ${value}.00`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return `${label}: ${value}.00`;
                        }
                    }
                }
            }
        }
    });
}

// SETTINGS INNER TAB SWITCH SYSTEM
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

const savedTab = localStorage.getItem("activeSettingTab");
if (savedTab) {
    switchSettingTab(savedTab);
} else {
    switchSettingTab("profile");
}

// BTN toggle
const toggleBtn = document.getElementById("toggleBtn");
const toggleCircle = document.getElementById("toggleCircle");

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




// 💡 NEW: Balance Summary DOM Elements
const dashboardTotalIncomeEl = document.getElementById('dashboard-total-income');
const dashboardTotalExpenseEl = document.getElementById('dashboard-total-expense');
const dashboardTotalBalanceEl = document.getElementById('dashboard-total-balance');

const transactionTotalIncomeEl = document.getElementById('transaction-total-income');
const transactionTotalExpenseEl = document.getElementById('transaction-total-expense');
const transactionNetBalanceEl = document.getElementById('transaction-net-balance');


// =========================================================================
// 🚀 CORE FUNCTION: CALCULATE AND UPDATE BALANCE
// =========================================================================

/**
 * Calculates the total income, expense, and net balance from all transactions
 * and updates the dashboard and transaction summary cards.
 */
function updateBalanceSummary() {
    let totalIncome = 0;
    let totalExpense = 0;

    // Calculate totals by iterating through the mock data
    mockTransactions.forEach(transaction => {
        if (transaction.type === 'income') {
            totalIncome += transaction.amount;
        } else if (transaction.type === 'expense') {
            totalExpense += transaction.amount;
        }
    });

    const netBalance = totalIncome - totalExpense;

    // Function to format as a currency string
    const formatCurrency = (amount) => `$${amount.toFixed(2)}`;
    const formatExpense = (amount) => `$${amount.toFixed(2)}`; // Added this if you want to show + or -

    // 1. Update Dashboard Summary Cards
    if (dashboardTotalIncomeEl) {
        dashboardTotalIncomeEl.textContent = formatCurrency(totalIncome);
    }
    if (dashboardTotalExpenseEl) {
        dashboardTotalExpenseEl.textContent = formatExpense(totalExpense);
    }
    if (dashboardTotalBalanceEl) {
        dashboardTotalBalanceEl.textContent = formatCurrency(netBalance);
    }

    // 2. Update Transaction Summary Cards
    if (transactionTotalIncomeEl) {
        transactionTotalIncomeEl.textContent = formatCurrency(totalIncome);
    }
    if (transactionTotalExpenseEl) {
        transactionTotalExpenseEl.textContent = formatExpense(totalExpense);
    }
    if (transactionNetBalanceEl) {
        transactionNetBalanceEl.textContent = formatCurrency(netBalance);
    }
}