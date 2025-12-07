// ============= TRANSACTION MODAL FUNCTIONALITY =============
const modal = document.getElementById('transactionModal');
const addTransactionBtns = document.querySelectorAll('.add-transaction-btn');
const closeModalBtn = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const expenseBtn = document.getElementById('expenseBtn');
const incomeBtn = document.getElementById('incomeBtn');
const transactionForm = document.getElementById('transactionForm');

// Make transactionType globally accessible
window.transactionType = 'expense'; // default type (This is fine)
// Track if buttons have been clicked to prevent auto-reset
let userHasSelectedType = false;

// Open modal when clicking any "Add Transaction" button
addTransactionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        userHasSelectedType = false; 
        setTransactionType(window.transactionType); 
        
        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
    });
});

// Close modal functions
function closeModal() {
    modal.classList.add('hidden');
    transactionForm.reset();
    userHasSelectedType = false;
}
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Transaction type toggle
function setTransactionType(type) {
    window.transactionType = type; // Update global variable
    console.log('Transaction type set to:', type); // Debug log
    if (type === 'expense') {
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
}

// Button click handlers - only these should change the type
expenseBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    userHasSelectedType = true;
    setTransactionType('expense');
    console.log('✅ USER CLICKED EXPENSE - Type is now:', window.transactionType);
});
incomeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    userHasSelectedType = true;
    setTransactionType('income');
    console.log('✅ USER CLICKED INCOME - Type is now:', window.transactionType);
});

// Prevent any other clicks from resetting the type
transactionForm.addEventListener('click', (e) => {
    // Don't let clicks inside the form reset the transaction type
    e.stopPropagation();
});

// Make closeModal globally accessible
window.closeModal = closeModal;

// Debug: Log the transaction type right before form submission
window.addEventListener('beforeunload', () => {
    console.log('Final transaction type:', window.transactionType);
});


