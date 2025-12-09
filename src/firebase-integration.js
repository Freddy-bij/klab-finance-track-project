
// ============= FIREBASE INTEGRATION WITH EDIT/DELETE =============
// This file handles displaying transactions and UI updates

let allTransactions = []; // Store all transactions globally

// Load transactions from Firebase and display them
async function loadTransactions() {
    try {
        console.log('Loading transactions from Firebase...');
        
        // Wait for firebaseDB to be ready
        if (!window.firebaseDB) {
            console.log('Waiting for firebaseDB to load...');
            setTimeout(loadTransactions, 500);
            return;
        }
        
        const transactions = await window.firebaseDB.getAllTransactions();
        
        console.log('Loaded transactions:', transactions);
        allTransactions = transactions; // Store for filtering
        
        // Make available for filtering
        if (window.updateTransactionsForFilter) {
            window.updateTransactionsForFilter(transactions);
        }
        
        // Calculate statistics
        const stats = window.firebaseDB.calculateStats(transactions);
        console.log('Statistics:', stats);
        
        // Update Recent Transactions on Dashboard
        updateRecentTransactions(transactions.slice(0, 5));
        
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
    const recentSection = document.querySelector('#dashboard-content .rounded-lg.p-6.card-shadow');
    if (!recentSection) return;
    
    // Find or create the transactions container
    let container = recentSection.querySelector('.transactions-container');
    if (!container) {
        // Create container if it doesn't exist
        const button = recentSection.querySelector('.add-transaction-btn');
        if (button && button.parentElement && button.parentElement.parentElement) {
            container = document.createElement('div');
            container.className = 'transactions-container space-y-4 mt-4';
            button.parentElement.parentElement.appendChild(container);
        } else {
            return;
        }
    }
    
    if (transactions.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                <i class="fa fa-inbox text-4xl mb-3"></i>
                <p>No transactions yet. Click "Add Transaction" to get started!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = transactions.map(t => {
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
        
        const dateObj = new Date(t.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        return `
            <div class="flex items-center justify-between py-4 bg-white px-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center gap-4">
                    <div class="${bgColor} rounded-full p-3">
                        ${icon}
                    </div>
                    <div>
                        <p class="font-semibold text-gray-900">${t.description}</p>
                        <p class="text-sm text-gray-600">${t.category}</p>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <div class="text-right">
                        <p class="font-semibold ${textColor}">${amountSign}$${t.amount.toFixed(2)}</p>
                        <p class="text-sm text-gray-600">${formattedDate}</p>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="editTransaction('${t.id}')" class="p-2 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                            <i class="fa fa-pencil text-blue-600"></i>
                        </button>
                        <button onclick="deleteTransactionWithConfirm('${t.id}')" class="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <i class="fa fa-trash text-red-600"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Update Transaction Page with edit/delete buttons
function updateTransactionPage(transactions) {
    const transactionList = document.querySelector('#transaction-content .space-y-4:last-child');
    if (!transactionList) return;
    
    if (transactions.length === 0) {
        transactionList.innerHTML = `
            <div class="text-center py-12 text-gray-500 bg-white rounded-lg shadow-sm">
                <i class="fa fa-inbox text-5xl mb-4"></i>
                <p class="text-lg">No transactions yet. Click "Add Transaction" to get started!</p>
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

// Update Statistics with proper calculations
function updateStatistics(stats) {
    // Update Dashboard cards
    const dashboardCards = document.querySelectorAll('#dashboard-content .text-3xl.font-bold.text-gray-900');
    if (dashboardCards.length >= 3) {
        dashboardCards[0].textContent = `$${parseFloat(stats.balance).toFixed(2)}`;
        dashboardCards[1].textContent = `$${parseFloat(stats.totalIncome).toFixed(2)}`;
        dashboardCards[2].textContent = `$${parseFloat(stats.totalExpense).toFixed(2)}`;
    }
    
    // Update Transaction Page stats
    const transactionStats = document.querySelector('#transaction-content .grid.grid-cols-3');
    if (transactionStats) {
        const incomeEl = transactionStats.querySelector('.text-green-700');
        const expenseEl = transactionStats.querySelector('.text-red-700');
        const balanceSpans = transactionStats.querySelectorAll('span');
        const balanceEl = balanceSpans[balanceSpans.length - 2]; // Get the balance span
        
        if (incomeEl) incomeEl.textContent = `$${parseFloat(stats.totalIncome).toFixed(2)}`;
        if (expenseEl) expenseEl.textContent = `$${parseFloat(stats.totalExpense).toFixed(2)}`;
        if (balanceEl) balanceEl.textContent = `$${parseFloat(stats.balance).toFixed(2)}`;
        
        // Update transaction counts
        const incomeBadge = transactionStats.querySelector('.bg-green-100');
        const expenseBadge = transactionStats.querySelector('.bg-red-100');
        const totalBadge = transactionStats.querySelector('.bg-gray-200');
        
        if (incomeBadge) incomeBadge.textContent = `+${stats.incomeCount}`;
        if (expenseBadge) expenseBadge.textContent = `${stats.expenseCount}`;
        if (totalBadge) totalBadge.textContent = `+${stats.totalCount} Total`;
    }
}

// Edit Transaction Function
window.editTransaction = async function(transactionId) {
    console.log('Editing transaction:', transactionId);
    
    // Find the transaction
    const transaction = allTransactions.find(t => t.id === transactionId);
    if (!transaction) {
        alert('Transaction not found!');
        return;
    }
    
    // Open modal
    const modal = document.getElementById('transactionModal');
    modal.classList.remove('hidden');
    
    // Set form to edit mode
    window.editingTransactionId = transactionId;
    
    // Populate form
    document.getElementById('amount').value = transaction.amount;
    document.getElementById('category').value = transaction.category;
    document.getElementById('date').value = transaction.date;
    document.getElementById('description').value = transaction.description;
    
    // Set transaction type
    window.transactionType = transaction.type;
    window.userHasSelectedType = true; // Prevent auto-reset
    
    // Update button styles manually
    const expenseBtn = document.getElementById('expenseBtn');
    const incomeBtn = document.getElementById('incomeBtn');
    
    if (transaction.type === 'expense') {
        expenseBtn.classList.add('bg-red-500', 'text-white');
        expenseBtn.classList.remove('bg-gray-100', 'text-gray-700');
        incomeBtn.classList.add('bg-gray-100', 'text-gray-700');
        incomeBtn.classList.remove('bg-green-500', 'text-white');
    } else {
        incomeBtn.classList.add('bg-green-500', 'text-white');
        incomeBtn.classList.remove('bg-gray-100', 'text-gray-700');
        expenseBtn.classList.add('bg-gray-100', 'text-gray-700');
        expenseBtn.classList.remove('bg-red-500', 'text-white');
    }
    
    // Change modal title
    const modalTitle = modal.querySelector('h2');
    modalTitle.textContent = 'Edit Transaction';
    
    // Change submit button text
    const submitBtn = modal.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fa fa-save mr-2"></i>Update Transaction';
};

// Delete Transaction with Confirmation
window.deleteTransactionWithConfirm = function(transactionId) {
    // Create custom confirmation modal
    const confirmModal = document.createElement('div');
    confirmModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    confirmModal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <i class="fa fa-exclamation-triangle text-red-600 text-xl"></i>
                </div>
                <div>
                    <h3 class="text-lg font-bold text-gray-900">Delete Transaction</h3>
                    <p class="text-sm text-gray-600">This action cannot be undone</p>
                </div>
            </div>
            <p class="text-gray-700 mb-6">Are you sure you want to delete this transaction?</p>
            <div class="flex gap-3">
                <button id="cancelDelete" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition">
                    Cancel
                </button>
                <button id="confirmDelete" class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition">
                    Delete
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(confirmModal);
    
    // Handle cancel
    confirmModal.querySelector('#cancelDelete').addEventListener('click', () => {
        document.body.removeChild(confirmModal);
    });
    
    // Handle confirm
    confirmModal.querySelector('#confirmDelete').addEventListener('click', async () => {
        document.body.removeChild(confirmModal);
        await deleteTransaction(transactionId);
    });
};

// Delete Transaction Function
async function deleteTransaction(transactionId) {
    try {
        console.log('Deleting transaction:', transactionId);
        
        // Show loading indicator
        showToast('Deleting transaction...', 'info');
        
        const result = await window.firebaseDB.deleteTransaction(transactionId);
        
        if (result.success) {
            showToast('✅ Transaction deleted successfully!', 'success');
            await loadTransactions(); // Reload all data
        } else {
            showToast('❌ Error deleting transaction', 'error');
        }
    } catch (error) {
        console.error('Error deleting transaction:', error);
        showToast('❌ Error deleting transaction', 'error');
    }
}

// Toast notification function
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    
    toast.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
    
    return toast;
}

// Handle receipt file selection
const receiptInput = document.getElementById('receipt');
if (receiptInput) {
    receiptInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const label = e.target.parentElement.querySelector('label');
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

// Form submission handler
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const transactionForm = document.getElementById('transactionForm');
        
        if (transactionForm) {
            transactionForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                // Check if firebaseDB is ready
                if (!window.firebaseDB) {
                    showToast('❌ Database not ready. Please refresh the page.', 'error');
                    return;
                }
                
                const amount = parseFloat(document.getElementById('amount').value);
                const category = document.getElementById('category').value;
                const date = document.getElementById('date').value;
                const description = document.getElementById('description').value;
                const type = window.transactionType || 'expense';
                
                const transaction = {
                    type,
                    amount,
                    category,
                    date,
                    description
                };
                
                const submitBtn = transactionForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin mr-2"></i>Saving...';
                submitBtn.disabled = true;
                
                try {
                    let result;
                    
                    // Check if editing
                    if (window.editingTransactionId) {
                        result = await window.firebaseDB.updateTransaction(window.editingTransactionId, transaction);
                        if (result.success) {
                            showToast('✅ Transaction updated successfully!', 'success');
                        }
                    } else {
                        result = await window.firebaseDB.addTransaction(transaction);
                        if (result.success) {
                            showToast('✅ Transaction added successfully!', 'success');
                        }
                    }
                    
                    if (result.success) {
                        // Reset edit mode
                        window.editingTransactionId = null;
                        
                        // Close modal
                        if (typeof window.closeModal === 'function') {
                            window.closeModal();
                        }
                        
                        // Reset modal title and button
                        const modal = document.getElementById('transactionModal');
                        const modalTitle = modal.querySelector('h2');
                        modalTitle.textContent = 'Add Transaction';
                        submitBtn.innerHTML = '<i class="fa fa-plus mr-2"></i>Add Transaction';
                        
                        // Reload transactions
                        await loadTransactions();
                    } else {
                        showToast('❌ Error: ' + result.error, 'error');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    showToast('❌ Error saving transaction', 'error');
                } finally {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            });
            
            console.log('✅ Form submission handler attached');
        }
        
        // Load initial transactions
        loadTransactions();
    }, 1000);
});

console.log('✅ firebase-integration.js loaded');