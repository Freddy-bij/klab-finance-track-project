// transaction-firestore.js
import { db } from "./firebase-config.js";
import { 
    collection, 
    addDoc, 
    getDocs, 
    deleteDoc, 
    doc, 
    updateDoc, 
    query, 
    where 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Collection reference (assuming you have a 'transactions' collection)
const transactionsColRef = collection(db, "transactions");

/**
 * Saves a new transaction to Firestore.
 * @param {object} transactionData - { type, description, amount, date, category, userId }
 */
export async function saveTransaction(transactionData) {
    try {
        const docRef = await addDoc(transactionsColRef, transactionData);
        console.log("Transaction saved with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
}

/**
 * Reads all transactions for a specific user from Firestore.
 * @param {string} userId - The current user's ID.
 * @returns {Array<object>} - Array of transactions with their Firestore ID.
 */
export async function getTransactions(userId) {
    try {
        // Create a query to only fetch transactions belonging to the current user
        const q = query(transactionsColRef, where("userId", "==", userId));
        const snapshot = await getDocs(q);
        
        const transactionsList = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id // Include the Firestore document ID
        }));
        
        console.log("Fetched transactions:", transactionsList.length);
        return transactionsList;
    } catch (e) {
        console.error("Error fetching documents: ", e);
        return [];
    }
}

/**
 * Updates an existing transaction in Firestore.
 * @param {string} transactionId - The Firestore document ID.
 * @param {object} newData - The updated data fields.
 */
export async function updateTransaction(transactionId, newData) {
    try {
        const transactionDocRef = doc(db, "transactions", transactionId);
        await updateDoc(transactionDocRef, newData);
        console.log("Transaction updated successfully:", transactionId);
    } catch (e) {
        console.error("Error updating document: ", e);
        throw e;
    }
}

/**
 * Deletes a transaction from Firestore.
 * @param {string} transactionId - The Firestore document ID.
 */
export async function deleteTransaction(transactionId) {
    try {
        const transactionDocRef = doc(db, "transactions", transactionId);
        await deleteDoc(transactionDocRef);
        console.log("Transaction deleted successfully:", transactionId);
    } catch (e) {
        console.error("Error deleting document: ", e);
        throw e;
    }
}