


// Firebase Configuration - Replace with your actual config
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
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc, 
    doc, 
    onSnapshot 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Wrap everything in DOMContentLoaded to ensure DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    
    let categories = [];
    let editingCategoryId = null;

    // Color mapping
    const colorClasses = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        red: 'bg-red-500',
        orange: 'bg-orange-500',
        purple: 'bg-purple-500',
        yellow: 'bg-yellow-500',
        pink: 'bg-pink-500',
        indigo: 'bg-indigo-500'
    };

    // DOM elements
    const modal = document.getElementById('categoryModal');
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const categoryForm = document.getElementById('categoryForm');
    const modalTitle = modal ? modal.querySelector('h3') : null;
    const submitBtn = categoryForm ? categoryForm.querySelector('button[type="submit"]') : null;

    // Check if elements exist before adding listeners
    if (!modal || !addCategoryBtn || !closeModalBtn || !cancelBtn || !categoryForm) {
        console.error('Category elements not found');
        return;
    }

    // Show modal
    function showModal(isEdit = false) {
        modal.classList.remove('hidden');
        if (isEdit) {
            if (modalTitle) modalTitle.textContent = 'Edit Category';
            if (submitBtn) submitBtn.textContent = 'Update';
        } else {
            if (modalTitle) modalTitle.textContent = 'Add New Category';
            if (submitBtn) submitBtn.textContent = 'Create';
            editingCategoryId = null;
        }
        document.getElementById('categoryName').focus();
    }

    // Hide modal
    function hideModal() {
        modal.classList.add('hidden');
        categoryForm.reset();
        editingCategoryId = null;
    }

    // Load categories from Firestore with real-time updates
    function loadCategories() {
        const categoriesRef = collection(db, 'categories');
        
        // Real-time listener - updates automatically when data changes
        onSnapshot(categoriesRef, (snapshot) => {
            categories = [];
            snapshot.forEach((docSnap) => {
                categories.push({
                    id: docSnap.id,
                    ...docSnap.data()
                });
            });
            renderCategories();
        }, (error) => {
            console.error('Error loading categories:', error);
            alert('Error loading categories from Firestore. Check console for details.');
        });
    }

    // Render categories
    function renderCategories() {
        const incomeContainer = document.getElementById('incomeCategories');
        const expenseContainer = document.getElementById('expenseCategories');
        
        // Only render if containers exist
        if (!incomeContainer || !expenseContainer) {
            return;
        }
        
        const incomeCategories = categories.filter(c => c.type === 'income');
        const expenseCategories = categories.filter(c => c.type === 'expense');

        // Update counts
        const incomeCount = document.getElementById('incomeCount');
        const expenseCount = document.getElementById('expenseCount');
        
        if (incomeCount) incomeCount.textContent = incomeCategories.length;
        if (expenseCount) expenseCount.textContent = expenseCategories.length;

        // Render income categories
        incomeContainer.innerHTML = incomeCategories.map(cat => `
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div class="flex items-center gap-3">
                    <div class="w-3 h-3 ${colorClasses[cat.color]} rounded-full"></div>
                    <div class="flex items-center gap-2">
                        <h4 class="font-semibold text-gray-800">${cat.name}</h4>
                        <span class="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-lg">Income</span>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button class="edit-category-btn p-2 hover:bg-gray-200 rounded transition" data-id="${cat.id}">
                        <i class="fa fa-pencil text-gray-600"></i>
                    </button>
                    <button class="delete-category-btn p-2 hover:bg-gray-200 rounded transition" data-id="${cat.id}">
                        <i class="fa fa-trash text-gray-600"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Render expense categories
        expenseContainer.innerHTML = expenseCategories.map(cat => `
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div class="flex items-center gap-3">
                    <div class="w-3 h-3 ${colorClasses[cat.color]} rounded-full"></div>
                    <div class="flex items-center gap-2">
                        <h4 class="font-semibold text-gray-800">${cat.name}</h4>
                        <span class="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded-lg">Expense</span>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button class="edit-category-btn p-2 hover:bg-gray-200 rounded transition" data-id="${cat.id}">
                        <i class="fa fa-pencil text-gray-600"></i>
                    </button>
                    <button class="delete-category-btn p-2 hover:bg-gray-200 rounded transition" data-id="${cat.id}">
                        <i class="fa fa-trash text-gray-600"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners to dynamically created buttons
        document.querySelectorAll('.delete-category-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                deleteCategory(this.dataset.id);
            });
        });

        document.querySelectorAll('.edit-category-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                editCategory(this.dataset.id);
            });
        });
    }

    // Add category to Firestore
    async function addCategory(name, type, color) {
        try {
            await addDoc(collection(db, 'categories'), {
                name: name,
                type: type,
                color: color,
                createdAt: new Date().toISOString()
            });
            console.log('✅ Category added successfully');
        } catch (error) {
            console.error('❌ Error adding category:', error);
            alert('Error adding category. Check console for details.');
        }
    }

    // Update category in Firestore
    async function updateCategory(id, name, type, color) {
        try {
            const categoryRef = doc(db, 'categories', id);
            await updateDoc(categoryRef, {
                name: name,
                type: type,
                color: color,
                updatedAt: new Date().toISOString()
            });
            console.log('✅ Category updated successfully');
        } catch (error) {
            console.error('❌ Error updating category:', error);
            alert('Error updating category. Check console for details.');
        }
    }

    // Delete category from Firestore
    async function deleteCategory(id) {
        if (confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteDoc(doc(db, 'categories', id));
                console.log('✅ Category deleted successfully');
            } catch (error) {
                console.error('❌ Error deleting category:', error);
                alert('Error deleting category. Check console for details.');
            }
        }
    }

    // Edit category - populate form with existing data
    function editCategory(id) {
        const category = categories.find(c => c.id === id);
        if (category) {
            editingCategoryId = id;
            document.getElementById('categoryName').value = category.name;
            document.getElementById('categoryType').value = category.type;
            document.getElementById('categoryColor').value = category.color;
            showModal(true);
        }
    }

    // Event listeners
    addCategoryBtn.addEventListener('click', () => showModal(false));
    closeModalBtn.addEventListener('click', hideModal);
    cancelBtn.addEventListener('click', hideModal);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    // Handle form submission
    categoryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('categoryName').value.trim();
        const type = document.getElementById('categoryType').value;
        const color = document.getElementById('categoryColor').value;

        if (name) {
            if (editingCategoryId) {
                // Update existing category
                await updateCategory(editingCategoryId, name, type, color);
            } else {
                // Add new category
                await addCategory(name, type, color);
            }
            hideModal();
        }
    });

    // Initial load from Firestore
    loadCategories();
});