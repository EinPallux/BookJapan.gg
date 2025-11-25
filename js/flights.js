/* ===================================
   BookJapan.gg - Flight Price Tracker
   Search, compare, and track flights
   =================================== */

const FlightTracker = {
    // Popular German flight search engines
    searchEngines: [
        { name: 'Skyscanner', url: 'https://www.skyscanner.de', icon: 'fa-plane', color: '#00B2D6' },
        { name: 'Google Flights', url: 'https://www.google.com/flights', icon: 'fa-google', color: '#4285F4' },
        { name: 'Check24', url: 'https://flug.check24.de', icon: 'fa-check', color: '#003D7C' },
        { name: 'Kayak', url: 'https://www.kayak.de', icon: 'fa-search', color: '#FF690F' },
        { name: 'Momondo', url: 'https://www.momondo.de', icon: 'fa-globe', color: '#3F4E9F' },
        { name: 'Lufthansa', url: 'https://www.lufthansa.com', icon: 'fa-plane-departure', color: '#05164D' }
    ],
    
    // Major German airports
    germanAirports: [
        { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt' },
        { code: 'MUC', name: 'Munich Airport', city: 'Munich' },
        { code: 'BER', name: 'Berlin Brandenburg', city: 'Berlin' },
        { code: 'DUS', name: 'Düsseldorf Airport', city: 'Düsseldorf' },
        { code: 'HAM', name: 'Hamburg Airport', city: 'Hamburg' },
        { code: 'CGN', name: 'Cologne Bonn Airport', city: 'Cologne' },
        { code: 'STR', name: 'Stuttgart Airport', city: 'Stuttgart' }
    ],
    
    // Japanese airports
    japaneseAirports: [
        { code: 'NRT', name: 'Narita International', city: 'Tokyo' },
        { code: 'HND', name: 'Haneda Airport', city: 'Tokyo' },
        { code: 'KIX', name: 'Kansai International', city: 'Osaka' },
        { code: 'NGO', name: 'Chubu Centrair', city: 'Nagoya' },
        { code: 'FUK', name: 'Fukuoka Airport', city: 'Fukuoka' },
        { code: 'CTS', name: 'New Chitose Airport', city: 'Sapporo' }
    ],
    
    // Popular airlines for Germany-Japan routes
    airlines: [
        'Lufthansa', 'ANA', 'Japan Airlines', 'Air France', 'KLM', 
        'British Airways', 'Turkish Airlines', 'Emirates', 'Qatar Airways',
        'Finnair', 'Austrian Airlines', 'Swiss International'
    ],
    
    init() {
        this.renderFlightsPage();
        this.setupFlightEventListeners();
        this.loadSavedFlights();
        this.startAutoRefresh();
    },
    
    renderFlightsPage() {
        const container = document.getElementById('page-flights');
        if (!container) return;
        
        container.innerHTML = `
            <div class="page-header mb-8">
                <h2 class="text-4xl font-display font-bold text-japan-indigo mb-2">Flight Price Tracker</h2>
                <p class="text-gray-600">Find and track the best flight deals to Japan</p>
            </div>
            
            <!-- Search Form -->
            <div class="dashboard-card mb-8">
                <h3 class="text-xl font-semibold text-japan-indigo mb-4">Search Flights</h3>
                <form id="flight-search-form" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="form-group">
                            <label class="form-label">
                                <i class="fas fa-plane-departure text-japan-blue"></i>
                                Departure Airport
                            </label>
                            <select id="departure-airport" class="form-select" required>
                                <option value="">Select departure city</option>
                                ${this.germanAirports.map(airport => 
                                    `<option value="${airport.code}">${airport.city} (${airport.code})</option>`
                                ).join('')}
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">
                                <i class="fas fa-plane-arrival text-sakura-dark"></i>
                                Arrival Airport
                            </label>
                            <select id="arrival-airport" class="form-select" required>
                                <option value="">Select destination</option>
                                ${this.japaneseAirports.map(airport => 
                                    `<option value="${airport.code}">${airport.city} (${airport.code})</option>`
                                ).join('')}
                            </select>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="form-group">
                            <label class="form-label">
                                <i class="fas fa-calendar-alt text-matcha"></i>
                                Departure Date
                            </label>
                            <input type="date" id="departure-date" class="form-input" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">
                                <i class="fas fa-calendar-check text-matcha"></i>
                                Return Date
                            </label>
                            <input type="date" id="return-date" class="form-input" required>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="form-group">
                            <label class="form-label">
                                <i class="fas fa-users text-japan-blue"></i>
                                Passengers
                            </label>
                            <input type="number" id="passengers" class="form-input" min="1" max="9" value="1" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">
                                <i class="fas fa-tag text-sakura-dark"></i>
                                Class
                            </label>
                            <select id="cabin-class" class="form-select">
                                <option value="economy">Economy</option>
                                <option value="premium">Premium Economy</option>
                                <option value="business">Business</option>
                                <option value="first">First Class</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">
                                <i class="fas fa-exchange-alt text-japan-indigo"></i>
                                Trip Type
                            </label>
                            <select id="trip-type" class="form-select">
                                <option value="roundtrip">Round Trip</option>
                                <option value="oneway">One Way</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- Advanced Filters -->
                    <div class="border-t pt-4">
                        <button type="button" id="toggle-filters" class="text-japan-blue hover:text-japan-indigo font-medium flex items-center gap-2 mb-4">
                            <i class="fas fa-filter"></i>
                            <span>Advanced Filters</span>
                            <i class="fas fa-chevron-down transition-transform"></i>
                        </button>
                        
                        <div id="advanced-filters" class="hidden space-y-4">
                            <div class="form-group">
                                <label class="form-label">
                                    <i class="fas fa-plane text-japan-blue"></i>
                                    Preferred Airlines (optional)
                                </label>
                                <select id="preferred-airlines" class="form-select" multiple>
                                    ${this.airlines.map(airline => 
                                        `<option value="${airline}">${airline}</option>`
                                    ).join('')}
                                </select>
                                <p class="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                            </div>
                            
                            <div class="flex items-center gap-4 flex-wrap">
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" id="direct-only" class="w-4 h-4">
                                    <span class="text-sm text-gray-700">Direct flights only</span>
                                </label>
                                
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" id="flexible-dates" class="w-4 h-4">
                                    <span class="text-sm text-gray-700">Flexible dates (±3 days)</span>
                                </label>
                                
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" id="enable-alerts" class="w-4 h-4">
                                    <span class="text-sm text-gray-700">Enable price alerts</span>
                                </label>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">
                                    <i class="fas fa-euro-sign text-matcha"></i>
                                    Maximum Price (€)
                                </label>
                                <input type="number" id="max-price" class="form-input" placeholder="e.g., 1000" min="0">
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex flex-col sm:flex-row gap-3">
                        <button type="submit" class="btn btn-primary flex-1">
                            <i class="fas fa-search"></i>
                            <span>Search Flights</span>
                        </button>
                        <button type="button" id="save-search-btn" class="btn btn-secondary">
                            <i class="fas fa-bookmark"></i>
                            <span>Save Search</span>
                        </button>
                    </div>
                </form>
            </div>
            
            <!-- Flight Search Results -->
            <div id="flight-results" class="hidden mb-8">
                <div class="dashboard-card">
                    <h3 class="text-xl font-semibold text-japan-indigo mb-4">Available Search Engines</h3>
                    <p class="text-gray-600 mb-4">Click on any engine to search for your flights:</p>
                    <div id="search-engines-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <!-- Will be populated dynamically -->
                    </div>
                </div>
            </div>
            
            <!-- Saved Flights -->
            <div class="dashboard-card">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-semibold text-japan-indigo">Saved Flight Searches</h3>
                    <button id="refresh-all-btn" class="btn btn-small btn-outline">
                        <i class="fas fa-sync-alt"></i>
                        <span>Refresh All</span>
                    </button>
                </div>
                <div id="saved-flights-container">
                    <!-- Will be populated dynamically -->
                </div>
            </div>
        `;
        
        // Set minimum dates to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('departure-date').min = today;
        document.getElementById('return-date').min = today;
    },
    
    setupFlightEventListeners() {
        // Search form submission
        const form = document.getElementById('flight-search-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFlightSearch();
            });
        }
        
        // Toggle advanced filters
        const toggleBtn = document.getElementById('toggle-filters');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const filters = document.getElementById('advanced-filters');
                const icon = toggleBtn.querySelector('.fa-chevron-down');
                
                filters.classList.toggle('hidden');
                icon.style.transform = filters.classList.contains('hidden') 
                    ? 'rotate(0deg)' 
                    : 'rotate(180deg)';
            });
        }
        
        // Save search button
        const saveBtn = document.getElementById('save-search-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveCurrentSearch());
        }
        
        // Refresh all button
        const refreshBtn = document.getElementById('refresh-all-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshAllFlights());
        }
        
        // Sync return date with departure date
        const departDate = document.getElementById('departure-date');
        const returnDate = document.getElementById('return-date');
        
        if (departDate && returnDate) {
            departDate.addEventListener('change', () => {
                returnDate.min = departDate.value;
                if (returnDate.value && returnDate.value < departDate.value) {
                    returnDate.value = departDate.value;
                }
            });
        }
    },
    
    handleFlightSearch() {
        const searchData = this.getSearchFormData();
        
        if (!this.validateSearchData(searchData)) {
            App.showInAppNotification('Please fill in all required fields', 'warning');
            return;
        }
        
        // Show results section
        const resultsSection = document.getElementById('flight-results');
        if (resultsSection) {
            resultsSection.classList.remove('hidden');
        }
        
        // Generate search URLs and display
        this.displaySearchEngines(searchData);
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        App.showInAppNotification('Search engines loaded successfully!', 'success');
    },
    
    getSearchFormData() {
        return {
            from: document.getElementById('departure-airport')?.value,
            to: document.getElementById('arrival-airport')?.value,
            departDate: document.getElementById('departure-date')?.value,
            returnDate: document.getElementById('return-date')?.value,
            passengers: document.getElementById('passengers')?.value,
            cabinClass: document.getElementById('cabin-class')?.value,
            tripType: document.getElementById('trip-type')?.value,
            directOnly: document.getElementById('direct-only')?.checked,
            flexibleDates: document.getElementById('flexible-dates')?.checked,
            enableAlerts: document.getElementById('enable-alerts')?.checked,
            maxPrice: document.getElementById('max-price')?.value,
            preferredAirlines: Array.from(document.getElementById('preferred-airlines')?.selectedOptions || [])
                .map(opt => opt.value),
            timestamp: new Date().toISOString()
        };
    },
    
    validateSearchData(data) {
        return data.from && data.to && data.departDate && data.returnDate && data.passengers;
    },
    
    displaySearchEngines(searchData) {
        const container = document.getElementById('search-engines-grid');
        if (!container) return;
        
        container.innerHTML = this.searchEngines.map(engine => {
            const url = this.buildSearchUrl(engine, searchData);
            
            return `
                <a href="${url}" target="_blank" rel="noopener noreferrer" 
                   class="dashboard-card hover:scale-105 transition-transform cursor-pointer no-underline">
                    <div class="flex items-center gap-4 mb-3">
                        <div class="w-12 h-12 rounded-lg flex items-center justify-center"
                             style="background-color: ${engine.color}15;">
                            <i class="fas ${engine.icon} text-2xl" style="color: ${engine.color};"></i>
                        </div>
                        <div>
                            <h4 class="font-semibold text-japan-indigo">${engine.name}</h4>
                            <p class="text-xs text-gray-500">Click to search</p>
                        </div>
                    </div>
                    <div class="text-xs text-gray-600">
                        <div class="flex items-center gap-2 mb-1">
                            <i class="fas fa-plane-departure text-japan-blue"></i>
                            <span>${searchData.from} → ${searchData.to}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="fas fa-calendar text-sakura-dark"></i>
                            <span>${this.formatDateShort(searchData.departDate)}</span>
                        </div>
                    </div>
                </a>
            `;
        }).join('');
    },
    
    buildSearchUrl(engine, data) {
        const baseUrls = {
            'Skyscanner': `https://www.skyscanner.de/transport/flights/${data.from}/${data.to}/${data.departDate}/${data.returnDate}`,
            'Google Flights': `https://www.google.com/travel/flights?q=flights+from+${data.from}+to+${data.to}+on+${data.departDate}+returning+${data.returnDate}`,
            'Check24': `https://flug.check24.de/suche?adults=${data.passengers}&origin=${data.from}&destination=${data.to}&departureDate=${data.departDate}&returnDate=${data.returnDate}`,
            'Kayak': `https://www.kayak.de/flights/${data.from}-${data.to}/${data.departDate}/${data.returnDate}/${data.passengers}adults`,
            'Momondo': `https://www.momondo.de/flightsearch/?search=true&origin=${data.from}&destination=${data.to}&outboundDate=${data.departDate}&inboundDate=${data.returnDate}`,
            'Lufthansa': `https://www.lufthansa.com/de/de/flug-buchen`
        };
        
        return baseUrls[engine.name] || engine.url;
    },
    
    saveCurrentSearch() {
        const searchData = this.getSearchFormData();
        
        if (!this.validateSearchData(searchData)) {
            App.showInAppNotification('Please complete the search form first', 'warning');
            return;
        }
        
        // Add unique ID
        searchData.id = App.generateId();
        searchData.name = `${searchData.from} → ${searchData.to}`;
        searchData.lastChecked = new Date().toISOString();
        
        // Add to app data
        App.data.flights.push(searchData);
        App.saveData();
        
        // Update UI
        this.loadSavedFlights();
        App.updateDashboardStats();
        App.addActivity('fas fa-plane-departure', `Saved flight search: ${searchData.name}`, 'flight');
        
        App.showInAppNotification('Flight search saved successfully!', 'success');
        
        // Request notification permission if alerts enabled
        if (searchData.enableAlerts) {
            App.requestNotificationPermission();
        }
    },
    
    loadSavedFlights() {
        const container = document.getElementById('saved-flights-container');
        if (!container) return;
        
        if (App.data.flights.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-plane-slash text-4xl mb-3 opacity-50"></i>
                    <p>No saved flight searches yet.</p>
                    <p class="text-sm mt-1">Use the search form above to start tracking flights.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = App.data.flights.map(flight => `
            <div class="dashboard-card mb-4" data-flight-id="${flight.id}">
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                            <h4 class="text-lg font-semibold text-japan-indigo">${flight.name}</h4>
                            ${flight.enableAlerts ? '<span class="badge badge-info"><i class="fas fa-bell"></i> Alerts ON</span>' : ''}
                            ${flight.directOnly ? '<span class="badge badge-success"><i class="fas fa-plane"></i> Direct</span>' : ''}
                        </div>
                        
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                            <div>
                                <i class="fas fa-calendar text-japan-blue"></i>
                                <span class="ml-1">${this.formatDateShort(flight.departDate)}</span>
                            </div>
                            <div>
                                <i class="fas fa-calendar-check text-sakura-dark"></i>
                                <span class="ml-1">${this.formatDateShort(flight.returnDate)}</span>
                            </div>
                            <div>
                                <i class="fas fa-users text-matcha"></i>
                                <span class="ml-1">${flight.passengers} passenger${flight.passengers > 1 ? 's' : ''}</span>
                            </div>
                            <div>
                                <i class="fas fa-tag text-japan-indigo"></i>
                                <span class="ml-1 capitalize">${flight.cabinClass}</span>
                            </div>
                        </div>
                        
                        <div class="text-xs text-gray-500 mt-2">
                            Last checked: ${this.formatLastChecked(flight.lastChecked)}
                        </div>
                    </div>
                    
                    <div class="flex flex-wrap gap-2">
                        <button class="btn btn-small btn-primary search-again-btn" data-flight-id="${flight.id}">
                            <i class="fas fa-search"></i>
                            <span>Search Again</span>
                        </button>
                        <button class="btn btn-small btn-outline delete-flight-btn" data-flight-id="${flight.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add event listeners
        container.querySelectorAll('.search-again-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const flightId = e.currentTarget.dataset.flightId;
                this.searchAgain(flightId);
            });
        });
        
        container.querySelectorAll('.delete-flight-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const flightId = e.currentTarget.dataset.flightId;
                this.deleteFlight(flightId);
            });
        });
    },
    
    searchAgain(flightId) {
        const flight = App.data.flights.find(f => f.id === flightId);
        if (!flight) return;
        
        // Update last checked
        flight.lastChecked = new Date().toISOString();
        App.saveData();
        
        // Display search engines
        const resultsSection = document.getElementById('flight-results');
        if (resultsSection) {
            resultsSection.classList.remove('hidden');
        }
        
        this.displaySearchEngines(flight);
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        App.showInAppNotification('Opening search engines...', 'info');
    },
    
    deleteFlight(flightId) {
        if (!confirm('Are you sure you want to delete this flight search?')) {
            return;
        }
        
        App.data.flights = App.data.flights.filter(f => f.id !== flightId);
        App.saveData();
        
        this.loadSavedFlights();
        App.updateDashboardStats();
        App.addActivity('fas fa-trash', 'Deleted a flight search', 'info');
        
        App.showInAppNotification('Flight search deleted', 'success');
    },
    
    refreshAllFlights() {
        if (App.data.flights.length === 0) {
            App.showInAppNotification('No saved flights to refresh', 'info');
            return;
        }
        
        App.data.flights.forEach(flight => {
            flight.lastChecked = new Date().toISOString();
        });
        
        App.saveData();
        this.loadSavedFlights();
        
        App.showInAppNotification('All flights refreshed!', 'success');
    },
    
    startAutoRefresh() {
        // Refresh saved flights every 6 hours
        setInterval(() => {
            this.refreshAllFlights();
        }, 6 * 60 * 60 * 1000);
    },
    
    formatDateShort(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'short' });
    },
    
    formatLastChecked(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        
        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h ago`;
        
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    }
};

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        FlightTracker.init();
    });
} else {
    FlightTracker.init();
}
