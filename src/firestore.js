// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    orderBy, 
    serverTimestamp,
    doc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCcA1SCPkyoxrku-mD1_5GbPDSUfz8XW50",
    authDomain: "finance-track-500fa.firebaseapp.com",
    projectId: "finance-track-500fa",
    storageBucket: "finance-track-500fa.firebasestorage.app",
    messagingSenderId: "90116850858",
    appId: "1:90116850858:web:a6733771feb65d711cbcd3",
    measurementId: "G-21BEF5XHDM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("✅ Firebase initialized successfully!");

// Function to add a transaction to Firestore
export async function addTransaction(transactionData) {
    try {
        const docRef = await addDoc(collection(db, "transactions"), {
            type: transactionData.type,
            amount: parseFloat(transactionData.amount),
            category: transactionData.category,
            description: transactionData.description,
            date: transactionData.date,
            timestamp: serverTimestamp()
        });
        console.log("✅ Transaction added with ID: ", docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("❌ Error adding transaction: ", error);
        return { success: false, error: error.message };
    }
}

// Function to get all transactions from Firestore
export async function getAllTransactions() {
    try {
        const q = query(collection(db, "transactions"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const transactions = [];
        
        querySnapshot.forEach((doc) => {
            transactions.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log(`✅ Retrieved ${transactions.length} transactions`);
        return transactions;
    } catch (error) {
        console.error("❌ Error getting transactions: ", error);
        return [];
    }
}

// 🆕 Function to update an existing transaction
export async function updateTransaction(transactionId, updatedData) {
    try {
        const transactionRef = doc(db, "transactions", transactionId);
        await updateDoc(transactionRef, {
            type: updatedData.type,
            amount: parseFloat(updatedData.amount),
            category: updatedData.category,
            description: updatedData.description,
            date: updatedData.date,
            updatedAt: serverTimestamp()
        });
        
        console.log("✅ Transaction updated successfully:", transactionId);
        return { success: true };
    } catch (error) {
        console.error("❌ Error updating transaction:", error);
        return { success: false, error: error.message };
    }
}

// 🆕 Function to delete a transaction
export async function deleteTransaction(transactionId) {
    try {
        const transactionRef = doc(db, "transactions", transactionId);
        await deleteDoc(transactionRef);
        
        console.log("✅ Transaction deleted successfully:", transactionId);
        return { success: true };
    } catch (error) {
        console.error("❌ Error deleting transaction:", error);
        return { success: false, error: error.message };
    }
}

// Function to calculate statistics
export function calculateStats(transactions) {
    let totalIncome = 0;
    let totalExpense = 0;
    let incomeCount = 0;
    let expenseCount = 0;
    
    transactions.forEach(transaction => {
        if (transaction.type === 'income') {
            totalIncome += transaction.amount;
            incomeCount++;
        } else if (transaction.type === 'expense') {
            totalExpense += transaction.amount;
            expenseCount++;
        }
    });
    
    const balance = totalIncome - totalExpense;
    
    return {
        totalIncome: totalIncome.toFixed(2),
        totalExpense: totalExpense.toFixed(2),
        balance: balance.toFixed(2),
        incomeCount: incomeCount,
        expenseCount: expenseCount,
        totalCount: transactions.length
    };
}

// Make functions available globally for dashboard.js
window.firebaseDB = {
    addTransaction,
    getAllTransactions,
    updateTransaction,      // 🆕 Added
    deleteTransaction,      // 🆕 Added
    calculateStats
};

console.log("✅ Firestore functions ready to use!");