/* ===================================
   BookJapan.gg - Profile & Settings
   User profile and trip configuration
   =================================== */

const ProfileManager = {
    init() {
        this.renderProfilePage();
        this.setupProfileEventListeners();
        this.loadProfileData();
    },
    
    renderProfilePage() {
        const container = document.getElementById('page-profile');
        if (!container) return;
        
        container.innerHTML = `
            <div class="page-header mb-8">
                <h2 class="text-4xl font-display font-bold text-japan-indigo mb-2">Profile & Settings</h2>
                <p class="text-gray-600">Manage your trip details and preferences</p>
            </div>
            
            <!-- Trip Date Card -->
            <div class="dashboard-card mb-6">
                <h3 class="text-xl font-semibold text-japan-indigo mb-4">
                    <i class="fas fa-calendar-alt text-sakura-dark mr-2"></i>
                    Trip Date
                </h3>
                <p class="text-gray-600 mb-4">Set your Japan trip departure date to see the countdown timer</p>
                
                <form id="trip-date-form" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="form-group">
                            <label class="form-label">Departure Date</label>
                            <input type="date" id="trip-date-input" class="form-input" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Return Date (optional)</label>
                            <input type="date" id="return-date-input" class="form-input">
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i>
                        <span>Save Trip Date</span>
                    </button>
                </form>
                
                <div id="trip-countdown-display" class="hidden mt-6 p-4 bg-gradient-to-r from-japan-blue to-sakura-dark rounded-lg text-white">
                    <div class="text-center">
                        <p class="text-sm opacity-90 mb-2">Your trip starts in</p>
                        <p class="text-4xl font-bold" id="profile-countdown-text">0 days</p>
                        <p class="text-sm opacity-90 mt-2" id="trip-date-display"></p>
                    </div>
                </div>
            </div>
            
            <!-- Personal Information -->
            <div class="dashboard-card mb-6">
                <h3 class="text-xl font-semibold text-japan-indigo mb-4">
                    <i class="fas fa-user text-japan-blue mr-2"></i>
                    Personal Information
                </h3>
                
                <form id="personal-info-form" class="space-y-4">
                    <div class="form-group">
                        <label class="form-label">Name</label>
                        <input type="text" id="user-name" class="form-input" placeholder="Your name">
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="form-group">
                            <label class="form-label">Home City</label>
                            <input type="text" id="user-city" class="form-input" placeholder="e.g., Berlin">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Primary Airport</label>
                            <select id="user-airport" class="form-select">
                                <option value="">Select airport</option>
                                <option value="FRA">Frankfurt (FRA)</option>
                                <option value="MUC">Munich (MUC)</option>
                                <option value="BER">Berlin (BER)</option>
                                <option value="DUS">Düsseldorf (DUS)</option>
                                <option value="HAM">Hamburg (HAM)</option>
                                <option value="CGN">Cologne (CGN)</option>
                                <option value="STR">Stuttgart (STR)</option>
                            </select>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i>
                        <span>Save Information</span>
                    </button>
                </form>
            </div>
            
            <!-- Travel Preferences -->
            <div class="dashboard-card mb-6">
                <h3 class="text-xl font-semibold text-japan-indigo mb-4">
                    <i class="fas fa-sliders-h text-matcha mr-2"></i>
                    Travel Preferences
                </h3>
                
                <form id="preferences-form" class="space-y-4">
                    <div class="form-group">
                        <label class="form-label">Preferred Travel Style</label>
                        <select id="travel-style" class="form-select">
                            <option value="budget">Budget Traveler</option>
                            <option value="moderate">Moderate</option>
                            <option value="comfortable">Comfortable</option>
                            <option value="luxury">Luxury</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Interests</label>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" class="interest-checkbox" value="Culture & History">
                                <span class="text-sm">Culture & History</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" class="interest-checkbox" value="Food & Dining">
                                <span class="text-sm">Food & Dining</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" class="interest-checkbox" value="Nature & Outdoors">
                                <span class="text-sm">Nature & Outdoors</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" class="interest-checkbox" value="Shopping">
                                <span class="text-sm">Shopping</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" class="interest-checkbox" value="Nightlife">
                                <span class="text-sm">Nightlife</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" class="interest-checkbox" value="Photography">
                                <span class="text-sm">Photography</span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Currency Display</label>
                        <select id="currency-preference" class="form-select">
                            <option value="EUR">Euro (€)</option>
                            <option value="USD">US Dollar ($)</option>
                            <option value="JPY">Japanese Yen (¥)</option>
                        </select>
                    </div>
                    
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i>
                        <span>Save Preferences</span>
                    </button>
                </form>
            </div>
            
            <!-- Notifications -->
            <div class="dashboard-card mb-6">
                <h3 class="text-xl font-semibold text-japan-indigo mb-4">
                    <i class="fas fa-bell text-sakura-dark mr-2"></i>
                    Notifications
                </h3>
                
                <div class="space-y-3">
                    <div class="flex items-center justify-between p-3 bg-ivory rounded-lg">
                        <div>
                            <p class="font-semibold text-japan-indigo">Flight Price Alerts</p>
                            <p class="text-sm text-gray-600">Get notified when flight prices drop</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="flight-alerts" class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-matcha"></div>
                        </label>
                    </div>
                    
                    <div class="flex items-center justify-between p-3 bg-ivory rounded-lg">
                        <div>
                            <p class="font-semibold text-japan-indigo">Trip Reminders</p>
                            <p class="text-sm text-gray-600">Reminders for your trip planning</p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="trip-reminders" class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-matcha"></div>
                        </label>
                    </div>
                    
                    <button id="enable-notifications-btn" class="btn btn-outline w-full">
                        <i class="fas fa-bell"></i>
                        <span>Enable Browser Notifications</span>
                    </button>
                </div>
            </div>
            
            <!-- Data Management -->
            <div class="dashboard-card mb-6">
                <h3 class="text-xl font-semibold text-japan-indigo mb-4">
                    <i class="fas fa-database text-japan-blue mr-2"></i>
                    Data Management
                </h3>
                
                <div class="space-y-3">
                    <button id="export-data-btn" class="btn btn-outline w-full">
                        <i class="fas fa-download"></i>
                        <span>Export All Data</span>
                    </button>
                    
                    <button id="import-data-btn" class="btn btn-outline w-full">
                        <i class="fas fa-upload"></i>
                        <span>Import Data</span>
                    </button>
                    <input type="file" id="import-file-input" class="hidden" accept=".json">
                    
                    <button id="clear-data-btn" class="btn btn-danger w-full">
                        <i class="fas fa-trash-alt"></i>
                        <span>Clear All Data</span>
                    </button>
                </div>
                
                <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p class="text-sm text-yellow-800">
                        <i class="fas fa-exclamation-triangle mr-2"></i>
                        All data is stored locally in your browser. Export regularly to keep backups.
                    </p>
                </div>
            </div>
            
            <!-- About -->
            <div class="dashboard-card">
                <h3 class="text-xl font-semibold text-japan-indigo mb-4">
                    <i class="fas fa-info-circle text-japan-blue mr-2"></i>
                    About BookJapan.gg
                </h3>
                
                <div class="space-y-3 text-gray-700">
                    <p>
                        BookJapan.gg is your all-in-one Japan trip planning companion. Track flight prices, 
                        plan your itinerary, manage your budget, and get ready for the adventure of a lifetime.
                    </p>
                    
                    <div class="divider"></div>
                    
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p class="font-semibold text-japan-indigo mb-1">Version</p>
                            <p>1.0.0</p>
                        </div>
                        <div>
                            <p class="font-semibold text-japan-indigo mb-1">Last Updated</p>
                            <p>2024</p>
                        </div>
                    </div>
                    
                    <div class="mt-4 p-3 bg-ivory rounded-lg">
                        <p class="text-sm">
                            <i class="fas fa-heart text-sakura-dark mr-2"></i>
                            Made with love for Japan travelers
                        </p>
                    </div>
                </div>
            </div>
        `;
        
        // Set minimum dates to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('trip-date-input').min = today;
        document.getElementById('return-date-input').min = today;
    },
    
    setupProfileEventListeners() {
        // Trip date form
        const tripDateForm = document.getElementById('trip-date-form');
        if (tripDateForm) {
            tripDateForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveTripDate();
            });
        }
        
        // Personal info form
        const personalForm = document.getElementById('personal-info-form');
        if (personalForm) {
            personalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.savePersonalInfo();
            });
        }
        
        // Preferences form
        const preferencesForm = document.getElementById('preferences-form');
        if (preferencesForm) {
            preferencesForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.savePreferences();
            });
        }
        
        // Notification toggles
        document.getElementById('flight-alerts')?.addEventListener('change', (e) => {
            this.saveNotificationPreference('flightAlerts', e.target.checked);
        });
        
        document.getElementById('trip-reminders')?.addEventListener('change', (e) => {
            this.saveNotificationPreference('tripReminders', e.target.checked);
        });
        
        // Enable notifications button
        const enableNotifBtn = document.getElementById('enable-notifications-btn');
        if (enableNotifBtn) {
            enableNotifBtn.addEventListener('click', () => {
                App.requestNotificationPermission();
            });
        }
        
        // Data management
        document.getElementById('export-data-btn')?.addEventListener('click', () => {
            App.exportData();
        });
        
        document.getElementById('import-data-btn')?.addEventListener('click', () => {
            document.getElementById('import-file-input').click();
        });
        
        document.getElementById('import-file-input')?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                App.importData(file);
            }
        });
        
        document.getElementById('clear-data-btn')?.addEventListener('click', () => {
            App.clearData();
        });
        
        // Sync return date with departure date
        const departDate = document.getElementById('trip-date-input');
        const returnDate = document.getElementById('return-date-input');
        
        if (departDate && returnDate) {
            departDate.addEventListener('change', () => {
                returnDate.min = departDate.value;
                if (returnDate.value && returnDate.value < departDate.value) {
                    returnDate.value = departDate.value;
                }
            });
        }
    },
    
    loadProfileData() {
        // Load trip date
        if (App.data.profile.tripDate) {
            const tripDateInput = document.getElementById('trip-date-input');
            if (tripDateInput) {
                tripDateInput.value = App.data.profile.tripDate;
            }
            
            this.updateCountdownDisplay();
        }
        
        // Load return date
        if (App.data.profile.returnDate) {
            const returnDateInput = document.getElementById('return-date-input');
            if (returnDateInput) {
                returnDateInput.value = App.data.profile.returnDate;
            }
        }
        
        // Load personal info
        if (App.data.profile.name) {
            document.getElementById('user-name').value = App.data.profile.name;
        }
        if (App.data.profile.city) {
            document.getElementById('user-city').value = App.data.profile.city;
        }
        if (App.data.profile.airport) {
            document.getElementById('user-airport').value = App.data.profile.airport;
        }
        
        // Load preferences
        if (App.data.profile.preferences) {
            const prefs = App.data.profile.preferences;
            
            if (prefs.travelStyle) {
                document.getElementById('travel-style').value = prefs.travelStyle;
            }
            
            if (prefs.interests) {
                document.querySelectorAll('.interest-checkbox').forEach(checkbox => {
                    if (prefs.interests.includes(checkbox.value)) {
                        checkbox.checked = true;
                    }
                });
            }
            
            if (prefs.currency) {
                document.getElementById('currency-preference').value = prefs.currency;
            }
            
            if (prefs.flightAlerts !== undefined) {
                document.getElementById('flight-alerts').checked = prefs.flightAlerts;
            }
            
            if (prefs.tripReminders !== undefined) {
                document.getElementById('trip-reminders').checked = prefs.tripReminders;
            }
        }
    },
    
    saveTripDate() {
        const tripDate = document.getElementById('trip-date-input').value;
        const returnDate = document.getElementById('return-date-input').value;
        
        if (!tripDate) {
            App.showInAppNotification('Please select a departure date', 'warning');
            return;
        }
        
        App.data.profile.tripDate = tripDate;
        App.data.profile.returnDate = returnDate;
        App.saveData();
        
        // Update countdown in header
        App.updateCountdown();
        
        // Update countdown display on profile page
        this.updateCountdownDisplay();
        
        App.addActivity('fas fa-calendar-check', 'Set trip departure date', 'info');
        App.showInAppNotification('Trip date saved!', 'success');
    },
    
    updateCountdownDisplay() {
        const displaySection = document.getElementById('trip-countdown-display');
        const countdownText = document.getElementById('profile-countdown-text');
        const dateDisplay = document.getElementById('trip-date-display');
        
        if (!App.data.profile.tripDate) {
            if (displaySection) displaySection.classList.add('hidden');
            return;
        }
        
        const tripDate = new Date(App.data.profile.tripDate);
        const now = new Date();
        const diff = tripDate - now;
        
        if (diff < 0) {
            if (countdownText) countdownText.textContent = 'Trip has passed!';
            if (dateDisplay) dateDisplay.textContent = '';
            if (displaySection) displaySection.classList.remove('hidden');
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (countdownText) {
            if (days > 0) {
                countdownText.textContent = `${days} ${days === 1 ? 'day' : 'days'}`;
            } else if (hours > 0) {
                countdownText.textContent = `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
            } else {
                countdownText.textContent = 'Today! 🎉';
            }
        }
        
        if (dateDisplay) {
            dateDisplay.textContent = tripDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        
        if (displaySection) {
            displaySection.classList.remove('hidden');
        }
    },
    
    savePersonalInfo() {
        App.data.profile.name = document.getElementById('user-name').value;
        App.data.profile.city = document.getElementById('user-city').value;
        App.data.profile.airport = document.getElementById('user-airport').value;
        
        App.saveData();
        App.addActivity('fas fa-user', 'Updated personal information', 'info');
        App.showInAppNotification('Personal information saved!', 'success');
    },
    
    savePreferences() {
        const interests = Array.from(document.querySelectorAll('.interest-checkbox:checked'))
            .map(cb => cb.value);
        
        App.data.profile.preferences = {
            travelStyle: document.getElementById('travel-style').value,
            interests: interests,
            currency: document.getElementById('currency-preference').value,
            flightAlerts: document.getElementById('flight-alerts').checked,
            tripReminders: document.getElementById('trip-reminders').checked
        };
        
        App.saveData();
        App.addActivity('fas fa-cog', 'Updated preferences', 'info');
        App.showInAppNotification('Preferences saved!', 'success');
    },
    
    saveNotificationPreference(key, value) {
        if (!App.data.profile.preferences) {
            App.data.profile.preferences = {};
        }
        
        App.data.profile.preferences[key] = value;
        App.saveData();
        
        if (value) {
            App.requestNotificationPermission();
        }
    }
};

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        ProfileManager.init();
    });
} else {
    ProfileManager.init();
}
