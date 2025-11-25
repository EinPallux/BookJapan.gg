/* ===================================
   BookJapan.gg - Main Application
   Core functionality and navigation
   =================================== */

// Global App State
const App = {
    currentPage: 'dashboard',
    data: {
        flights: [],
        tripDays: [],
        budget: null,
        profile: {
            tripDate: null,
            name: '',
            preferences: {}
        },
        activities: []
    },
    
    // Initialize app
    init() {
        this.loadData();
        this.setupEventListeners();
        this.updateCountdown();
        this.updateDashboardStats();
        
        // Update countdown every minute
        setInterval(() => this.updateCountdown(), 60000);
        
        console.log('📱 BookJapan.gg initialized successfully!');
    },
    
    // Setup all event listeners
    setupEventListeners() {
        // Desktop navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.navigateTo(page);
            });
        });
        
        // Mobile navigation
        document.querySelectorAll('.nav-link-mobile').forEach(link => {
            link.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.navigateTo(page);
                this.closeMobileMenu();
            });
        });
        
        // Quick action buttons
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.navigateTo(page);
            });
        });
        
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    this.closeMobileMenu();
                }
            }
        });
    },
    
    // Navigation
    navigateTo(page) {
        // Hide all pages
        document.querySelectorAll('.page-content').forEach(p => {
            p.classList.remove('active');
        });
        
        // Show selected page
        const targetPage = document.getElementById(`page-${page}`);
        if (targetPage) {
            targetPage.classList.add('active');
        }
        
        // Update navigation active state
        document.querySelectorAll('.nav-link, .nav-link-mobile').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === page) {
                link.classList.add('active');
            }
        });
        
        this.currentPage = page;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    
    // Close mobile menu
    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.add('hidden');
        }
    },
    
    // Countdown timer
    updateCountdown() {
        const countdownDisplay = document.getElementById('countdown-display');
        const countdownText = document.getElementById('countdown-text');
        
        if (!this.data.profile.tripDate) {
            if (countdownDisplay) {
                countdownDisplay.classList.remove('hidden');
            }
            if (countdownText) {
                countdownText.textContent = 'Set your trip date';
            }
            return;
        }
        
        const tripDate = new Date(this.data.profile.tripDate);
        const now = new Date();
        const diff = tripDate - now;
        
        if (diff < 0) {
            if (countdownText) {
                countdownText.textContent = 'Trip has passed!';
            }
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (countdownDisplay) {
            countdownDisplay.classList.remove('hidden');
        }
        
        if (countdownText) {
            if (days > 0) {
                countdownText.textContent = `${days} ${days === 1 ? 'day' : 'days'} till Japan`;
            } else if (hours > 0) {
                countdownText.textContent = `${hours} ${hours === 1 ? 'hour' : 'hours'} till Japan`;
            } else {
                countdownText.textContent = 'Departing today! 🎉';
            }
        }
    },
    
    // Update dashboard statistics
    updateDashboardStats() {
        const statFlights = document.getElementById('stat-flights');
        const statDays = document.getElementById('stat-days');
        const statBudget = document.getElementById('stat-budget');
        
        if (statFlights) {
            statFlights.textContent = this.data.flights.length;
        }
        
        if (statDays) {
            const totalActivities = this.data.tripDays.reduce((sum, day) => {
                return sum + (day.activities ? day.activities.length : 0);
            }, 0);
            statDays.textContent = totalActivities;
        }
        
        if (statBudget) {
            const totalBudget = this.data.budget ? this.data.budget.totalBudget : 0;
            statBudget.textContent = `€${totalBudget.toLocaleString()}`;
        }
    },
    
    // Add activity to recent activity feed
    addActivity(icon, text, type = 'info') {
        const activity = {
            icon,
            text,
            type,
            timestamp: new Date().toISOString()
        };
        
        this.data.activities.unshift(activity);
        
        // Keep only last 10 activities
        if (this.data.activities.length > 10) {
            this.data.activities = this.data.activities.slice(0, 10);
        }
        
        this.saveData();
        this.renderRecentActivity();
    },
    
    // Render recent activity
    renderRecentActivity() {
        const container = document.getElementById('recent-activity');
        if (!container) return;
        
        if (this.data.activities.length === 0) {
            container.innerHTML = `
                <div class="activity-item">
                    <i class="fas fa-info-circle text-gray-400"></i>
                    <span class="text-gray-600">No recent activity yet. Start planning your trip!</span>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.data.activities.map(activity => `
            <div class="activity-item">
                <i class="${activity.icon} text-${this.getActivityColor(activity.type)}"></i>
                <span class="text-gray-700">${activity.text}</span>
            </div>
        `).join('');
    },
    
    // Get activity color based on type
    getActivityColor(type) {
        const colors = {
            'success': 'matcha',
            'info': 'japan-blue',
            'warning': 'yellow-600',
            'flight': 'japan-blue',
            'budget': 'matcha',
            'planner': 'sakura-dark'
        };
        return colors[type] || 'gray-500';
    },
    
    // Local Storage Management
    saveData() {
        try {
            localStorage.setItem('bookjapan_data', JSON.stringify(this.data));
            console.log('✅ Data saved successfully');
        } catch (error) {
            console.error('❌ Error saving data:', error);
            this.showNotification('Error saving data', 'error');
        }
    },
    
    loadData() {
        try {
            const savedData = localStorage.getItem('bookjapan_data');
            if (savedData) {
                this.data = JSON.parse(savedData);
                console.log('✅ Data loaded successfully');
            }
        } catch (error) {
            console.error('❌ Error loading data:', error);
            this.showNotification('Error loading data', 'error');
        }
    },
    
    clearData() {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            localStorage.removeItem('bookjapan_data');
            this.data = {
                flights: [],
                tripDays: [],
                budget: null,
                profile: {
                    tripDate: null,
                    name: '',
                    preferences: {}
                },
                activities: []
            };
            this.saveData();
            location.reload();
        }
    },
    
    // Notification System
    showNotification(message, type = 'info') {
        // Check if notification API is available
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('BookJapan.gg', {
                body: message,
                icon: '/assets/icon.png',
                badge: '/assets/badge.png'
            });
        }
        
        // Also show in-app notification
        this.showInAppNotification(message, type);
    },
    
    showInAppNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg max-w-sm animate-slide-in`;
        
        const colors = {
            'success': 'bg-matcha text-white',
            'error': 'bg-red-500 text-white',
            'warning': 'bg-yellow-500 text-white',
            'info': 'bg-japan-blue text-white'
        };
        
        const icons = {
            'success': 'fa-check-circle',
            'error': 'fa-exclamation-circle',
            'warning': 'fa-exclamation-triangle',
            'info': 'fa-info-circle'
        };
        
        notification.className += ` ${colors[type] || colors.info}`;
        
        notification.innerHTML = `
            <div class="flex items-center gap-3">
                <i class="fas ${icons[type] || icons.info} text-xl"></i>
                <span class="font-medium">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },
    
    // Request notification permission
    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.showNotification('Notifications enabled! You\'ll receive alerts for price drops.', 'success');
                }
            });
        }
    },
    
    // Export data
    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `bookjapan-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        this.showInAppNotification('Data exported successfully!', 'success');
    },
    
    // Import data
    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                this.data = importedData;
                this.saveData();
                location.reload();
            } catch (error) {
                this.showInAppNotification('Error importing data. Invalid file format.', 'error');
            }
        };
        reader.readAsText(file);
    },
    
    // Utility functions
    formatDate(date) {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    },
    
    formatCurrency(amount, currency = '€') {
        return `${currency}${amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Add CSS for slide-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100px); }
    }
    
    .animate-slide-in {
        animation: slideInRight 0.3s ease;
    }
    
    @keyframes slideInRight {
        from { opacity: 0; transform: translateX(100px); }
        to { opacity: 1; transform: translateX(0); }
    }
`;
document.head.appendChild(style);

// Make App globally accessible
window.App = App;
