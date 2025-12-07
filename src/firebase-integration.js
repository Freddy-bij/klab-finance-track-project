// ============= FIREBASE INTEGRATION =============

// Load transactions from Firebase and display them
async function loadTransactions() {
    try {
        console.log('Loading transactions from Firebase...');
        const transactions = await window.firebaseDB.getAllTransactions();
        
        console.log('Loaded transactions:', transactions);
        
        // Calculate statistics
        const stats = window.firebaseDB.calculateStats(transactions);
        console.log('Statistics:', stats);
        
        // Update Recent Transactions on Dashboard
        updateRecentTransactions(transactions.slice(0, 5)); // Show only 5 most recent
        
        // Update Transaction Page
        updateTransactionPage(transactions);
        
        // Update Statistics
        updateStatistics(stats);
        
    } catch (error) {
        console.error('Error loading transactions:', error);
    }
}

// Update Recent Transactions section on Dashboard
function updateRecentTransactions(transactions) {
    const recentSection = document.querySelector('#dashboard-content .rounded-lg.p-6.card-shadow .space-y-4');
    if (!recentSection) return;
    
    if (transactions.length === 0) {
        recentSection.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <p>No transactions yet. Click "Add Transaction" to get started!</p>
            </div>
        `;
        return;
    }
    
    recentSection.innerHTML = transactions.map(t => {
        const isIncome = t.type === 'income';
        const icon = isIncome ? 
            `<svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8L5.257 19.257a2 2 0 00-.263 2.485l1.414 2.83a2 2 0 002.282.282l8.159-4.076a2 2 0 001.697-1.850V7z"></path>
            </svg>` :
            `<svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>`;
        
        const bgColor = isIncome ? 'bg-green-100' : 'bg-gray-100';
        const textColor = isIncome ? 'text-green-500' : 'text-gray-900';
        const amountSign = isIncome ? '+' : '-';
        
        // Format date
        const dateObj = new Date(t.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        return `
            <div class="flex items-center justify-between py-4 bg-white px-4 rounded-lg mb-4">
                <div class="flex items-center gap-4">
                    <div class="${bgColor} rounded-full p-3">
                        ${icon}
                    </div>
                    <div>
                        <p class="font-semibold text-gray-900">${t.description}</p>
                        <p class="text-sm text-gray-600">${t.category}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-semibold ${textColor}">${amountSign}$${t.amount.toFixed(2)}</p>
                    <p class="text-sm text-gray-600">${formattedDate}</p>
                </div>
            </div>
        `;
    }).join('');
}

// Update Transaction Page
function updateTransactionPage(transactions) {
    const transactionList = document.querySelector('#transaction-content .space-y-4');
    if (!transactionList) return;
    
    if (transactions.length === 0) {
        transactionList.innerHTML = `
            <div class="text-center py-8 text-gray-500 bg-white rounded-lg">
                <p>No transactions yet. Click "Add Transaction" to get started!</p>
            </div>
        `;
        return;
    }
    
    transactionList.innerHTML = transactions.map(t => {
        const isIncome = t.type === 'income';
        const iconClass = isIncome ? 'fa-arrow-down text-green-500' : 'fa-arrow-up text-red-500';
        const bgColor = isIncome ? 'bg-green-100' : 'bg-red-100';
        const textColor = isIncome ? 'text-green-600' : 'text-red-600';
        const amountSign = isIncome ? '+' : '-';
        
        // Format date
        const dateObj = new Date(t.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        return `
            <div class="flex items-center justify-between bg-white rounded-lg p-4 border-b">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 ${bgColor} rounded-full flex items-center justify-center">
                        <i class="fa ${iconClass}"></i>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-800">${t.description}</h3>
                        <p class="text-sm text-gray-500">${t.category} - ${formattedDate}</p>
                    </div>
                </div>
                <span class="${textColor} font-bold">${amountSign}$${t.amount.toFixed(2)}</span>
            </div>
        `;
    }).join('');
}

// Update Statistics
function updateStatistics(stats) {
    // Update Dashboard cards
    const dashboardCards = document.querySelectorAll('#dashboard-content .text-3xl.font-bold.text-gray-900');
    if (dashboardCards.length >= 3) {
        dashboardCards[0].textContent = `$${stats.balance}`;
        dashboardCards[1].textContent = `$${stats.totalIncome}`;
        dashboardCards[2].textContent = `$${stats.totalExpense}`;
    }
    
    // Update Transaction Page stats
    const transactionPageIncome = document.querySelector('#transaction-content .text-green-700');
    const transactionPageExpense = document.querySelector('#transaction-content .text-red-700');
    
    if (transactionPageIncome) transactionPageIncome.textContent = `$${stats.totalIncome}`;
    if (transactionPageExpense) transactionPageExpense.textContent = `$${stats.totalExpense}`;
}

// Handle receipt file selection
const receiptInput = document.getElementById('receipt');
if (receiptInput) {
    receiptInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const label = e.target.nextElementSibling;
            if (label) {
                label.innerHTML = `
                    <i class="fa fa-check-circle text-green-500 text-2xl mb-2"></i>
                    <p class="text-sm text-gray-700 font-medium">${file.name}</p>
                    <p class="text-xs text-gray-500 mt-1">Click to change</p>
                `;
            }
        }
    });
}

// Wait for everything to load, then set up form submission
window.addEventListener('DOMContentLoaded', () => {
    // Wait for Firebase to initialize
    setTimeout(() => {
        const transactionForm = document.getElementById('transactionForm');
        
        if (transactionForm) {
            transactionForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const amount = document.getElementById('amount').value;
                const category = document.getElementById('category').value;
                const date = document.getElementById('date').value;
                const description = document.getElementById('description').value;
                
                // Get transaction type from global variable (set in transation-model.js)
                const type = window.transactionType || 'expense';
                
                // Create transaction object
                const transaction = {
                    type: type,
                    amount: parseFloat(amount),
                    category,
                    date,
                    description
                };
                
                console.log('Submitting transaction:', transaction);
                
                // Show loading state
                const submitBtn = transactionForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Saving...';
                submitBtn.disabled = true;
                
                try {
                    // Add to Firebase
                    const result = await window.firebaseDB.addTransaction(transaction);
                    
                    if (result.success) {
                        alert(`✅ Transaction added successfully!\nType: ${type}\nAmount: $${amount}\nCategory: ${category}`);
                        
                        // Close modal
                        if (typeof window.closeModal === 'function') {
                            window.closeModal();
                        }
                        
                        // Reload transactions
                        await loadTransactions();
                    } else {
                        alert('❌ Error adding transaction: ' + result.error);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('❌ Error adding transaction. Please check console.');
                } finally {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            });
            
            console.log('✅ Form submission handler attached');
        }
        
        // Load initial transactions
        loadTransactions();
    }, 1500);
});