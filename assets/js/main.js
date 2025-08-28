// TRIOGEL Main JavaScript - Production Version

// ========================================
// CRITICAL: Define items array and other data IMMEDIATELY
// ========================================

// TRIOGEL Items Database - MUST BE DEFINED EARLY
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with your existing environment variables
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY  // Using SUPABASE_ANON_KEY instead of SERVICE_KEY
);

let items = [];
let cart = [];
let currentFilter = 'all';
let notificationTimeout;

// Currency configuration with real-time exchange rates
let currencies = {
    'PHP': { symbol: 'PHP', name: 'Philippine Peso', code: 'PHP', rate: 1.0 },
    'USD': { symbol: 'USD', name: 'US Dollar', code: 'USD', rate: 0.018 },
    'EUR': { symbol: 'EUR', name: 'Euro', code: 'EUR', rate: 0.016 },
    'GBP': { symbol: 'GBP', name: 'British Pound', code: 'GBP', rate: 0.014 },
    'JPY': { symbol: 'JPY', name: 'Japanese Yen', code: 'JPY', rate: 2.65 },
    'KRW': { symbol: 'KRW', name: 'Korean Won', code: 'KRW', rate: 23.5 },
    'SGD': { symbol: 'SGD', name: 'Singapore Dollar', code: 'SGD', rate: 0.024 },
    'MYR': { symbol: 'MYR', name: 'Malaysian Ringgit', code: 'MYR', rate: 0.082 },
    'THB': { symbol: 'THB', name: 'Thai Baht', code: 'THB', rate: 0.63 },
    'VND': { symbol: 'VND', name: 'Vietnamese Dong', code: 'VND', rate: 440 }
};

// Language options
const languages = {
    'EN': { symbol: 'EN', code: 'en', name: 'English', flag: '🇺🇸' },
    'FIL': { symbol: 'FIL', code: 'fil', name: 'Filipino', flag: '🇵🇭' },
    'ES': { symbol: 'ES', code: 'es', name: 'Español', flag: '🇪🇸' },
    'ZH': { symbol: 'ZH', code: 'zh', name: '中文', flag: '🇨🇳' },
    'JA': { symbol: 'JA', code: 'ja', name: '日本語', flag: '🇯🇵' }
};

let lastCurrencyUpdate = null;
let currencyUpdateInterval = null;
let selectedCurrency = 'PHP';
let selectedLanguage = 'EN';

// ========================================
// CRITICAL: Define all onclick functions IMMEDIATELY to prevent ReferenceError
// ========================================

// Essential onclick functions that MUST be globally accessible
const essentialFunctions = [
    'openCart', 'closeCart', 'openOrderTracking', 'closeOrderTracking',
    'openLoginModal', 'closeLoginModal', 'openRegisterModal', 'closeRegisterModal',
    'proceedToCheckout', 'closeCheckout', 'addToCart', 'removeFromCart',
    'toggleCurrencySelector', 'toggleUserDropdown', 'closeUserDropdown',
    'switchToLogin', 'switchToRegister', 'logoutUser', 'initAuth', 'initializeCurrencySystem',
    'openOrderHistoryModal', 'closeOrderHistoryModal', 'openProfileModal', 'closeProfileModal',
    'openForgotPassword', 'closeForgotPassword',
    'openAdminPanel', 'closeAdminPanel', 'refreshAdminData'
];

// Ensure all functions exist globally (even as placeholders initially)
essentialFunctions.forEach(funcName => {
    if (typeof window[funcName] !== 'function') {
        window[funcName] = function(...args) {
        };
    }
});

// Define modal functions immediately
window.openCart = function() {
    try {
        document.getElementById('cartModal').style.display = 'block';
        if (typeof displayCartItems === 'function') displayCartItems();
    } catch (e) { console.error('openCart error:', e); }
};

window.closeCart = function() {
    try {
        document.getElementById('cartModal').style.display = 'none';
    } catch (e) { console.error('closeCart error:', e); }
};

window.openOrderTracking = function() {
    try {
        document.getElementById('orderTrackingModal').style.display = 'block';
        const orderIdInput = document.getElementById('orderId');
        if (orderIdInput) orderIdInput.value = '';
        const orderResult = document.getElementById('orderResult');
        if (orderResult) orderResult.style.display = 'none';
    } catch (e) { console.error('openOrderTracking error:', e); }
};

window.closeOrderTracking = function() {
    try {
        document.getElementById('orderTrackingModal').style.display = 'none';
    } catch (e) { console.error('closeOrderTracking error:', e); }
};

window.openLoginModal = function() {
    try {
        document.getElementById('loginModal').style.display = 'block';
        const emailInput = document.getElementById('loginEmail');
        if (emailInput) emailInput.focus();
    } catch (e) { console.error('openLoginModal error:', e); }
};

window.closeLoginModal = function() {
    try {
        document.getElementById('loginModal').style.display = 'none';
        if (typeof clearLoginForm === 'function') clearLoginForm();
    } catch (e) { console.error('closeLoginModal error:', e); }
};

window.openRegisterModal = function() {
    try {
        document.getElementById('registerModal').style.display = 'block';
        const usernameInput = document.getElementById('registerUsername');
        if (usernameInput) usernameInput.focus();
    } catch (e) { console.error('openRegisterModal error:', e); }
};

window.closeRegisterModal = function() {
    try {
        document.getElementById('registerModal').style.display = 'none';
        if (typeof clearRegisterForm === 'function') clearRegisterForm();
    } catch (e) { console.error('closeRegisterModal error:', e); }
};

// NEW: Admin Panel Functions
window.openAdminPanel = function() {
    try {
        
        // Check if user is admin
        if (!window.TriogelAuth?.isAdmin()) {
            showNotification('Access denied. Admin privileges required.');
            return;
        }
        
        // Check if modal exists, if not create it dynamically
        let adminModal = document.getElementById('adminModal');
        if (!adminModal) {
            createAdminModal();
            adminModal = document.getElementById('adminModal');
        }
        
        // Load admin data
        loadAdminData();
        
        adminModal.style.display = 'block';
        document.body.classList.add('admin-mode');
    } catch (e) { console.error('openAdminPanel error:', e); }
};

window.closeAdminPanel = function() {
    try {
        const adminModal = document.getElementById('adminModal');
        if (adminModal) adminModal.style.display = 'none';
        document.body.classList.remove('admin-mode');
    } catch (e) { console.error('closeAdminPanel error:', e); }
};

window.refreshAdminData = function() {
    try {
        loadAdminData();
        showNotification('Admin data refreshed');
    } catch (e) { console.error('refreshAdminData error:', e); }
};

// NEW: User Profile Modal Functions
window.openProfileModal = function() {
    try {
        
        // Check if user is logged in
        const currentUser = window.TriogelAuth?.getCurrentUser();
        if (!currentUser) {
            showNotification('Please log in to view your profile');
            openLoginModal();
            return;
        }
        
        // Check if modal exists, if not create it dynamically
        let profileModal = document.getElementById('profileModal');
        if (!profileModal) {
            createProfileModal();
            profileModal = document.getElementById('profileModal');
        }
        
        // Populate profile form with current user data
        populateProfileForm(currentUser);
        
        profileModal.style.display = 'block';
        closeUserDropdown();
    } catch (e) { console.error('openProfileModal error:', e); }
};

window.closeProfileModal = function() {
    try {
        const profileModal = document.getElementById('profileModal');
        if (profileModal) profileModal.style.display = 'none';
    } catch (e) { console.error('closeProfileModal error:', e); }
};

// NEW: Order History Modal Functions
window.openOrderHistoryModal = function() {
    try {
        
        // Check if user is logged in
        const currentUser = window.TriogelAuth?.getCurrentUser();
        if (!currentUser) {
            showNotification('Please log in to view your order history');
            openLoginModal();
            return;
        }
        
        // Check if modal exists, if not create it dynamically
        let orderHistoryModal = document.getElementById('orderHistoryModal');
        if (!orderHistoryModal) {
            createOrderHistoryModal();
            orderHistoryModal = document.getElementById('orderHistoryModal');
        }
        
        // Load and display user's order history
        loadOrderHistory(currentUser);
        
        orderHistoryModal.style.display = 'block';
        closeUserDropdown();
    } catch (e) { console.error('openOrderHistoryModal error:', e); }
};

window.closeOrderHistoryModal = function() {
    try {
        const orderHistoryModal = document.getElementById('orderHistoryModal');
        if (orderHistoryModal) orderHistoryModal.style.display = 'none';
    } catch (e) { console.error('closeOrderHistoryModal error:', e); }
};

// NEW: Forgot Password Modal Functions
window.openForgotPassword = function() {
    try {
        
        // Close login modal first
        closeLoginModal();
        
        // Check if modal exists, if not create it dynamically
        let forgotPasswordModal = document.getElementById('forgotPasswordModal');
        if (!forgotPasswordModal) {
            createForgotPasswordModal();
            forgotPasswordModal = document.getElementById('forgotPasswordModal');
        }
        
        forgotPasswordModal.style.display = 'block';
        
        const emailInput = document.getElementById('forgotPasswordEmail');
        if (emailInput) emailInput.focus();
    } catch (e) { console.error('openForgotPassword error:', e); }
};

window.closeForgotPassword = function() {
    try {
        const forgotPasswordModal = document.getElementById('forgotPasswordModal');
        if (forgotPasswordModal) forgotPasswordModal.style.display = 'none';
    } catch (e) { console.error('closeForgotPassword error:', e); }
};

window.proceedToCheckout = function() {
    try {
        if (typeof cart === 'undefined' || !Array.isArray(cart) || cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        document.getElementById('cartModal').style.display = 'none';
        document.getElementById('checkoutModal').style.display = 'block';
        
        // FIXED: Update the preferred currency field with current selected currency
        const selectedCurrencyDisplay = document.getElementById('selectedCurrencyDisplay');
        if (selectedCurrencyDisplay && currencies[selectedCurrency]) {
            selectedCurrencyDisplay.value = `${currencies[selectedCurrency].code} - ${currencies[selectedCurrency].name}`;
        }
        
        // Pre-fill form with user data if logged in
        const currentUser = window.TriogelAuth?.getCurrentUser();
        if (currentUser) {
            const emailInput = document.getElementById('email');
            if (emailInput && !emailInput.value) {
                emailInput.value = currentUser.email;
            }
        }
        
        if (typeof displayOrderSummary === 'function') displayOrderSummary();
    } catch (e) { console.error('proceedToCheckout error:', e); }
};

window.closeCheckout = function() {
    try {
        document.getElementById('checkoutModal').style.display = 'none';
    } catch (e) { console.error('closeCheckout error:', e); }
};

window.addToCart = function(itemId) {
    try {
        if (typeof items === 'undefined' || !Array.isArray(items)) {
            console.error('Items array not available');
            return;
        }
        
        const item = items.find(i => i.id === itemId);
        if (!item) {
            console.error('Item not found:', itemId);
            return;
        }
        
        // Initialize cart if it doesn't exist
        if (typeof cart === 'undefined' || !Array.isArray(cart)) {
            window.cart = [];
        }
        
        const existingItem = cart.find(i => i.id === itemId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }

        if (typeof updateCartCount === 'function') updateCartCount();
        if (typeof showNotification === 'function') {
            showNotification(item.name + ' added to cart!');
        }
    } catch (e) { console.error('addToCart error:', e); }
};

window.removeFromCart = function(itemId) {
    try {
        if (typeof cart !== 'undefined' && Array.isArray(cart)) {
            cart = cart.filter(item => item.id !== itemId);
            if (typeof updateCartCount === 'function') updateCartCount();
            if (typeof displayCartItems === 'function') displayCartItems();
        }
    } catch (e) { console.error('removeFromCart error:', e); }
};

window.toggleCurrencySelector = function() {
    try {
        const dropdown = document.getElementById('currencyDropdown');
        const selector = document.getElementById('currencySelector');
        
        if (dropdown && selector) {
            const isOpen = dropdown.style.display === 'block';
            dropdown.style.display = isOpen ? 'none' : 'block';
            selector.classList.toggle('active', !isOpen);
        }
    } catch (e) { console.error('toggleCurrencySelector error:', e); }
};

window.toggleUserDropdown = function() {
    try {
        const dropdown = document.getElementById('userDropdown');
        const userBtn = document.querySelector('.user-info-btn');
        
        if (dropdown && userBtn) {
            const isOpen = dropdown.style.display === 'block';
            dropdown.style.display = isOpen ? 'none' : 'block';
            
            // Toggle active state on button without changing content
            if (isOpen) {
                userBtn.classList.remove('active');
            } else {
                userBtn.classList.add('active');
            }
        }
    } catch (e) { console.error('toggleUserDropdown error:', e); }
};

window.closeUserDropdown = function() {
    try {
        const dropdown = document.getElementById('userDropdown');
        const userBtn = document.querySelector('.user-info-btn');
        
        if (dropdown) dropdown.style.display = 'none';
        if (userBtn) userBtn.classList.remove('active');
    } catch (e) { console.error('closeUserDropdown error:', e); }
};

window.switchToLogin = function() {
    try {
        if (typeof closeRegisterModal === 'function') closeRegisterModal();
        if (typeof closeForgotPassword === 'function') closeForgotPassword();
        if (typeof openLoginModal === 'function') openLoginModal();
    } catch (e) { console.error('switchToLogin error:', e); }
};

window.switchToRegister = function() {
    try {
        if (typeof closeLoginModal === 'function') closeLoginModal();
        if (typeof closeForgotPassword === 'function') closeForgotPassword();
        if (typeof openRegisterModal === 'function') openRegisterModal();
    } catch (e) { console.error('switchToRegister error:', e); }
};

window.logoutUser = function() {
    try {
        console.log('Logging out user...');
        
        // Use the new authentication system
        window.TriogelAuth.logout();
        
    } catch (e) { console.error('logoutUser error:', e); }
};

async function fetchItems() {
    const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('active', true)
        .gt('stock', 0);

    if (error) {
        console.error('Supabase fetch error:', error);
        return;
    }
    items = data || [];
    displayItems();
}
// REAL-TIME CURRENCY FETCHING SYSTEM
async function fetchLiveExchangeRates() {
    try {
        console.log('Fetching live exchange rates from API...');
        // Using exchangerate-api.com (free tier: 1500 requests/month)
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/PHP');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Exchange rate data received:', data);
        if (data && data.rates) {
            // Update currency rates with live data
            const supportedCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'KRW', 'SGD', 'MYR', 'THB', 'VND'];
            supportedCurrencies.forEach(code => {
                if (data.rates[code] && currencies[code]) {
                    currencies[code].rate = data.rates[code];
                    currencies[code].lastUpdate = new Date().toISOString();
                    currencies[code].source = 'live';
                }
            });
            currencies['PHP'].rate = 1.0;
            currencies['PHP'].lastUpdate = new Date().toISOString();
            currencies['PHP'].source = 'base';
            lastCurrencyUpdate = new Date();
            localStorage.setItem('triogel-currency-cache', JSON.stringify({
                rates: currencies,
                lastUpdate: lastCurrencyUpdate.toISOString()
            }));
            console.log('Live exchange rates updated successfully');
            if (typeof setupCurrencySelector === 'function') setupCurrencySelector();
            if (typeof displayItems === 'function') displayItems();
            if (typeof showNotification === 'function') showNotification('Exchange rates updated with live data');
            return true;
        } else {
            throw new Error('Invalid response format from exchange rate API');
        }
    } catch (error) {
        console.error('Failed to fetch live exchange rates:', error);
        // Try fallback API (freeforexapi.com)
        try {
            console.log('Trying fallback exchange rate API...');
            const fallbackResponse = await fetch(`https://api.freeforexapi.com/v1/latest?base_currency=PHP&currencies=USD,EUR,GBP,JPY,KRW,SGD,MYR,THB,VND`);
            if (!fallbackResponse.ok) {
                throw new Error('Fallback API also failed');
            }
            const fallbackData = await fallbackResponse.json();
            if (fallbackData && fallbackData.data) {
                Object.keys(fallbackData.data).forEach(code => {
                    if (currencies[code] && fallbackData.data[code]) {
                        currencies[code].rate = fallbackData.data[code].value;
                        currencies[code].lastUpdate = new Date().toISOString();
                        currencies[code].source = 'fallback';
                    }
                });
                lastCurrencyUpdate = new Date();
                console.log('Fallback exchange rates updated successfully');
                return true;
            }
        } catch (fallbackError) {
            console.error('Fallback API also failed:', fallbackError);
        }
        // Load from cache if available
        loadCachedExchangeRates();
        if (typeof showNotification === 'function') {
            showNotification('Using cached exchange rates (offline mode)');
        }
        return false;
    }
}

function loadCachedExchangeRates() {
    try {
        const cached = localStorage.getItem('triogel-currency-cache');
        if (cached) {
            const cacheData = JSON.parse(cached);
            const cacheAge = new Date() - new Date(cacheData.lastUpdate);
            const maxCacheAge = 24 * 60 * 60 * 1000; // 24 hours
            if (cacheAge < maxCacheAge) {
                currencies = { ...currencies, ...cacheData.rates };
                lastCurrencyUpdate = new Date(cacheData.lastUpdate);
                console.log('Loaded cached exchange rates (age: ' + Math.round(cacheAge / 1000 / 60) + ' minutes)');
                return true;
            } else {
                console.log('Cached exchange rates are too old, ignoring cache');
            }
        }
    } catch (error) {
        console.error('Failed to load cached exchange rates:', error);
    }
    return false;
}

function initializeLiveCurrencySystem() {
    console.log('Initializing live currency system...');
    loadCachedExchangeRates();
    fetchLiveExchangeRates();
    if (currencyUpdateInterval) {
        clearInterval(currencyUpdateInterval);
    }
    currencyUpdateInterval = setInterval(() => {
        console.log('Automatic currency rate update...');
        fetchLiveExchangeRates();
    }, 30 * 60 * 1000); // 30 minutes
    console.log('Live currency system initialized - updates every 30 minutes');
}

window.refreshExchangeRates = function() {
    console.log('Manual currency rate refresh requested...');
    if (typeof showNotification === 'function') {
        showNotification('Updating exchange rates...');
    }
    fetchLiveExchangeRates();
};

// NEW: Helper functions for dynamic modal creation
function createAdminModal() {
    const modal = document.createElement('div');
    modal.id = 'adminModal';
    modal.className = 'modal admin-modal';
    modal.innerHTML = `
        <div class="modal-content admin-content">
            <span class="close" onclick="closeAdminPanel()">&times;</span>
            <div class="admin-header">
                <h2>Admin Panel</h2>
                <div class="admin-controls">
                    <button onclick="refreshAdminData()" class="admin-btn refresh-btn">Refresh</button>
                    <div class="admin-level-badge" id="adminLevelBadge">Admin</div>
                </div>
            </div>
            
            <div class="admin-tabs">
                <button class="admin-tab active" data-tab="orders">Orders</button>
                <button class="admin-tab" data-tab="items">Items</button>
                <button class="admin-tab" data-tab="customers">Customers</button>
                <button class="admin-tab" data-tab="analytics">Analytics</button>
            </div>
            
            <div class="admin-content-area">
                <!-- Orders Tab -->
                <div class="admin-tab-content active" id="admin-orders">
                    <div class="admin-section-header">
                        <h3>Order Management</h3>
                        <div class="admin-filters">
                            <select id="orderStatusFilter" onchange="filterOrders()">
                                <option value="">All Orders</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                    <div id="adminOrdersList" class="admin-orders-list">
                        <div class="loading">Loading orders...</div>
                    </div>
                </div>
                
                <!-- Items Tab -->
                <div class="admin-tab-content" id="admin-items">
                    <div class="admin-section-header">
                        <h3>Item Management</h3>
                        <button onclick="openAddItemModal()" class="admin-btn add-btn">+ Add New Item</button>
                    </div>
                    <div id="adminItemsList" class="admin-items-list">
                        <div class="loading">Loading items...</div>
                    </div>
                </div>
                
                <!-- Customers Tab -->
                <div class="admin-tab-content" id="admin-customers">
                    <div class="admin-section-header">
                        <h3>Customer Management</h3>
                    </div>
                    <div id="adminCustomersList" class="admin-customers-list">
                        <div class="loading">Loading customers...</div>
                    </div>
                </div>
                
                <!-- Analytics Tab -->
                <div class="admin-tab-content" id="admin-analytics">
                    <div class="admin-section-header">
                        <h3>Analytics Dashboard</h3>
                    </div>
                    <div id="adminAnalytics" class="admin-analytics">
                        <div class="loading">Loading analytics...</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Add tab switching functionality
    const tabs = modal.querySelectorAll('.admin-tab');
    const contents = modal.querySelectorAll('.admin-tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            document.getElementById(`admin-${targetTab}`).classList.add('active');
        });
    });
}

function createProfileModal() {
    const modal = document.createElement('div');
    modal.id = 'profileModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeProfileModal()">&times;</span>
            <h2>Profile Settings</h2>
            <form id="profileForm" class="auth-form">
                <div class="form-group">
                    <label>Display Name:</label>
                    <input type="text" id="profileUsername" placeholder="Your display name" required>
                </div>
                <div class="form-group">
                    <label>Email Address:</label>
                    <input type="email" id="profileEmail" placeholder="your.email@example.com" readonly>
                    <small style="color: var(--text-secondary);">Email cannot be changed</small>
                </div>
                <div class="form-group">
                    <label>Favorite Game:</label>
                    <select id="profileFavoriteGame">
                        <option value="ml">Mobile Legends: Bang Bang</option>
                        <option value="roblox">Roblox</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>New Password (leave empty to keep current):</label>
                    <input type="password" id="profileNewPassword" placeholder="New password">
                </div>
                <div class="form-group">
                    <label>Confirm New Password:</label>
                    <input type="password" id="profileConfirmPassword" placeholder="Confirm new password">
                </div>
                <button type="submit" class="auth-btn">Update Profile</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Add form handler
    const form = document.getElementById('profileForm');
    if (form) {
        form.addEventListener('submit', handleProfileUpdate);
    }
}

function createOrderHistoryModal() {
    const modal = document.createElement('div');
    modal.id = 'orderHistoryModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeOrderHistoryModal()">&times;</span>
            <h2>Order History</h2>
            <div id="orderHistoryContent" class="order-history-content">
                <div class="loading">Loading your orders...</div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function createForgotPasswordModal() {
    const modal = document.createElement('div');
    modal.id = 'forgotPasswordModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeForgotPassword()">&times;</span>
            <h2>Reset Password</h2>
            <form id="forgotPasswordForm" class="auth-form">
                <div class="form-group">
                    <label>Email Address:</label>
                    <input type="email" id="forgotPasswordEmail" placeholder="Enter your email" required>
                </div>
                <button type="submit" class="auth-btn">Send Reset Link</button>
                <div class="auth-links">
                    <button type="button" class="link-btn" onclick="switchToLogin()">Back to Login</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Add form handler
    const form = document.getElementById('forgotPasswordForm');
    if (form) {
        form.addEventListener('submit', handleForgotPassword);
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Content Loaded - Starting TRIOGEL initialization...');
    
    // Ensure the items grid exists before initializing
    const itemsGrid = document.getElementById('itemsGrid');
    if (!itemsGrid) {
        console.error('Items grid not found in DOM!');
        return;
    }
    init();
});

// Also initialize on window load as fallback
window.addEventListener('load', function () {
    console.log('Window Load event - TRIOGEL fallback initialization...');
    const itemsGrid = document.getElementById('itemsGrid');
    if (itemsGrid && !itemsGrid.innerHTML.trim()) {
        console.log('Items grid is empty, forcing initialization...');
        init();
    }
});

// Additional fallback - initialize after a short delay if nothing happened
setTimeout(() => {
    console.log('Timeout fallback - checking if TRIOGEL needs initialization...');
    const itemsGrid = document.getElementById('itemsGrid');
    if (itemsGrid && !itemsGrid.innerHTML.trim()) {
        console.log('Items grid is empty, forcing initialization...');
        init();
    }
}, 3000); // Increased timeout to 3 seconds

// Initialize everything
function init() {
    console.log('TRIOGEL Initializing...');
    
    // Check if items array exists
    if (typeof items === 'undefined' || !Array.isArray(items) || items.length === 0) {
        console.error('Items array is not available or empty!', items);
        return;
    }
    
    console.log('Items array loaded with', items.length, 'items');
    
    // Initialize live currency system first
    initializeLiveCurrencySystem();
    
    // Display items - this is the key function
    displayItems();
    fetchItems();
    updateCartCount();
    setupFilters();
    setupEventHandlers();
    setupCurrencySelector();
    updateCurrencySelector();
    setupLanguageSelector();
    
    // Add authentication status to debug
    setTimeout(() => {
        const currentUser = window.TriogelAuth?.getCurrentUser();
        console.log('Authentication initialized. Current user:', currentUser ? currentUser.username : 'Not logged in');
        
        // Show connection status
        if (navigator.onLine) {
            console.log('Online - Database authentication available');
        } else {
            console.log('Offline - Using localStorage fallback');
        }
    }, 1000);
    
    console.log('TRIOGEL Initialized successfully!');
}

// NEW: Secure Admin Data Loading Functions (Server-Verified)
async function loadAdminData() {
    try {
        const currentUser = window.TriogelAuth?.getCurrentUser();
        if (!currentUser) {
            console.error('User not logged in');
            return;
        }
        
        // Server-side admin verification
        const isAdminUser = await window.TriogelAuth.isAdmin();
        if (!isAdminUser) {
            console.error('Access denied - admin privileges required');
            showNotification('Access denied. Admin privileges required.');
            closeAdminPanel();
            return;
        }
        
        const adminLevel = await window.TriogelAuth.getAdminLevel();
        const permissions = await window.TriogelAuth.getAdminPermissions();
        
        console.log(`Loading admin data for level ${adminLevel} user`);
        
        // Update admin level badge
        const adminLevelBadge = document.getElementById('adminLevelBadge');
        if (adminLevelBadge) {
            const levelText = adminLevel === 3 ? 'Super Admin' : 
                             adminLevel === 2 ? 'Manager' : 'Basic Admin';
            adminLevelBadge.textContent = levelText;
            adminLevelBadge.className = `admin-level-badge level-${adminLevel}`;
        }
        
        // Load data based on permissions
        if (permissions.canViewOrders) {
            await loadAdminOrders();
        }
        
        // Load items management if permitted
        if (permissions.canManageItems) {
            await loadAdminItems();
        } else {
            // Hide items tab if no permission
            const itemsTab = document.querySelector('[data-tab="items"]');
            if (itemsTab) itemsTab.style.display = 'none';
        }
        
        // Load customers if permitted
        if (permissions.canViewCustomers) {
            await loadAdminCustomers();
        } else {
            // Hide customers tab if no permission
            const customersTab = document.querySelector('[data-tab="customers"]');
            if (customersTab) customersTab.style.display = 'none';
        }
        
        // Load analytics if permitted
        if (permissions.canAccessAnalytics) {
            await loadAdminAnalytics();
        } else {
            // Hide analytics tab if no permission
            const analyticsTab = document.querySelector('[data-tab="analytics"]');
            if (analyticsTab) analyticsTab.style.display = 'none';
        }
        
        console.log('Admin data loaded successfully');
        
    } catch (error) {
        console.error('Error loading admin data:', error);
        showNotification('Error loading admin data');
        closeAdminPanel();
    }
}

async function loadAdminOrders() {
    try {
        const ordersList = document.getElementById('adminOrdersList');
        if (!ordersList) return;
        
        ordersList.innerHTML = '<div class="loading">Loading orders...</div>';
        
        const currentUser = window.TriogelAuth?.getCurrentUser();
        if (!currentUser) {
            ordersList.innerHTML = '<div class="admin-error">Not logged in</div>';
            return;
        }
        
        const permissions = await window.TriogelAuth.getAdminPermissions();
        
        if (!permissions.canViewOrders) {
            ordersList.innerHTML = '<div class="admin-error">Access denied - insufficient permissions</div>';
            return;
        }
        
        try {
            // Try to fetch from Supabase database first
            const response = await fetch('/.netlify/functions/orders-api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'get_admin_orders',
                    adminEmail: currentUser.email,
                    limit: 100
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.orders) {
                    displayAdminOrders(data.orders);
                    return;
                } else {
                    console.warn('Admin API returned error:', data.error);
                }
            }
        } catch (serverError) {
            console.log('Admin API not available, using local data:', serverError.message);
        }
        
        // Fallback to localStorage (with permission check)
        const localOrders = JSON.parse(localStorage.getItem('triogel-orders') || '[]');
        displayAdminOrders(localOrders);
        
    } catch (error) {
        console.error('Error loading admin orders:', error);
        const ordersList = document.getElementById('adminOrdersList');
        if (ordersList) {
            ordersList.innerHTML = '<div class="admin-error">Error loading orders</div>';
        }
    }
}

// Add placeholder functions for admin actions
window.updateOrderStatus = async function(orderId, newStatus) {
    try {
        console.log('Updating order status:', orderId, newStatus);
        
        try {
            // Try to update in Supabase database first
            const response = await fetch('/.netlify/functions/orders-api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'update_order_status',
                    orderId: orderId,
                    newStatus: newStatus
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    // Refresh admin orders display
                    loadAdminOrders();
                    showNotification(`Order ${orderId} status updated to ${newStatus}`);
                    return;
                } else {
                    console.error('Failed to update order in database:', data.error);
                }
            }
        } catch (serverError) {
            console.log('Database update failed, updating localStorage:', serverError.message);
        }
        
        // Fallback: Update in localStorage
        const orders = JSON.parse(localStorage.getItem('triogel-orders') || '[]');
        const orderIndex = orders.findIndex(order => order.orderId === orderId);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = newStatus;
            localStorage.setItem('triogel-orders', JSON.stringify(orders));
            
            // Refresh admin orders display
            loadAdminOrders();
            
            showNotification(`Order ${orderId} status updated to ${newStatus} (local only)`);
        } else {
            showNotification('Order not found');
        }
        
    } catch (error) {
        console.error('updateOrderStatus error:', error);
        showNotification('Error updating order status');
    }
};

function displayAdminOrders(orders) {
    try {
        const ordersList = document.getElementById('adminOrdersList');
        if (!ordersList) return;
        
        if (!orders || orders.length === 0) {
            ordersList.innerHTML = '<div class="admin-empty">No orders found</div>';
            return;
        }
        
        ordersList.innerHTML = orders.map(order => {
            // Handle both database format (triogel_orders) and localStorage format
            const orderId = order.order_id || order.orderId;
            const customerEmail = order.customer_email || order.email;
            const gameUsername = order.customer_game_username || order.gameUsername;
            const paymentMethod = order.payment_method || order.paymentMethod;
            const orderTotal = order.order_total || order.total;
            const orderStatus = order.order_status || order.status || 'pending';
            const createdAt = order.created_at || order.timestamp;
            const orderItems = order.triogel_order_items || order.items || [];
            
            return `
                <div class="admin-order-item">
                    <div class="order-header">
                        <h4>Order ${orderId}</h4>
                        <span class="order-status status-${orderStatus}">${orderStatus.toUpperCase()}</span>
                    </div>
                    <div class="order-details">
                        <p><strong>Customer:</strong> ${customerEmail}</p>
                        <p><strong>Game Username:</strong> ${gameUsername}</p>
                        <p><strong>Total:</strong> ${formatPrice(orderTotal)}</p>
                        <p><strong>Payment:</strong> ${paymentMethod}</p>
                        <p><strong>Date:</strong> ${new Date(createdAt).toLocaleDateString()}</p>
                    </div>
                    <div class="order-items">
                        <h5>Items:</h5>
                        ${orderItems.map(item => {
                            // Handle both database and localStorage item formats
                            const itemName = item.item_name || item.name;
                            const itemGame = item.item_game || item.game;
                            const quantity = item.quantity;
                            
                            return `
                                <div class="admin-order-item-detail">
                                    ${itemName} (${itemGame.toUpperCase()}) x${quantity}
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <div class="admin-order-actions">
                        <button onclick="updateOrderStatus('${orderId}', 'processing')" class="admin-btn processing-btn">Mark Processing</button>
                        <button onclick="updateOrderStatus('${orderId}', 'completed')" class="admin-btn completed-btn">Mark Completed</button>
                    </div>
                </div>
            `;
        }).join('');
        
    } catch (error) {
        console.error('displayAdminOrders error:', error);
        const ordersList = document.getElementById('adminOrdersList');
        if (ordersList) {
            ordersList.innerHTML = '<div class="admin-error">Error displaying orders</div>';
        }
    }
}

// Debugging modifications - more detailed logging for item display issues
function displayItems() {
    const grid = document.getElementById('itemsGrid');
    if (!grid) {
        console.error('Items grid element not found!');
        return;
    }
    
    const filteredItems = currentFilter === 'all' ? items : items.filter(item => item.game === currentFilter);
    if (filteredItems.length === 0) {
        grid.innerHTML = '<div class="no-items">No items available for the selected filter.</div>';
        return;
    }

    grid.innerHTML = filteredItems.map(item => `
        <div class="item-card ${item.game}-item" data-game="${item.game}">
            <div class="item-header">
                <div class="game-tag ${item.game}-tag">${gameNames[item.game]}</div>
                <div class="rarity-badge rarity-${item.rarity}">${item.rarity}</div>
            </div>
            <div class="item-image ${item.game}-bg">
                <div class="item-icon">${item.icon}</div>
            </div>
            <div class="item-name">${item.name}</div>
            <div class="item-description">${item.description}</div>
            <div class="item-stats">
                ${Object.entries(item.stats).map(([key, value]) => `
                    <div class="stat">
                        <div class="stat-value">${value}</div>
                        <div class="stat-label">${key}</div>
                    </div>
                `).join('')}
            </div>
            <div class="item-price">${formatPrice(item.price)}</div>
            <button class="add-to-cart-btn" onclick="addToCart(${item.id})">Add to Cart</button>
        </div>
    `).join('');
}

function formatPrice(price) {
    // Use selectedCurrency and currencies object to format price
    const currency = currencies[selectedCurrency] || currencies['PHP'];
    const converted = price * currency.rate;
    // Format with 2 decimals and currency symbol
    return `${currency.symbol} ${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function initializeLiveCurrencySystem() {
    console.log('Initializing live currency system...');
    loadCachedExchangeRates();
    fetchLiveExchangeRates();
    if (currencyUpdateInterval) {
        clearInterval(currencyUpdateInterval);
    }
    currencyUpdateInterval = setInterval(() => {
        console.log('Automatic currency rate update...');
        fetchLiveExchangeRates();
    }, 30 * 60 * 1000); // 30 minutes
    console.log('Live currency system initialized - updates every 30 minutes');
}

function updateCartCount() {
    // Find the cart count element (adjust selector as needed)
    const cartCountElem = document.getElementById('cartCount');
    if (!cartCountElem) return;
    // Calculate total quantity in cart
    const total = Array.isArray(cart) ? cart.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0;
    cartCountElem.textContent = total;
}
function setupFilters() {
    const filterContainer = document.getElementById('filterContainer');
    if (!filterContainer) return;

    // Remove dynamic creation, just update active state and listeners
    const buttons = filterContainer.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === currentFilter) {
            btn.classList.add('active');
        }
        btn.onclick = function () {
            currentFilter = btn.dataset.filter;
            displayItems();
            setupFilters();
        };
    });
}
function setupEventHandlers() {
    // Cart modal close
    const cartCloseBtn = document.querySelector('#cartModal .close');
    if (cartCloseBtn) cartCloseBtn.onclick = closeCart;

    // Checkout modal close
    const checkoutCloseBtn = document.querySelector('#checkoutModal .close');
    if (checkoutCloseBtn) checkoutCloseBtn.onclick = closeCheckout;

    // Currency selector
    const currencySelector = document.getElementById('currencySelector');
    if (currencySelector) currencySelector.onclick = toggleCurrencySelector;

    // User dropdown
    const userBtn = document.querySelector('.user-info-btn');
    if (userBtn) userBtn.onclick = toggleUserDropdown;

    // Cart icon
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) cartIcon.onclick = openCart;
}
document.addEventListener('click', function (event) {
    const currencyDropdown = document.getElementById('currencyDropdown');
    const currencySelector = document.getElementById('currencySelector');
    const languageDropdown = document.getElementById('languageDropdown');
    const languageSelector = document.getElementById('languageSelector');

    if (currencyDropdown && currencySelector)
    {
        // If dropdown is open and click is outside selector and dropdown, close it
        if (currencyDropdown.style.display === 'block') {
            if (!currencySelector.contains(event.target) && !currencyDropdown.contains(event.target)) {
                currencyDropdown.style.display = 'none';
                currencySelector.classList.remove('active');
            }
        }
    }
    if (languageDropdown && languageSelector)
    {
        // If dropdown is open and click is outside selector and dropdown, close it
        if (languageDropdown.style.display === 'block') {
            if (!languageSelector.contains(event.target) && !languageDropdown.contains(event.target)) {
                languageDropdown.style.display = 'none';
                languageSelector.classList.remove('active');
            }
        }
    }
});
function setupCurrencySelector() {
    const dropdown = document.getElementById('currencyDropdown');
    if (!dropdown) return;
    dropdown.innerHTML = '';
    const isLive = !!lastCurrencyUpdate;
    Object.keys(currencies).forEach(code => {
        const rate = currencies[code].rate;
        const option = document.createElement('div');
        option.className = 'currency-option';
        option.innerHTML = `
            <span>${currencies[code].symbol} - ${currencies[code].name}</span>
            <span style="margin-left:8px; color:#aaa; font-size:0.9em;">
                1 PHP = ${rate} ${code}
                ${isLive ? '<span class="rate-badge live">Live</span>' : '<span class="rate-badge static">Static</span>'}
            </span>
        `;
        option.onclick = function () {
            selectedCurrency = code;
            updateCurrencySelector();
            displayItems();
            // Close dropdown after selection
            dropdown.style.display = 'none';
            const selector = document.getElementById('currencySelector');
            if (selector) selector.classList.remove('active');
        };
        dropdown.appendChild(option);
    });
}
window.toggleLanguageSelector = function() {
    const dropdown = document.getElementById('languageDropdown');
    const selector = document.getElementById('languageSelector');
    if (dropdown && selector) {
        const isOpen = dropdown.style.display === 'block';
        dropdown.style.display = isOpen ? 'none' : 'block';
        selector.classList.toggle('active', !isOpen);
    }
};

function setupLanguageSelector() {
    const dropdown = document.getElementById('languageDropdown');
    if (!dropdown) return;
    dropdown.innerHTML = '';
    Object.keys(languages).forEach(code => {
        const option = document.createElement('div');
        option.className = 'currency-option';
        option.innerHTML = `
            <span>${languages[code].flag} ${languages[code].name}</span>
        `;
        option.onclick = function () {
            selectedLanguage = code;
            updateLanguageSelector();
            // Close dropdown after selection
            dropdown.style.display = 'none';
            const selector = document.getElementById('languageSelector');
            if (selector) selector.classList.remove('active');
        };
        dropdown.appendChild(option);
    });
}

function updateCurrencySelector() {
    const currencyText = document.getElementById('selectedCurrency');
    if (currencyText && currencies[selectedCurrency])
    {
        currencyText.textContent = currencies[selectedCurrency].symbol;
    }
}
function updateLanguageSelector() {
    const currencyText = document.getElementById('selectedLanguage');
    if (currencyText && languages[selectedLanguage]) {
        currencyText.textContent = languages[selectedLanguage].flag;
    }
}
function displayCartItems() {
    const cartList = document.getElementById('cartItems');
    if (!cartList) return;
    if (!cart || cart.length === 0) {
        cartList.innerHTML = '<div class="empty-cart">Your cart is empty.</div>';
        return;
    }
    cartList.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span class="cart-item-name">${item.name}</span>
            <span class="cart-item-qty">x${item.quantity}</span>
            <span class="cart-item-price">${formatPrice(item.price * item.quantity)}</span>
            <button class="remove-cart-btn" data-id="${item.id}" aria-label="Remove from cart">&times;</button>
        </div>
    `).join('');
    // Optionally show total
    const cartTotalElem = document.getElementById('cartTotal');
    if (cartTotalElem) {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartTotalElem.textContent = formatPrice(total);
    }
    // Event delegation for remove buttons
    cartList.onclick = function (e) {
        if (e.target.classList.contains('remove-cart-btn')) {
            const itemId = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(itemId);
        }
    };
}
function showNotification(message, type = 'info') {
    let notif = document.getElementById('notification');
    if (!notif) {
        notif = document.createElement('div');
        notif.id = 'notification';
        notif.className = 'notification';
        document.body.appendChild(notif);
    }
    notif.textContent = message;
    notif.className = `notification ${type}`;
    notif.style.display = 'block';

    // Clear previous timeout if exists
    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }
    notificationTimeout = setTimeout(() => {
        notif.style.display = 'none';
        notificationTimeout = null;
    }, 2500);
}
function populateProfileForm(user) {
    if (!user) return;
    document.getElementById('profileUsername').value = user.username || '';
    document.getElementById('profileEmail').value = user.email || '';
    document.getElementById('profileFavoriteGame').value = user.favoriteGame || 'ml';
}
function handleProfileUpdate(event) {
    event.preventDefault();
    // Collect form data
    const username = document.getElementById('profileUsername').value;
    const newPassword = document.getElementById('profileNewPassword').value;
    const confirmPassword = document.getElementById('profileConfirmPassword').value;
    const favoriteGame = document.getElementById('profileFavoriteGame').value;
    // Basic validation
    if (newPassword && newPassword !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    // Update user profile (assume TriogelAuth has updateProfile)
    window.TriogelAuth.updateProfile({ username, newPassword, favoriteGame })
        .then(() => showNotification('Profile updated!', 'success'))
        .catch(() => showNotification('Failed to update profile', 'error'));
}
function loadOrderHistory(user) {
    const historyContent = document.getElementById('orderHistoryContent');
    if (!historyContent || !user) return;
    historyContent.innerHTML = '<div class="loading">Loading your orders...</div>';
    // Example: fetch from localStorage or API
    let orders = [];
    try {
        orders = JSON.parse(localStorage.getItem('triogel-orders') || '[]')
            .filter(order => order.email === user.email);
    } catch { }
    if (!orders.length) {
        historyContent.innerHTML = '<div class="empty-orders">No orders found.</div>';
        return;
    }
    historyContent.innerHTML = orders.map(order => `
        <div class="order-history-item">
            <div><strong>Order #${order.orderId || order.order_id}</strong> - ${order.status || 'pending'}</div>
            <div>${new Date(order.timestamp || order.created_at).toLocaleString()}</div>
            <div>Total: ${formatPrice(order.total || order.order_total)}</div>
        </div>
    `).join('');
}
function handleForgotPassword(event) {
    event.preventDefault();
    const email = document.getElementById('forgotPasswordEmail').value;
    if (!email) {
        showNotification('Please enter your email', 'error');
        return;
    }
    // Assume TriogelAuth has sendPasswordReset
    window.TriogelAuth.sendPasswordReset(email)
        .then(() => showNotification('Reset link sent!', 'success'))
        .catch(() => showNotification('Failed to send reset link', 'error'));
}
function openAddItemModal() {
    let modal = document.getElementById('addItemModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'addItemModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="document.getElementById('addItemModal').style.display='none'">&times;</span>
                <h2>Add New Item</h2>
                <form id="addItemForm">
                    <input type="text" id="newItemName" placeholder="Item Name" required>
                    <input type="number" id="newItemPrice" placeholder="Price" required>
                    <select id="newItemGame">
                        <option value="ml">Mobile Legends</option>
                        <option value="roblox">Roblox</option>
                    </select>
                    <button type="submit">Add Item</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('addItemForm').onsubmit = function (e) {
            e.preventDefault();
            // Add item logic here
            modal.style.display = 'none';
            showNotification('Item added (demo only)', 'success');
        };
    }
    modal.style.display = 'block';
}
function loadAdminItems() {
    const itemsList = document.getElementById('adminItemsList');
    if (!itemsList) return;
    itemsList.innerHTML = items.map(item => `
        <div class="admin-item">
            <span>${item.name}</span>
            <span>${formatPrice(item.price)}</span>
            <span>${gameNames[item.game]}</span>
            <span>${item.rarity}</span>
        </div>
    `).join('');
}
function loadAdminCustomers() {
    const customersList = document.getElementById('adminCustomersList');
    if (!customersList) return;
    // Example: fetch from localStorage or API
    let customers = [];
    try {
        customers = JSON.parse(localStorage.getItem('triogel-customers') || '[]');
    } catch { }
    if (!customers.length) {
        customersList.innerHTML = '<div class="empty-customers">No customers found.</div>';
        return;
    }
    customersList.innerHTML = customers.map(cust => `
        <div class="admin-customer">
            <span>${cust.username || cust.email}</span>
            <span>${cust.email}</span>
        </div>
    `).join('');
}
function loadAdminAnalytics() {
    const analyticsElem = document.getElementById('adminAnalytics');
    if (!analyticsElem) return;
    // Example: show total sales and orders
    let orders = [];
    try {
        orders = JSON.parse(localStorage.getItem('triogel-orders') || '[]');
    } catch { }
    const totalSales = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    analyticsElem.innerHTML = `
        <div><strong>Total Orders:</strong> ${orders.length}</div>
        <div><strong>Total Sales:</strong> ${formatPrice(totalSales)}</div>
    `;
}