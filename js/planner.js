/* ===================================
   BookJapan.gg - Trip Planner
   Day-by-day activity planning
   =================================== */

const TripPlanner = {
    currentView: 'timeline', // timeline or calendar
    
    // Popular Japan activities with icons and categories
    activityTemplates: [
        { name: 'Visit Temple/Shrine', icon: 'fa-torii-gate', category: 'Culture', duration: '2-3 hours' },
        { name: 'Explore District', icon: 'fa-walking', category: 'Sightseeing', duration: '3-4 hours' },
        { name: 'Museum Visit', icon: 'fa-landmark', category: 'Culture', duration: '2-3 hours' },
        { name: 'Shopping', icon: 'fa-shopping-bag', category: 'Shopping', duration: '2-4 hours' },
        { name: 'Restaurant/Dining', icon: 'fa-utensils', category: 'Food', duration: '1-2 hours' },
        { name: 'Onsen/Hot Spring', icon: 'fa-hot-tub', category: 'Relaxation', duration: '2-3 hours' },
        { name: 'Day Trip', icon: 'fa-mountain', category: 'Adventure', duration: 'Full day' },
        { name: 'Night Entertainment', icon: 'fa-moon', category: 'Entertainment', duration: '2-4 hours' },
        { name: 'Park/Garden', icon: 'fa-tree', category: 'Nature', duration: '1-2 hours' },
        { name: 'Train Journey', icon: 'fa-train', category: 'Transport', duration: 'Varies' },
        { name: 'Market Visit', icon: 'fa-store', category: 'Food', duration: '1-2 hours' },
        { name: 'Karaoke', icon: 'fa-microphone', category: 'Entertainment', duration: '2-3 hours' }
    ],
    
    init() {
        this.renderPlannerPage();
        this.setupPlannerEventListeners();
        this.loadTripDays();
    },
    
    renderPlannerPage() {
        const container = document.getElementById('page-planner');
        if (!container) return;
        
        container.innerHTML = `
            <div class="page-header mb-8">
                <h2 class="text-4xl font-display font-bold text-japan-indigo mb-2">Trip Planner</h2>
                <p class="text-gray-600">Plan your perfect Japan itinerary day by day</p>
            </div>
            
            <!-- Trip Overview -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div class="dashboard-card">
                    <div class="flex items-center gap-3 mb-2">
                        <i class="fas fa-calendar-alt text-2xl text-japan-blue"></i>
                        <div>
                            <p class="text-sm text-gray-600">Total Days</p>
                            <h3 class="text-2xl font-bold text-japan-indigo" id="total-days">0</h3>
                        </div>
                    </div>
                </div>
                
                <div class="dashboard-card">
                    <div class="flex items-center gap-3 mb-2">
                        <i class="fas fa-list-check text-2xl text-sakura-dark"></i>
                        <div>
                            <p class="text-sm text-gray-600">Total Activities</p>
                            <h3 class="text-2xl font-bold text-japan-indigo" id="total-activities">0</h3>
                        </div>
                    </div>
                </div>
                
                <div class="dashboard-card">
                    <div class="flex items-center gap-3 mb-2">
                        <i class="fas fa-clock text-2xl text-matcha"></i>
                        <div>
                            <p class="text-sm text-gray-600">Planned Hours</p>
                            <h3 class="text-2xl font-bold text-japan-indigo" id="total-hours">0</h3>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Add Day Button -->
            <div class="mb-6">
                <button id="add-day-btn" class="btn btn-primary">
                    <i class="fas fa-plus-circle"></i>
                    <span>Add New Day</span>
                </button>
                
                <button id="quick-add-btn" class="btn btn-secondary">
                    <i class="fas fa-magic"></i>
                    <span>Quick Add Activities</span>
                </button>
                
                <button id="export-itinerary-btn" class="btn btn-outline">
                    <i class="fas fa-download"></i>
                    <span>Export Itinerary</span>
                </button>
            </div>
            
            <!-- Trip Days Container -->
            <div id="trip-days-container" class="space-y-6">
                <!-- Will be populated dynamically -->
            </div>
            
            <!-- Empty State -->
            <div id="empty-state" class="hidden dashboard-card text-center py-12">
                <i class="fas fa-calendar-plus text-6xl text-gray-300 mb-4"></i>
                <h3 class="text-xl font-semibold text-japan-indigo mb-2">No Days Planned Yet</h3>
                <p class="text-gray-600 mb-4">Start planning your trip by adding your first day</p>
                <button class="btn btn-primary add-first-day-btn">
                    <i class="fas fa-plus-circle"></i>
                    <span>Add First Day</span>
                </button>
            </div>
        `;
    },
    
    setupPlannerEventListeners() {
        // Add day button
        const addDayBtn = document.getElementById('add-day-btn');
        if (addDayBtn) {
            addDayBtn.addEventListener('click', () => this.showAddDayModal());
        }
        
        // Quick add button
        const quickAddBtn = document.getElementById('quick-add-btn');
        if (quickAddBtn) {
            quickAddBtn.addEventListener('click', () => this.showQuickAddModal());
        }
        
        // Export button
        const exportBtn = document.getElementById('export-itinerary-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportItinerary());
        }
        
        // Empty state button
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-first-day-btn') || 
                e.target.closest('.add-first-day-btn')) {
                this.showAddDayModal();
            }
        });
    },
    
    loadTripDays() {
        const container = document.getElementById('trip-days-container');
        const emptyState = document.getElementById('empty-state');
        
        if (!container) return;
        
        if (App.data.tripDays.length === 0) {
            container.innerHTML = '';
            if (emptyState) emptyState.classList.remove('hidden');
            this.updatePlannerStats();
            return;
        }
        
        if (emptyState) emptyState.classList.add('hidden');
        
        // Sort days by date
        App.data.tripDays.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        container.innerHTML = App.data.tripDays.map((day, index) => this.renderDayCard(day, index)).join('');
        
        // Add event listeners for each day
        this.attachDayEventListeners();
        this.updatePlannerStats();
    },
    
    renderDayCard(day, index) {
        const dayNumber = index + 1;
        const totalActivities = day.activities ? day.activities.length : 0;
        
        return `
            <div class="dashboard-card" data-day-id="${day.id}">
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                    <div class="flex items-center gap-4">
                        <div class="w-16 h-16 rounded-full bg-gradient-to-br from-japan-blue to-sakura-dark flex items-center justify-center text-white font-bold text-xl">
                            ${dayNumber}
                        </div>
                        <div>
                            <h3 class="text-xl font-semibold text-japan-indigo">${day.title || `Day ${dayNumber}`}</h3>
                            <p class="text-sm text-gray-600">
                                <i class="fas fa-calendar text-sakura-dark"></i>
                                ${this.formatDate(day.date)}
                            </p>
                        </div>
                    </div>
                    
                    <div class="flex gap-2">
                        <button class="btn btn-small btn-outline edit-day-btn" data-day-id="${day.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-small btn-outline delete-day-btn" data-day-id="${day.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                ${day.notes ? `
                    <div class="bg-ivory rounded-lg p-3 mb-4">
                        <p class="text-sm text-gray-700"><i class="fas fa-sticky-note text-sakura-dark mr-2"></i>${day.notes}</p>
                    </div>
                ` : ''}
                
                <!-- Activities -->
                <div class="space-y-3 mb-4" id="activities-${day.id}">
                    ${totalActivities > 0 ? day.activities.map(activity => this.renderActivityItem(activity, day.id)).join('') : `
                        <div class="text-center py-6 text-gray-500 bg-ivory rounded-lg">
                            <i class="fas fa-calendar-plus text-2xl mb-2 opacity-50"></i>
                            <p class="text-sm">No activities planned for this day</p>
                        </div>
                    `}
                </div>
                
                <button class="btn btn-small btn-primary add-activity-btn" data-day-id="${day.id}">
                    <i class="fas fa-plus"></i>
                    <span>Add Activity</span>
                </button>
            </div>
        `;
    },
    
    renderActivityItem(activity, dayId) {
        return `
            <div class="bg-white border-2 border-gray-100 rounded-lg p-4 hover:border-sakura transition-all activity-item" 
                 data-activity-id="${activity.id}" data-day-id="${dayId}">
                <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-lg bg-${this.getCategoryColor(activity.category)}/10 
                                flex items-center justify-center flex-shrink-0">
                        <i class="fas ${activity.icon || 'fa-circle'} text-${this.getCategoryColor(activity.category)}"></i>
                    </div>
                    
                    <div class="flex-1">
                        <div class="flex items-start justify-between gap-2">
                            <div class="flex-1">
                                <h4 class="font-semibold text-japan-indigo">${activity.name}</h4>
                                <div class="flex flex-wrap gap-2 mt-1">
                                    ${activity.time ? `
                                        <span class="text-xs text-gray-600">
                                            <i class="fas fa-clock text-matcha"></i> ${activity.time}
                                        </span>
                                    ` : ''}
                                    ${activity.duration ? `
                                        <span class="text-xs text-gray-600">
                                            <i class="fas fa-hourglass-half text-japan-blue"></i> ${activity.duration}
                                        </span>
                                    ` : ''}
                                    ${activity.category ? `
                                        <span class="badge badge-info">${activity.category}</span>
                                    ` : ''}
                                </div>
                                ${activity.location ? `
                                    <p class="text-xs text-gray-600 mt-1">
                                        <i class="fas fa-map-marker-alt text-sakura-dark"></i> ${activity.location}
                                    </p>
                                ` : ''}
                                ${activity.notes ? `
                                    <p class="text-sm text-gray-700 mt-2">${activity.notes}</p>
                                ` : ''}
                            </div>
                            
                            <div class="flex gap-1">
                                <button class="text-japan-blue hover:text-japan-indigo p-1 edit-activity-btn" 
                                        data-day-id="${dayId}" data-activity-id="${activity.id}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="text-red-500 hover:text-red-600 p-1 delete-activity-btn" 
                                        data-day-id="${dayId}" data-activity-id="${activity.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    attachDayEventListeners() {
        // Add activity buttons
        document.querySelectorAll('.add-activity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dayId = e.currentTarget.dataset.dayId;
                this.showAddActivityModal(dayId);
            });
        });
        
        // Edit day buttons
        document.querySelectorAll('.edit-day-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dayId = e.currentTarget.dataset.dayId;
                this.showEditDayModal(dayId);
            });
        });
        
        // Delete day buttons
        document.querySelectorAll('.delete-day-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dayId = e.currentTarget.dataset.dayId;
                this.deleteDay(dayId);
            });
        });
        
        // Edit activity buttons
        document.querySelectorAll('.edit-activity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dayId = e.currentTarget.dataset.dayId;
                const activityId = e.currentTarget.dataset.activityId;
                this.showEditActivityModal(dayId, activityId);
            });
        });
        
        // Delete activity buttons
        document.querySelectorAll('.delete-activity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dayId = e.currentTarget.dataset.dayId;
                const activityId = e.currentTarget.dataset.activityId;
                this.deleteActivity(dayId, activityId);
            });
        });
    },
    
    showAddDayModal() {
        const modal = this.createModal('Add New Day', `
            <form id="add-day-form" class="space-y-4">
                <div class="form-group">
                    <label class="form-label">Day Title</label>
                    <input type="text" id="day-title" class="form-input" placeholder="e.g., Exploring Tokyo" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Date</label>
                    <input type="date" id="day-date" class="form-input" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Notes (optional)</label>
                    <textarea id="day-notes" class="form-textarea" placeholder="Any notes for this day..."></textarea>
                </div>
                
                <div class="flex gap-3">
                    <button type="submit" class="btn btn-primary flex-1">
                        <i class="fas fa-plus"></i>
                        <span>Add Day</span>
                    </button>
                    <button type="button" class="btn btn-outline close-modal">Cancel</button>
                </div>
            </form>
        `);
        
        const form = modal.querySelector('#add-day-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNewDay();
            this.closeModal(modal);
        });
        
        // Set min date to today
        const dateInput = modal.querySelector('#day-date');
        dateInput.min = new Date().toISOString().split('T')[0];
    },
    
    addNewDay() {
        const day = {
            id: App.generateId(),
            title: document.getElementById('day-title').value,
            date: document.getElementById('day-date').value,
            notes: document.getElementById('day-notes').value,
            activities: []
        };
        
        App.data.tripDays.push(day);
        App.saveData();
        
        this.loadTripDays();
        App.updateDashboardStats();
        App.addActivity('fas fa-calendar-plus', `Added new day: ${day.title}`, 'planner');
        App.showInAppNotification('Day added successfully!', 'success');
    },
    
    showEditDayModal(dayId) {
        const day = App.data.tripDays.find(d => d.id === dayId);
        if (!day) return;
        
        const modal = this.createModal('Edit Day', `
            <form id="edit-day-form" class="space-y-4">
                <div class="form-group">
                    <label class="form-label">Day Title</label>
                    <input type="text" id="edit-day-title" class="form-input" value="${day.title}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Date</label>
                    <input type="date" id="edit-day-date" class="form-input" value="${day.date}" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Notes (optional)</label>
                    <textarea id="edit-day-notes" class="form-textarea">${day.notes || ''}</textarea>
                </div>
                
                <div class="flex gap-3">
                    <button type="submit" class="btn btn-primary flex-1">
                        <i class="fas fa-save"></i>
                        <span>Save Changes</span>
                    </button>
                    <button type="button" class="btn btn-outline close-modal">Cancel</button>
                </div>
            </form>
        `);
        
        const form = modal.querySelector('#edit-day-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateDay(dayId);
            this.closeModal(modal);
        });
    },
    
    updateDay(dayId) {
        const day = App.data.tripDays.find(d => d.id === dayId);
        if (!day) return;
        
        day.title = document.getElementById('edit-day-title').value;
        day.date = document.getElementById('edit-day-date').value;
        day.notes = document.getElementById('edit-day-notes').value;
        
        App.saveData();
        this.loadTripDays();
        App.showInAppNotification('Day updated successfully!', 'success');
    },
    
    deleteDay(dayId) {
        if (!confirm('Are you sure you want to delete this day and all its activities?')) {
            return;
        }
        
        App.data.tripDays = App.data.tripDays.filter(d => d.id !== dayId);
        App.saveData();
        
        this.loadTripDays();
        App.updateDashboardStats();
        App.addActivity('fas fa-trash', 'Deleted a trip day', 'planner');
        App.showInAppNotification('Day deleted', 'success');
    },
    
    showAddActivityModal(dayId) {
        const modal = this.createModal('Add Activity', `
            <form id="add-activity-form" class="space-y-4">
                <div class="form-group">
                    <label class="form-label">Quick Select</label>
                    <select id="activity-template" class="form-select">
                        <option value="">Choose a template...</option>
                        ${this.activityTemplates.map(t => 
                            `<option value="${t.name}" data-icon="${t.icon}" data-category="${t.category}" data-duration="${t.duration}">
                                ${t.name} (${t.category})
                            </option>`
                        ).join('')}
                    </select>
                </div>
                
                <div class="divider"></div>
                
                <div class="form-group">
                    <label class="form-label">Activity Name</label>
                    <input type="text" id="activity-name" class="form-input" placeholder="e.g., Visit Senso-ji Temple" required>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div class="form-group">
                        <label class="form-label">Time</label>
                        <input type="time" id="activity-time" class="form-input">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Duration</label>
                        <input type="text" id="activity-duration" class="form-input" placeholder="e.g., 2 hours">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Location</label>
                    <input type="text" id="activity-location" class="form-input" placeholder="e.g., Asakusa, Tokyo">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Category</label>
                    <select id="activity-category" class="form-select">
                        <option value="Culture">Culture</option>
                        <option value="Sightseeing">Sightseeing</option>
                        <option value="Food">Food</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Nature">Nature</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Relaxation">Relaxation</option>
                        <option value="Transport">Transport</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Notes (optional)</label>
                    <textarea id="activity-notes" class="form-textarea" placeholder="Any additional information..."></textarea>
                </div>
                
                <input type="hidden" id="activity-icon" value="fa-circle">
                
                <div class="flex gap-3">
                    <button type="submit" class="btn btn-primary flex-1">
                        <i class="fas fa-plus"></i>
                        <span>Add Activity</span>
                    </button>
                    <button type="button" class="btn btn-outline close-modal">Cancel</button>
                </div>
            </form>
        `);
        
        // Template selection
        const templateSelect = modal.querySelector('#activity-template');
        templateSelect.addEventListener('change', (e) => {
            const option = e.target.selectedOptions[0];
            if (option.value) {
                modal.querySelector('#activity-name').value = option.value;
                modal.querySelector('#activity-category').value = option.dataset.category;
                modal.querySelector('#activity-duration').value = option.dataset.duration;
                modal.querySelector('#activity-icon').value = option.dataset.icon;
            }
        });
        
        const form = modal.querySelector('#add-activity-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addActivity(dayId);
            this.closeModal(modal);
        });
    },
    
    addActivity(dayId) {
        const day = App.data.tripDays.find(d => d.id === dayId);
        if (!day) return;
        
        const activity = {
            id: App.generateId(),
            name: document.getElementById('activity-name').value,
            time: document.getElementById('activity-time').value,
            duration: document.getElementById('activity-duration').value,
            location: document.getElementById('activity-location').value,
            category: document.getElementById('activity-category').value,
            notes: document.getElementById('activity-notes').value,
            icon: document.getElementById('activity-icon').value
        };
        
        if (!day.activities) day.activities = [];
        day.activities.push(activity);
        
        App.saveData();
        this.loadTripDays();
        App.updateDashboardStats();
        App.addActivity('fas fa-plus-circle', `Added activity: ${activity.name}`, 'planner');
        App.showInAppNotification('Activity added!', 'success');
    },
    
    showEditActivityModal(dayId, activityId) {
        const day = App.data.tripDays.find(d => d.id === dayId);
        if (!day) return;
        
        const activity = day.activities.find(a => a.id === activityId);
        if (!activity) return;
        
        const modal = this.createModal('Edit Activity', `
            <form id="edit-activity-form" class="space-y-4">
                <div class="form-group">
                    <label class="form-label">Activity Name</label>
                    <input type="text" id="edit-activity-name" class="form-input" value="${activity.name}" required>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div class="form-group">
                        <label class="form-label">Time</label>
                        <input type="time" id="edit-activity-time" class="form-input" value="${activity.time || ''}">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Duration</label>
                        <input type="text" id="edit-activity-duration" class="form-input" value="${activity.duration || ''}">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Location</label>
                    <input type="text" id="edit-activity-location" class="form-input" value="${activity.location || ''}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Category</label>
                    <select id="edit-activity-category" class="form-select">
                        <option value="Culture" ${activity.category === 'Culture' ? 'selected' : ''}>Culture</option>
                        <option value="Sightseeing" ${activity.category === 'Sightseeing' ? 'selected' : ''}>Sightseeing</option>
                        <option value="Food" ${activity.category === 'Food' ? 'selected' : ''}>Food</option>
                        <option value="Shopping" ${activity.category === 'Shopping' ? 'selected' : ''}>Shopping</option>
                        <option value="Entertainment" ${activity.category === 'Entertainment' ? 'selected' : ''}>Entertainment</option>
                        <option value="Nature" ${activity.category === 'Nature' ? 'selected' : ''}>Nature</option>
                        <option value="Adventure" ${activity.category === 'Adventure' ? 'selected' : ''}>Adventure</option>
                        <option value="Relaxation" ${activity.category === 'Relaxation' ? 'selected' : ''}>Relaxation</option>
                        <option value="Transport" ${activity.category === 'Transport' ? 'selected' : ''}>Transport</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Notes (optional)</label>
                    <textarea id="edit-activity-notes" class="form-textarea">${activity.notes || ''}</textarea>
                </div>
                
                <div class="flex gap-3">
                    <button type="submit" class="btn btn-primary flex-1">
                        <i class="fas fa-save"></i>
                        <span>Save Changes</span>
                    </button>
                    <button type="button" class="btn btn-outline close-modal">Cancel</button>
                </div>
            </form>
        `);
        
        const form = modal.querySelector('#edit-activity-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateActivity(dayId, activityId);
            this.closeModal(modal);
        });
    },
    
    updateActivity(dayId, activityId) {
        const day = App.data.tripDays.find(d => d.id === dayId);
        if (!day) return;
        
        const activity = day.activities.find(a => a.id === activityId);
        if (!activity) return;
        
        activity.name = document.getElementById('edit-activity-name').value;
        activity.time = document.getElementById('edit-activity-time').value;
        activity.duration = document.getElementById('edit-activity-duration').value;
        activity.location = document.getElementById('edit-activity-location').value;
        activity.category = document.getElementById('edit-activity-category').value;
        activity.notes = document.getElementById('edit-activity-notes').value;
        
        App.saveData();
        this.loadTripDays();
        App.showInAppNotification('Activity updated!', 'success');
    },
    
    deleteActivity(dayId, activityId) {
        if (!confirm('Are you sure you want to delete this activity?')) {
            return;
        }
        
        const day = App.data.tripDays.find(d => d.id === dayId);
        if (!day) return;
        
        day.activities = day.activities.filter(a => a.id !== activityId);
        
        App.saveData();
        this.loadTripDays();
        App.updateDashboardStats();
        App.showInAppNotification('Activity deleted', 'success');
    },
    
    showQuickAddModal() {
        const modal = this.createModal('Quick Add Activities', `
            <p class="text-gray-600 mb-4">Select activities to add to your trip:</p>
            <div class="grid grid-cols-2 gap-3 mb-4 max-h-96 overflow-y-auto">
                ${this.activityTemplates.map(template => `
                    <label class="dashboard-card cursor-pointer hover:border-sakura border-2 border-transparent transition-all">
                        <input type="checkbox" class="mr-2" value="${template.name}" 
                               data-icon="${template.icon}" data-category="${template.category}">
                        <i class="fas ${template.icon} text-japan-blue mr-2"></i>
                        <span class="text-sm">${template.name}</span>
                    </label>
                `).join('')}
            </div>
            <div class="flex gap-3">
                <button type="button" id="quick-add-submit" class="btn btn-primary flex-1">
                    <i class="fas fa-plus"></i>
                    <span>Add Selected</span>
                </button>
                <button type="button" class="btn btn-outline close-modal">Cancel</button>
            </div>
        `);
        
        modal.querySelector('#quick-add-submit').addEventListener('click', () => {
            // This would need day selection - simplified for now
            App.showInAppNotification('Please add days first, then use the "+ Add Activity" button on each day', 'info');
            this.closeModal(modal);
        });
    },
    
    exportItinerary() {
        if (App.data.tripDays.length === 0) {
            App.showInAppNotification('No itinerary to export', 'warning');
            return;
        }
        
        let itinerary = 'MY JAPAN TRIP ITINERARY\n';
        itinerary += '='.repeat(50) + '\n\n';
        
        App.data.tripDays.forEach((day, index) => {
            itinerary += `DAY ${index + 1}: ${day.title}\n`;
            itinerary += `Date: ${this.formatDate(day.date)}\n`;
            if (day.notes) itinerary += `Notes: ${day.notes}\n`;
            itinerary += '-'.repeat(50) + '\n';
            
            if (day.activities && day.activities.length > 0) {
                day.activities.forEach(activity => {
                    itinerary += `\n• ${activity.name}\n`;
                    if (activity.time) itinerary += `  Time: ${activity.time}\n`;
                    if (activity.duration) itinerary += `  Duration: ${activity.duration}\n`;
                    if (activity.location) itinerary += `  Location: ${activity.location}\n`;
                    if (activity.notes) itinerary += `  Notes: ${activity.notes}\n`;
                });
            } else {
                itinerary += '\n  No activities planned\n';
            }
            
            itinerary += '\n' + '='.repeat(50) + '\n\n';
        });
        
        const blob = new Blob([itinerary], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `japan-itinerary-${new Date().toISOString().split('T')[0]}.txt`;
        link.click();
        URL.revokeObjectURL(url);
        
        App.showInAppNotification('Itinerary exported!', 'success');
    },
    
    updatePlannerStats() {
        const totalDaysEl = document.getElementById('total-days');
        const totalActivitiesEl = document.getElementById('total-activities');
        const totalHoursEl = document.getElementById('total-hours');
        
        if (totalDaysEl) {
            totalDaysEl.textContent = App.data.tripDays.length;
        }
        
        if (totalActivitiesEl) {
            const total = App.data.tripDays.reduce((sum, day) => {
                return sum + (day.activities ? day.activities.length : 0);
            }, 0);
            totalActivitiesEl.textContent = total;
        }
        
        if (totalHoursEl) {
            // Estimate based on activities - simplified calculation
            const total = App.data.tripDays.reduce((sum, day) => {
                return sum + (day.activities ? day.activities.length * 2 : 0);
            }, 0);
            totalHoursEl.textContent = total;
        }
    },
    
    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 animate-slide-in">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-2xl font-display font-bold text-japan-indigo">${title}</h3>
                    <button class="close-modal text-gray-400 hover:text-japan-indigo text-2xl">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                ${content}
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal events
        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal(modal));
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal(modal);
        });
        
        return modal;
    },
    
    closeModal(modal) {
        modal.remove();
    },
    
    getCategoryColor(category) {
        const colors = {
            'Culture': 'japan-blue',
            'Sightseeing': 'sakura-dark',
            'Food': 'matcha',
            'Shopping': 'japan-indigo',
            'Entertainment': 'sakura',
            'Nature': 'matcha',
            'Adventure': 'japan-blue',
            'Relaxation': 'sakura',
            'Transport': 'japan-indigo'
        };
        return colors[category] || 'gray-500';
    },
    
    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    TripPlanner.init();
});
