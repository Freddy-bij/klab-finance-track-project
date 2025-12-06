// ============= TRANSACTION MODAL FUNCTIONALITY =============
const modal = document.getElementById('transactionModal');
const addTransactionBtns = document.querySelectorAll('.add-transaction-btn');
const closeModalBtn = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const expenseBtn = document.getElementById('expenseBtn');
const incomeBtn = document.getElementById('incomeBtn');
const transactionForm = document.getElementById('transactionForm');

let transactionType = 'expense'; // default type

// Open modal when clicking any "Add Transaction" button
addTransactionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        setTransactionType('expense'); // default to expense
        
        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
    });
});

// Close modal functions
function closeModal() {
    modal.classList.add('hidden');
    transactionForm.reset();
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
    transactionType = type;
    
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

expenseBtn.addEventListener('click', () => setTransactionType('expense'));
incomeBtn.addEventListener('click', () => setTransactionType('income'));

