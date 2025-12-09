// Wrap everything in DOMContentLoaded to ensure DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    
    // Initial categories data
    let categories = [
        { id: 1, name: 'Salary', type: 'income', color: 'green' },
        { id: 2, name: 'Freelance', type: 'income', color: 'green' },
        { id: 3, name: 'Food', type: 'expense', color: 'orange' },
        { id: 4, name: 'Entertainment', type: 'expense', color: 'purple' },
        { id: 5, name: 'Transportation', type: 'expense', color: 'red' },
        { id: 6, name: 'Utilities', type: 'expense', color: 'yellow' }
    ];

    let nextId = 7;

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

    // Check if elements exist before adding listeners
    if (!modal || !addCategoryBtn || !closeModalBtn || !cancelBtn || !categoryForm) {
        console.error('Category elements not found');
        return;
    }

    // Show modal
    function showModal() {
        modal.classList.remove('hidden');
        document.getElementById('categoryName').focus();
    }

    // Hide modal
    function hideModal() {
        modal.classList.add('hidden');
        categoryForm.reset();
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
                deleteCategory(parseInt(this.dataset.id));
            });
        });

        document.querySelectorAll('.edit-category-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                editCategory(parseInt(this.dataset.id));
            });
        });
    }

    // Add category
    function addCategory(name, type, color) {
        categories.push({
            id: nextId++,
            name: name,
            type: type,
            color: color
        });
        renderCategories();
    }

    // Delete category
    function deleteCategory(id) {
        if (confirm('Are you sure you want to delete this category?')) {
            categories = categories.filter(c => c.id !== id);
            renderCategories();
        }
    }

    // Edit category (placeholder)
    function editCategory(id) {
        alert('Edit functionality coming soon!');
    }

    // Event listeners
    addCategoryBtn.addEventListener('click', showModal);
    closeModalBtn.addEventListener('click', hideModal);
    cancelBtn.addEventListener('click', hideModal);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    // Handle form submission
    categoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('categoryName').value.trim();
        const type = document.getElementById('categoryType').value;
        const color = document.getElementById('categoryColor').value;

        if (name) {
            addCategory(name, type, color);
            hideModal();
        }
    });

    // Initial render
    renderCategories();
});