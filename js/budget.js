/* ===================================
   BookJapan.gg - Budget Tool
   Automatic and manual budget planning
   =================================== */

const BudgetTool = {
    budgetCategories: [
        { name: 'Accommodation', icon: 'fa-hotel', color: '#4A5F8C', defaultPercent: 30 },
        { name: 'Food & Dining', icon: 'fa-utensils', color: '#FFB7C5', defaultPercent: 25 },
        { name: 'Transportation', icon: 'fa-train', color: '#88A47C', defaultPercent: 15 },
        { name: 'Activities & Entertainment', icon: 'fa-ticket-alt', color: '#2E3A59', defaultPercent: 15 },
        { name: 'Shopping', icon: 'fa-shopping-bag', color: '#FF8FA3', defaultPercent: 10 },
        { name: 'Emergency Fund', icon: 'fa-first-aid', color: '#D97706', defaultPercent: 5 }
    ],
    
    // Daily spending recommendations for Japan (in EUR)
    dailyBudgetTiers: {
        budget: { name: 'Budget Traveler', min: 50, max: 80, description: 'Hostels, convenience store meals, free activities' },
        moderate: { name: 'Moderate', min: 80, max: 150, description: 'Mid-range hotels, restaurants, popular attractions' },
        comfortable: { name: 'Comfortable', min: 150, max: 250, description: 'Nice hotels, quality dining, premium experiences' },
        luxury: { name: 'Luxury', min: 250, max: 500, description: 'Top hotels, fine dining, exclusive experiences' }
    },
    
    chartInstance: null,
    
    init() {
        this.renderBudgetPage();
        this.setupBudgetEventListeners();
        this.loadBudgetData();
    },
    
    renderBudgetPage() {
        const container = document.getElementById('page-budget');
        if (!container) return;
        
        container.innerHTML = `
            <div class="page-header mb-8">
                <h2 class="text-4xl font-display font-bold text-japan-indigo mb-2">Budget Planner</h2>
                <p class="text-gray-600">Plan and track your trip expenses</p>
            </div>
            
            <!-- Budget Tabs -->
            <div class="mb-8">
                <div class="flex gap-2 border-b border-gray-200">
                    <button class="budget-tab active" data-tab="automatic">
                        <i class="fas fa-magic"></i>
                        <span>Automatic Planner</span>
                    </button>
                    <button class="budget-tab" data-tab="manual">
                        <i class="fas fa-edit"></i>
                        <span>Manual Planner</span>
                    </button>
                    <button class="budget-tab" data-tab="tracker">
                        <i class="fas fa-chart-line"></i>
                        <span>Expense Tracker</span>
                    </button>
                </div>
            </div>
            
            <!-- Automatic Budget Tab -->
            <div id="tab-automatic" class="budget-tab-content active">
                <div class="dashboard-card mb-6">
                    <h3 class="text-xl font-semibold text-japan-indigo mb-4">Quick Budget Calculator</h3>
                    <p class="text-gray-600 mb-6">Enter your total budget and trip duration for automatic breakdown</p>
                    
                    <form id="auto-budget-form" class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="form-group">
                                <label class="form-label">
                                    <i class="fas fa-euro-sign text-matcha"></i>
                                    Total Budget (€)
                                </label>
                                <input type="number" id="auto-total-budget" class="form-input" 
                                       placeholder="e.g., 2000" min="0" step="50" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">
                                    <i class="fas fa-calendar-alt text-japan-blue"></i>
                                    Trip Duration (days)
                                </label>
                                <input type="number" id="auto-trip-days" class="form-input" 
                                       placeholder="e.g., 14" min="1" max="90" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">
                                <i class="fas fa-user text-sakura-dark"></i>
                                Travel Style
                            </label>
                            <select id="auto-travel-style" class="form-select">
                                <option value="budget">Budget Traveler (€50-80/day)</option>
                                <option value="moderate" selected>Moderate (€80-150/day)</option>
                                <option value="comfortable">Comfortable (€150-250/day)</option>
                                <option value="luxury">Luxury (€250+/day)</option>
                            </select>
                        </div>
                        
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-calculator"></i>
                            <span>Calculate Budget</span>
                        </button>
                    </form>
                </div>
                
                <!-- Auto Budget Results -->
                <div id="auto-budget-results" class="hidden">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <!-- Summary Card -->
                        <div class="dashboard-card">
                            <h4 class="text-lg font-semibold text-japan-indigo mb-4">Budget Summary</h4>
                            <div class="space-y-3">
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600">Total Budget:</span>
                                    <span class="text-2xl font-bold text-japan-indigo" id="auto-total-display">€0</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600">Trip Duration:</span>
                                    <span class="text-lg font-semibold text-japan-blue" id="auto-days-display">0 days</span>
                                </div>
                                <div class="divider"></div>
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600">Daily Budget:</span>
                                    <span class="text-xl font-bold text-matcha" id="auto-daily-display">€0</span>
                                </div>
                                <div id="auto-recommendation" class="bg-ivory rounded-lg p-3 text-sm text-gray-700">
                                    <!-- Recommendation will appear here -->
                                </div>
                            </div>
                        </div>
                        
                        <!-- Chart -->
                        <div class="dashboard-card">
                            <h4 class="text-lg font-semibold text-japan-indigo mb-4">Budget Breakdown</h4>
                            <canvas id="auto-budget-chart" height="250"></canvas>
                        </div>
                    </div>
                    
                    <!-- Category Breakdown -->
                    <div class="dashboard-card">
                        <h4 class="text-lg font-semibold text-japan-indigo mb-4">Category Breakdown</h4>
                        <div id="auto-categories" class="space-y-3">
                            <!-- Will be populated dynamically -->
                        </div>
                        
                        <div class="mt-6 flex gap-3">
                            <button id="save-auto-budget-btn" class="btn btn-primary">
                                <i class="fas fa-save"></i>
                                <span>Save Budget Plan</span>
                            </button>
                            <button id="use-as-manual-btn" class="btn btn-secondary">
                                <i class="fas fa-edit"></i>
                                <span>Customize in Manual</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Manual Budget Tab -->
            <div id="tab-manual" class="budget-tab-content">
                <div class="dashboard-card mb-6">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h3 class="text-xl font-semibold text-japan-indigo">Manual Budget</h3>
                            <p class="text-sm text-gray-600">Create your custom budget breakdown</p>
                        </div>
                        <button id="add-category-btn" class="btn btn-primary">
                            <i class="fas fa-plus"></i>
                            <span>Add Category</span>
                        </button>
                    </div>
                    
                    <div class="form-group mb-6">
                        <label class="form-label">Total Budget (€)</label>
                        <input type="number" id="manual-total-budget" class="form-input" 
                               placeholder="e.g., 2000" min="0" step="50">
                    </div>
                    
                    <div id="manual-categories" class="space-y-3 mb-6">
                        <!-- Will be populated dynamically -->
                    </div>
                    
                    <div class="bg-ivory rounded-lg p-4 mb-6">
                        <div class="flex justify-between items-center">
                            <span class="font-semibold text-japan-indigo">Total Allocated:</span>
                            <span class="text-2xl font-bold" id="manual-allocated">€0</span>
                        </div>
                        <div class="flex justify-between items-center mt-2">
                            <span class="text-sm text-gray-600">Remaining:</span>
                            <span class="text-lg font-semibold" id="manual-remaining">€0</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2 mt-3">
                            <div id="manual-progress-bar" class="bg-gradient-to-r from-matcha to-japan-blue h-2 rounded-full transition-all" 
                                 style="width: 0%"></div>
                        </div>
                    </div>
                    
                    <button id="save-manual-budget-btn" class="btn btn-primary">
                        <i class="fas fa-save"></i>
                        <span>Save Budget</span>
                    </button>
                </div>
                
                <!-- Manual Budget Chart -->
                <div class="dashboard-card">
                    <h4 class="text-lg font-semibold text-japan-indigo mb-4">Your Budget Breakdown</h4>
                    <canvas id="manual-budget-chart" height="250"></canvas>
                </div>
            </div>
            
            <!-- Expense Tracker Tab -->
            <div id="tab-tracker" class="budget-tab-content">
                <div class="dashboard-card mb-6">
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h3 class="text-xl font-semibold text-japan-indigo">Expense Tracker</h3>
                            <p class="text-sm text-gray-600">Track your actual spending during the trip</p>
                        </div>
                        <button id="add-expense-btn" class="btn btn-primary">
                            <i class="fas fa-plus"></i>
                            <span>Add Expense</span>
                        </button>
                    </div>
                    
                    <!-- Expense Summary -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div class="bg-ivory rounded-lg p-4">
                            <p class="text-sm text-gray-600 mb-1">Total Budget</p>
                            <p class="text-2xl font-bold text-japan-indigo" id="tracker-budget">€0</p>
                        </div>
                        <div class="bg-ivory rounded-lg p-4">
                            <p class="text-sm text-gray-600 mb-1">Total Spent</p>
                            <p class="text-2xl font-bold text-sakura-dark" id="tracker-spent">€0</p>
                        </div>
                        <div class="bg-ivory rounded-lg p-4">
                            <p class="text-sm text-gray-600 mb-1">Remaining</p>
                            <p class="text-2xl font-bold text-matcha" id="tracker-remaining">€0</p>
                        </div>
                    </div>
                    
                    <!-- Expenses List -->
                    <div id="expenses-list" class="space-y-2">
                        <!-- Will be populated dynamically -->
                    </div>
                </div>
            </div>
        `;
    },
    
    setupBudgetEventListeners() {
        // Tab switching
        document.querySelectorAll('.budget-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });
        
        // Automatic budget form
        const autoForm = document.getElementById('auto-budget-form');
        if (autoForm) {
            autoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.calculateAutoBudget();
            });
        }
        
        // Save auto budget
        document.addEventListener('click', (e) => {
            if (e.target.id === 'save-auto-budget-btn' || e.target.closest('#save-auto-budget-btn')) {
                this.saveAutoBudget();
            }
            if (e.target.id === 'use-as-manual-btn' || e.target.closest('#use-as-manual-btn')) {
                this.useAsManual();
            }
        });
        
        // Manual budget
        const manualTotalInput = document.getElementById('manual-total-budget');
        if (manualTotalInput) {
            manualTotalInput.addEventListener('input', () => this.updateManualBudget());
        }
        
        const addCategoryBtn = document.getElementById('add-category-btn');
        if (addCategoryBtn) {
            addCategoryBtn.addEventListener('click', () => this.showAddCategoryModal());
        }
        
        const saveManualBtn = document.getElementById('save-manual-budget-btn');
        if (saveManualBtn) {
            saveManualBtn.addEventListener('click', () => this.saveManualBudget());
        }
        
        // Expense tracker
        const addExpenseBtn = document.getElementById('add-expense-btn');
        if (addExpenseBtn) {
            addExpenseBtn.addEventListener('click', () => this.showAddExpenseModal());
        }
    },
    
    switchTab(tabName) {
        // Update tabs
        document.querySelectorAll('.budget-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            }
        });
        
        // Update content
        document.querySelectorAll('.budget-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const targetContent = document.getElementById(`tab-${tabName}`);
        if (targetContent) {
            targetContent.classList.add('active');
        }
        
        // Load data for tab
        if (tabName === 'manual') {
            this.loadManualBudget();
        } else if (tabName === 'tracker') {
            this.loadExpenseTracker();
        }
    },
    
    calculateAutoBudget() {
        const totalBudget = parseFloat(document.getElementById('auto-total-budget').value);
        const tripDays = parseInt(document.getElementById('auto-trip-days').value);
        const travelStyle = document.getElementById('auto-travel-style').value;
        
        if (!totalBudget || !tripDays) {
            App.showInAppNotification('Please fill in all fields', 'warning');
            return;
        }
        
        const dailyBudget = totalBudget / tripDays;
        const tier = this.dailyBudgetTiers[travelStyle];
        
        // Show results
        document.getElementById('auto-budget-results').classList.remove('hidden');
        
        // Update summary
        document.getElementById('auto-total-display').textContent = App.formatCurrency(totalBudget);
        document.getElementById('auto-days-display').textContent = `${tripDays} days`;
        document.getElementById('auto-daily-display').textContent = App.formatCurrency(dailyBudget);
        
        // Recommendation
        const recommendationEl = document.getElementById('auto-recommendation');
        let recommendation = '';
        
        if (dailyBudget < tier.min) {
            recommendation = `<i class="fas fa-info-circle text-yellow-600 mr-2"></i>Your daily budget (${App.formatCurrency(dailyBudget)}) is below the recommended ${tier.name} range (${App.formatCurrency(tier.min)}-${App.formatCurrency(tier.max)}). Consider increasing your budget or adjusting expectations.`;
        } else if (dailyBudget > tier.max) {
            recommendation = `<i class="fas fa-check-circle text-matcha mr-2"></i>Great! Your daily budget (${App.formatCurrency(dailyBudget)}) exceeds the ${tier.name} range, giving you flexibility for premium experiences.`;
        } else {
            recommendation = `<i class="fas fa-check-circle text-matcha mr-2"></i>Perfect! Your daily budget (${App.formatCurrency(dailyBudget)}) fits well within the ${tier.name} range (${App.formatCurrency(tier.min)}-${App.formatCurrency(tier.max)}).`;
        }
        
        recommendationEl.innerHTML = recommendation;
        
        // Calculate category breakdown
        const breakdown = this.budgetCategories.map(cat => ({
            ...cat,
            amount: (totalBudget * cat.defaultPercent / 100)
        }));
        
        // Display categories
        const categoriesContainer = document.getElementById('auto-categories');
        categoriesContainer.innerHTML = breakdown.map(cat => `
            <div class="flex items-center justify-between p-3 bg-ivory rounded-lg">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center" 
                         style="background-color: ${cat.color}20;">
                        <i class="fas ${cat.icon}" style="color: ${cat.color};"></i>
                    </div>
                    <div>
                        <p class="font-semibold text-japan-indigo">${cat.name}</p>
                        <p class="text-xs text-gray-600">${cat.defaultPercent}% of budget</p>
                    </div>
                </div>
                <p class="text-lg font-bold" style="color: ${cat.color};">${App.formatCurrency(cat.amount)}</p>
            </div>
        `).join('');
        
        // Create/update chart
        this.createAutoBudgetChart(breakdown);
        
        // Scroll to results
        document.getElementById('auto-budget-results').scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Store for potential save
        this.currentAutoBudget = {
            totalBudget,
            tripDays,
            travelStyle,
            dailyBudget,
            breakdown
        };
    },
    
    createAutoBudgetChart(breakdown) {
        const ctx = document.getElementById('auto-budget-chart');
        if (!ctx) return;
        
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }
        
        this.chartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: breakdown.map(cat => cat.name),
                datasets: [{
                    data: breakdown.map(cat => cat.amount),
                    backgroundColor: breakdown.map(cat => cat.color),
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: { family: 'Lexend', size: 12 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                return `${label}: €${value.toFixed(2)}`;
                            }
                        }
                    }
                }
            }
        });
    },
    
    saveAutoBudget() {
        if (!this.currentAutoBudget) {
            App.showInAppNotification('Please calculate budget first', 'warning');
            return;
        }
        
        App.data.budget = {
            type: 'automatic',
            ...this.currentAutoBudget,
            createdAt: new Date().toISOString()
        };
        
        App.saveData();
        App.updateDashboardStats();
        App.addActivity('fas fa-wallet', 'Created automatic budget plan', 'budget');
        App.showInAppNotification('Budget plan saved!', 'success');
    },
    
    useAsManual() {
        if (!this.currentAutoBudget) {
            App.showInAppNotification('Please calculate budget first', 'warning');
            return;
        }
        
        // Set manual budget data
        App.data.budget = {
            type: 'manual',
            totalBudget: this.currentAutoBudget.totalBudget,
            categories: this.currentAutoBudget.breakdown.map(cat => ({
                id: App.generateId(),
                name: cat.name,
                icon: cat.icon,
                color: cat.color,
                amount: cat.amount
            })),
            expenses: []
        };
        
        App.saveData();
        
        // Switch to manual tab
        this.switchTab('manual');
        App.showInAppNotification('Budget copied to manual planner!', 'success');
    },
    
    loadManualBudget() {
        const totalInput = document.getElementById('manual-total-budget');
        const categoriesContainer = document.getElementById('manual-categories');
        
        if (!App.data.budget || App.data.budget.type !== 'manual') {
            // Initialize with default categories
            if (totalInput) totalInput.value = '';
            if (categoriesContainer) {
                categoriesContainer.innerHTML = `
                    <div class="text-center py-6 text-gray-500">
                        <i class="fas fa-wallet text-3xl mb-2 opacity-50"></i>
                        <p>No budget categories yet. Add your first category!</p>
                    </div>
                `;
            }
            this.updateManualBudget();
            return;
        }
        
        // Load existing budget
        if (totalInput) {
            totalInput.value = App.data.budget.totalBudget || '';
        }
        
        this.renderManualCategories();
        this.updateManualBudget();
    },
    
    renderManualCategories() {
        const container = document.getElementById('manual-categories');
        if (!container || !App.data.budget || !App.data.budget.categories) return;
        
        container.innerHTML = App.data.budget.categories.map(cat => `
            <div class="flex items-center gap-3 p-3 bg-ivory rounded-lg" data-category-id="${cat.id}">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" 
                     style="background-color: ${cat.color}20;">
                    <i class="fas ${cat.icon}" style="color: ${cat.color};"></i>
                </div>
                <div class="flex-1">
                    <p class="font-semibold text-japan-indigo text-sm">${cat.name}</p>
                </div>
                <input type="number" class="form-input w-32 category-amount" 
                       data-category-id="${cat.id}" value="${cat.amount || 0}" min="0" step="10">
                <button class="text-red-500 hover:text-red-600 p-2 delete-category-btn" data-category-id="${cat.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        // Add event listeners
        container.querySelectorAll('.category-amount').forEach(input => {
            input.addEventListener('input', () => this.updateManualBudget());
        });
        
        container.querySelectorAll('.delete-category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const categoryId = e.currentTarget.dataset.categoryId;
                this.deleteManualCategory(categoryId);
            });
        });
    },
    
    updateManualBudget() {
        const totalBudget = parseFloat(document.getElementById('manual-total-budget')?.value) || 0;
        
        // Calculate allocated amount
        let allocated = 0;
        document.querySelectorAll('.category-amount').forEach(input => {
            const amount = parseFloat(input.value) || 0;
            allocated += amount;
            
            // Update in data
            if (App.data.budget && App.data.budget.categories) {
                const category = App.data.budget.categories.find(c => c.id === input.dataset.categoryId);
                if (category) {
                    category.amount = amount;
                }
            }
        });
        
        const remaining = totalBudget - allocated;
        const percentage = totalBudget > 0 ? (allocated / totalBudget) * 100 : 0;
        
        // Update UI
        const allocatedEl = document.getElementById('manual-allocated');
        const remainingEl = document.getElementById('manual-remaining');
        const progressBar = document.getElementById('manual-progress-bar');
        
        if (allocatedEl) {
            allocatedEl.textContent = App.formatCurrency(allocated);
        }
        
        if (remainingEl) {
            remainingEl.textContent = App.formatCurrency(remaining);
            remainingEl.style.color = remaining < 0 ? '#EF4444' : '#88A47C';
        }
        
        if (progressBar) {
            progressBar.style.width = `${Math.min(percentage, 100)}%`;
            progressBar.style.background = percentage > 100 
                ? 'linear-gradient(90deg, #EF4444, #DC2626)' 
                : 'linear-gradient(90deg, #88A47C, #4A5F8C)';
        }
        
        // Update chart
        this.updateManualChart();
    },
    
    updateManualChart() {
        const ctx = document.getElementById('manual-budget-chart');
        if (!ctx || !App.data.budget || !App.data.budget.categories) return;
        
        const categories = App.data.budget.categories.filter(cat => cat.amount > 0);
        
        if (this.manualChartInstance) {
            this.manualChartInstance.destroy();
        }
        
        if (categories.length === 0) {
            return;
        }
        
        this.manualChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categories.map(cat => cat.name),
                datasets: [{
                    data: categories.map(cat => cat.amount),
                    backgroundColor: categories.map(cat => cat.color),
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: { family: 'Lexend', size: 12 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                return `${label}: €${value.toFixed(2)}`;
                            }
                        }
                    }
                }
            }
        });
    },
    
    showAddCategoryModal() {
        const modal = TripPlanner.createModal('Add Budget Category', `
            <form id="add-category-form" class="space-y-4">
                <div class="form-group">
                    <label class="form-label">Category Name</label>
                    <input type="text" id="category-name" class="form-input" 
                           placeholder="e.g., Souvenirs" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Amount (€)</label>
                    <input type="number" id="category-amount" class="form-input" 
                           placeholder="e.g., 200" min="0" step="10" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Icon</label>
                    <select id="category-icon" class="form-select">
                        <option value="fa-shopping-cart">Shopping Cart</option>
                        <option value="fa-gift">Gift</option>
                        <option value="fa-camera">Camera</option>
                        <option value="fa-coffee">Coffee</option>
                        <option value="fa-pills">Medical</option>
                        <option value="fa-phone">Phone/SIM</option>
                        <option value="fa-ticket-alt">Tickets</option>
                        <option value="fa-wallet">Wallet</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Color</label>
                    <input type="color" id="category-color" class="form-input" value="#4A5F8C">
                </div>
                
                <div class="flex gap-3">
                    <button type="submit" class="btn btn-primary flex-1">
                        <i class="fas fa-plus"></i>
                        <span>Add Category</span>
                    </button>
                    <button type="button" class="btn btn-outline close-modal">Cancel</button>
                </div>
            </form>
        `);
        
        const form = modal.querySelector('#add-category-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addManualCategory();
            TripPlanner.closeModal(modal);
        });
    },
    
    addManualCategory() {
        if (!App.data.budget || App.data.budget.type !== 'manual') {
            App.data.budget = {
                type: 'manual',
                totalBudget: parseFloat(document.getElementById('manual-total-budget')?.value) || 0,
                categories: [],
                expenses: []
            };
        }
        
        const category = {
            id: App.generateId(),
            name: document.getElementById('category-name').value,
            amount: parseFloat(document.getElementById('category-amount').value),
            icon: document.getElementById('category-icon').value,
            color: document.getElementById('category-color').value
        };
        
        App.data.budget.categories.push(category);
        App.saveData();
        
        this.renderManualCategories();
        this.updateManualBudget();
        App.showInAppNotification('Category added!', 'success');
    },
    
    deleteManualCategory(categoryId) {
        if (!confirm('Delete this category?')) return;
        
        if (App.data.budget && App.data.budget.categories) {
            App.data.budget.categories = App.data.budget.categories.filter(c => c.id !== categoryId);
            App.saveData();
            
            this.renderManualCategories();
            this.updateManualBudget();
            App.showInAppNotification('Category deleted', 'success');
        }
    },
    
    saveManualBudget() {
        const totalBudget = parseFloat(document.getElementById('manual-total-budget')?.value);
        
        if (!totalBudget || totalBudget <= 0) {
            App.showInAppNotification('Please enter a valid total budget', 'warning');
            return;
        }
        
        if (App.data.budget) {
            App.data.budget.totalBudget = totalBudget;
        }
        
        App.saveData();
        App.updateDashboardStats();
        App.addActivity('fas fa-wallet', 'Updated manual budget', 'budget');
        App.showInAppNotification('Budget saved!', 'success');
    },
    
    loadExpenseTracker() {
        if (!App.data.budget) {
            document.getElementById('tracker-budget').textContent = '€0';
            document.getElementById('tracker-spent').textContent = '€0';
            document.getElementById('tracker-remaining').textContent = '€0';
            
            const list = document.getElementById('expenses-list');
            if (list) {
                list.innerHTML = `
                    <div class="text-center py-8 text-gray-500">
                        <i class="fas fa-receipt text-4xl mb-3 opacity-50"></i>
                        <p>No budget set yet. Create a budget first!</p>
                    </div>
                `;
            }
            return;
        }
        
        const totalBudget = App.data.budget.totalBudget || 0;
        const expenses = App.data.budget.expenses || [];
        const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const remaining = totalBudget - totalSpent;
        
        document.getElementById('tracker-budget').textContent = App.formatCurrency(totalBudget);
        document.getElementById('tracker-spent').textContent = App.formatCurrency(totalSpent);
        document.getElementById('tracker-remaining').textContent = App.formatCurrency(remaining);
        
        // Render expenses
        const list = document.getElementById('expenses-list');
        if (!list) return;
        
        if (expenses.length === 0) {
            list.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-receipt text-4xl mb-3 opacity-50"></i>
                    <p>No expenses recorded yet</p>
                </div>
            `;
            return;
        }
        
        list.innerHTML = expenses.map(expense => `
            <div class="flex items-center justify-between p-3 bg-ivory rounded-lg hover:bg-gray-50 transition-colors">
                <div class="flex items-center gap-3 flex-1">
                    <div class="w-10 h-10 rounded-lg bg-japan-blue/10 flex items-center justify-center">
                        <i class="fas fa-receipt text-japan-blue"></i>
                    </div>
                    <div class="flex-1">
                        <p class="font-semibold text-japan-indigo">${expense.description}</p>
                        <p class="text-xs text-gray-600">
                            ${expense.category} • ${new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <p class="text-lg font-bold text-sakura-dark">${App.formatCurrency(expense.amount)}</p>
                    <button class="text-red-500 hover:text-red-600 p-2 delete-expense-btn" data-expense-id="${expense.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add delete listeners
        list.querySelectorAll('.delete-expense-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const expenseId = e.currentTarget.dataset.expenseId;
                this.deleteExpense(expenseId);
            });
        });
    },
    
    showAddExpenseModal() {
        if (!App.data.budget) {
            App.showInAppNotification('Please create a budget first', 'warning');
            return;
        }
        
        const categories = App.data.budget.categories || this.budgetCategories;
        
        const modal = TripPlanner.createModal('Add Expense', `
            <form id="add-expense-form" class="space-y-4">
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <input type="text" id="expense-description" class="form-input" 
                           placeholder="e.g., Lunch at ramen shop" required>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div class="form-group">
                        <label class="form-label">Amount (€)</label>
                        <input type="number" id="expense-amount" class="form-input" 
                               placeholder="0.00" min="0" step="0.01" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Date</label>
                        <input type="date" id="expense-date" class="form-input" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Category</label>
                    <select id="expense-category" class="form-select" required>
                        ${categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('')}
                    </select>
                </div>
                
                <div class="flex gap-3">
                    <button type="submit" class="btn btn-primary flex-1">
                        <i class="fas fa-plus"></i>
                        <span>Add Expense</span>
                    </button>
                    <button type="button" class="btn btn-outline close-modal">Cancel</button>
                </div>
            </form>
        `);
        
        // Set today's date
        modal.querySelector('#expense-date').valueAsDate = new Date();
        
        const form = modal.querySelector('#add-expense-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addExpense();
            TripPlanner.closeModal(modal);
        });
    },
    
    addExpense() {
        const expense = {
            id: App.generateId(),
            description: document.getElementById('expense-description').value,
            amount: parseFloat(document.getElementById('expense-amount').value),
            date: document.getElementById('expense-date').value,
            category: document.getElementById('expense-category').value
        };
        
        if (!App.data.budget.expenses) {
            App.data.budget.expenses = [];
        }
        
        App.data.budget.expenses.push(expense);
        App.saveData();
        
        this.loadExpenseTracker();
        App.addActivity('fas fa-receipt', `Added expense: ${expense.description}`, 'budget');
        App.showInAppNotification('Expense added!', 'success');
    },
    
    deleteExpense(expenseId) {
        if (!confirm('Delete this expense?')) return;
        
        if (App.data.budget && App.data.budget.expenses) {
            App.data.budget.expenses = App.data.budget.expenses.filter(e => e.id !== expenseId);
            App.saveData();
            
            this.loadExpenseTracker();
            App.showInAppNotification('Expense deleted', 'success');
        }
    },
    
    loadBudgetData() {
        // Load existing budget if available
        if (App.data.budget) {
            if (App.data.budget.type === 'manual') {
                this.switchTab('manual');
            }
        }
    }
};

// Add CSS for tabs
const budgetStyle = document.createElement('style');
budgetStyle.textContent = `
    .budget-tab {
        padding: 0.75rem 1.5rem;
        background: transparent;
        border: none;
        border-bottom: 2px solid transparent;
        color: var(--japan-indigo);
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .budget-tab:hover {
        color: var(--sakura-dark);
    }
    
    .budget-tab.active {
        color: var(--sakura-dark);
        border-bottom-color: var(--sakura-dark);
    }
    
    .budget-tab-content {
        display: none;
    }
    
    .budget-tab-content.active {
        display: block;
        animation: fadeIn 0.3s ease;
    }
`;
document.head.appendChild(budgetStyle);

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        BudgetTool.init();
    });
} else {
    // DOM is already loaded, init immediately
    BudgetTool.init();
}
