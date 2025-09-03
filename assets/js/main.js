// LilyBlock Online Shop Main JavaScript - Production Version

// ========================================
// CRITICAL: Define items array and other data IMMEDIATELY
// ========================================

// LilyBlock Online Shop Items Database - MUST BE DEFINED EARLY
let items = [];
let cart = [];
let currentFilter = 'all';
let notificationTimeout;
const gameNames = {
    'ml': 'Mobile Legends: Bang Bang',
    'roblox': 'Roblox'
};

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

window.filterOrders = async function () {
    const status = document.getElementById('orderStatusFilter').value;
    const ordersList = document.getElementById('adminOrdersList');
    if (ordersList) {
        ordersList.innerHTML = '<div class="loading">Loading orders...</div>';
    }

    try {
        const currentUser = window.TriogelAuth?.getCurrentUser();
        if (!currentUser) {
            if (ordersList) ordersList.innerHTML = '<div class="admin-error">Not logged in</div>';
            return;
        }

        // Fetch filtered orders from Supabase via Netlify function
        const response = await fetch('/.netlify/functions/orders-api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'get_admin_orders',
                adminEmail: currentUser.email,
                status: status || undefined, // send undefined for "All Orders"
                limit: 100
            })
        });

        const data = await response.json();
        if (data.success && Array.isArray(data.orders)) {
            displayAdminOrders(data.orders);
        } else {
            if (ordersList) ordersList.innerHTML = '<div class="admin-error">Failed to load orders</div>';
        }
    } catch (error) {
        if (ordersList) ordersList.innerHTML = '<div class="admin-error">Error loading orders</div>';
    }
};

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
    try {
        const response = await fetch('/.netlify/functions/get-items');
        const result = await response.json();
        if (result.success && Array.isArray(result.items)) {
            items = result.items;
        } else {
            // Friendly error for local/dev
            showNotification('Cannot connect to database (local mode)', 'error');
            items = [];
        }
    } catch (error) {
        // Friendly error for local/dev
        showNotification('Cannot connect to database (local mode)', 'error');
        items = [];
        // Optionally log error only in production
        if (window.location.hostname !== 'localhost') {
            console.error('Fetch items error:', error);
        }
    }
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

function createAdminModal() {
    // Only add styles once
    if (!document.getElementById('adminModalStyles')) {
        const style = document.createElement('style');
        style.id = 'adminModalStyles';
        style.textContent = `
        .admin-modal {
            position: fixed; top:0; left:0; width:100vw; height:100vh;
            background: rgba(24,28,38,0.85); z-index:9999;
            display: flex; align-items: center; justify-content: center;
        }
        .admin-content {
            background: rgba(34,38,54,0.95);
            border-radius: 18px; box-shadow: 0 8px 32px rgba(0,0,0,0.35);
            padding: 2.5rem 2rem; max-width: 900px; width: 98vw;
            min-height: 540px; display: flex; flex-direction: column;
            animation: adminFadeIn 0.3s;
        }
        @keyframes adminFadeIn { from { opacity:0; transform:scale(0.97);} to { opacity:1; transform:scale(1);} }
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem; }
        .admin-header h2 { font-size: 2rem; color: #f1c40f; margin: 0; }
        .admin-controls { display: flex; align-items: center; gap: 1rem; }
        .admin-level-badge { background: #23272f; color: #f1c40f; border-radius: 6px; padding: 0.3rem 1rem; font-weight: 600; font-size: 1rem; }
        .admin-btn { background: #e67e22; color: #fff; border: none; border-radius: 6px; padding: 0.5rem 1.2rem; font-size: 1rem; font-weight: 500; cursor: pointer; transition: background 0.2s, color 0.2s; }
        .admin-btn:hover { background: #f1c40f; color: #23272f; }
        .refresh-btn { background: #23272f; color: #e67e22; border: 1px solid #e67e22; }
        .refresh-btn:hover { background: #e67e22; color: #fff; }
        .admin-tabs { display: flex; gap: 0.5rem; margin-bottom: 1.2rem; }
        .admin-tab { background: #23272f; color: #fff; border: none; border-radius: 6px 6px 0 0; padding: 0.7rem 1.2rem; font-size: 1rem; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: background 0.2s, color 0.2s; }
        .admin-tab.active { background: #e67e22; color: #fff; }
        .admin-tab:hover:not(.active) { background: #2c313c; color: #f1c40f; }
        .admin-content-area { background: #23272f; border-radius: 0 0 12px 12px; padding: 1.2rem; flex: 1; overflow-y: auto; }
        .admin-tab-content { display: none; }
        .admin-tab-content.active { display: block; }
        .admin-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .admin-section-header h3 { color: #f1c40f; margin: 0; font-size: 1.2rem; }
        .admin-filters select { background: #23272f; color: #fff; border: 1px solid #e67e22; border-radius: 4px; padding: 0.3rem 0.7rem; }
        .admin-orders-list, .admin-items-list, .admin-users-list, .admin-analytics { margin-top: 0.5rem; }
        .admin-order-item, .admin-item, .admin-user-item { background: #2c313c; border-radius: 8px; margin-bottom: 0.7rem; padding: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .order-header { display: flex; justify-content: space-between; align-items: center; }
        .order-status { font-weight: 600; border-radius: 4px; padding: 0.2rem 0.7rem; }
        .status-pending { background: #f1c40f22; color: #f1c40f; }
        .status-processing { background: #3498db22; color: #3498db; }
        .status-completed { background: #2ecc4022; color: #2ecc40; }
        .status-cancelled { background: #e74c3c22; color: #e74c3c; }
        .admin-order-actions { display: flex; gap: 0.5rem; margin-top: 0.7rem; }
        .admin-btn.processing-btn { background: #3498db; }
        .admin-btn.completed-btn { background: #2ecc40; }
        .admin-btn.cancel-btn { background: #e74c3c; }
        .admin-btn.add-btn { background: #27ae60; }
        .admin-btn.add-btn:hover { background: #2ecc40; }
        .loading { color: #aaa; text-align: center; padding: 1.2rem 0; }
        .admin-empty, .admin-error { color: #e74c3c; text-align: center; padding: 1rem 0; }
        @media (max-width: 700px) {
            .admin-content { padding: 1rem 0.2rem; min-width: 0; max-width: 99vw; }
            .admin-header h2 { font-size: 1.3rem; }
            .admin-tabs { flex-wrap: wrap; }
            .admin-content-area { padding: 0.5rem; }
        }
        .modal-content .close {
            position: absolute; top: 18px; right: 22px; font-size: 1.5rem;
            color: #f1c40f; cursor: pointer; background: none; border: none;
        }
        `;
        document.head.appendChild(style);
    }

    const modal = document.createElement('div');
    modal.id = 'adminModal';
    modal.className = 'modal admin-modal';
    modal.innerHTML = `
        <div class="modal-content admin-content">
            <span class="close" onclick="closeAdminPanel()">&times;</span>
            <div class="admin-header">
                <h2><span style="vertical-align:middle;">&#9881;</span> Admin Panel</h2>
                <div class="admin-controls">
                    <button onclick="refreshAdminData()" class="admin-btn refresh-btn">&#x21bb; Refresh</button>
                    <div class="admin-level-badge" id="adminLevelBadge">Admin</div>
                </div>
            </div>
            <div class="admin-tabs">
                <button class="admin-tab active" data-tab="orders">&#128179; Orders</button>
                <button class="admin-tab" data-tab="items">&#128722; Items</button>
                <button class="admin-tab" data-tab="users">&#128100; Users</button>
                <button class="admin-tab" data-tab="analytics">&#128202; Analytics</button>
            </div>
            <div class="admin-content-area">
                <!-- Orders Tab -->
                <div class="admin-tab-content active" id="admin-orders">
                    <div class="admin-section-header">
                        <h3>&#128179; Order Management</h3>
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
                        <h3>&#128722; Item Management</h3>
                        <button onclick="openAddItemModal()" class="admin-btn add-btn">+ Add New Item</button>
                    </div>
                    <div id="adminItemsList" class="admin-items-list">
                        <div class="loading">Loading items...</div>
                    </div>
                </div>
                <!-- Users Tab -->
                <div class="admin-tab-content" id="admin-users">
                    <div class="admin-section-header">
                        <h3>&#128100; Customer Management</h3>
                    </div>
                    <div id="adminUsersList" class="admin-users-list">
                        <div class="loading">Loading users...</div>
                    </div>
                </div>
                <!-- Analytics Tab -->
                <div class="admin-tab-content" id="admin-analytics">
                    <div class="admin-section-header">
                        <h3>&#128202; Analytics Dashboard</h3>
                    </div>
                    <div id="adminAnalytics" class="admin-analytics">
                        <div class="analytics-grid">
                            <div class="analytics-row">
                                <div class="analytics-card highlight">
                                    <div class="analytics-label">Total Orders</div>
                                    <div class="analytics-value" id="analytics-total-orders">0</div>
                                </div>
                                <div class="analytics-card highlight">
                                    <div class="analytics-label">Total Sales</div>
                                    <div class="analytics-value" id="analytics-total-sales">₱0.00</div>
                                </div>
                                <div class="analytics-card">
                                    <div class="analytics-label">Avg. Order Value</div>
                                    <div class="analytics-value" id="analytics-average-order">₱0.00</div>
                                </div>
                                <div class="analytics-card">
                                    <div class="analytics-label">Recent Orders (7d)</div>
                                    <div class="analytics-value" id="analytics-recent-orders">0</div>
                                </div>
                                <div class="analytics-card">
                                    <div class="analytics-label">Conversion Rate</div>
                                    <div class="analytics-value" id="analytics-conversion-rate">0%</div>
                                </div>
                            </div>
                            <div class="analytics-row">
                                <div class="analytics-card wide">
                                    <div class="analytics-label">Order Status Breakdown</div>
                                    <ul class="analytics-list">
                                        <li><span class="status-pending">&#9679;</span> Pending: <span id="analytics-status-pending">0</span></li>
                                        <li><span class="status-processing">&#9679;</span> Processing: <span id="analytics-status-processing">0</span></li>
                                        <li><span class="status-completed">&#9679;</span> Completed: <span id="analytics-status-completed">0</span></li>
                                        <li><span class="status-cancelled">&#9679;</span> Cancelled: <span id="analytics-status-cancelled">0</span></li>
                                    </ul>
                                </div>
                                <div class="analytics-card wide">
                                    <div class="analytics-label">Top Payment Methods</div>
                                    <ul class="analytics-list" id="analytics-payment-methods"></ul>
                                </div>
                            </div>
                            <div class="analytics-row">
                                <div class="analytics-card wide">
                                    <div class="analytics-label">Top Items Sold</div>
                                    <ul class="analytics-list" id="analytics-top-items"></ul>
                                </div>
                                <div class="analytics-card wide">
                                    <div class="analytics-label">Top Games Sold</div>
                                    <ul class="analytics-list" id="analytics-top-games"></ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <!-- End of Analytics Tab -->
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Tab switching functionality
    const tabs = modal.querySelectorAll('.admin-tab');
    const contents = modal.querySelectorAll('.admin-tab-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
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
    console.log('DOM Content Loaded - Starting LilyBlock Online Shop initialization...');
    fetchItems().then(() => {
        init();
    });
    // Register form handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.onsubmit = async function (e) {
            e.preventDefault();
            const registerBtn = document.getElementById('registerBtn');
            if (registerBtn) {
                registerBtn.disabled = true;
                registerBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating Account...`;
            }

            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const favoriteGame = document.getElementById('registerFavoriteGame')?.value || 'ml';
            try {
                const response = await window.TriogelAuth.register({ username, email, password, confirmPassword, favoriteGame });
                if (response && response.success && !response.user.offline) {
                    showNotification('Registration successful! Please check your email for the verification code.', 'success');
                    showOtpModal(email, response.timeRemaining);
                }
                else {
                    showNotification(response?.message || 'Registration failed', 'error');
                }
            } catch (err) {
                showNotification(err.message, 'error');
            } finally {
                if (registerBtn) {
                    registerBtn.disabled = false;
                    registerBtn.innerHTML = `Create Account`;
                }
            }
        };
    }

    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.onsubmit = async function (e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const loginBtn = loginForm.querySelector('.auth-btn');
            if (loginBtn) {
                loginBtn.disabled = true;
                loginBtn.innerHTML = `<span class="spinner"></span> Logging in...`;
            }
            try {
                await window.TriogelAuth.login({ email, password });
                closeLoginModal();
            } catch (err) {
                showNotification(err.message, 'error');
            } finally {
                if (loginBtn) {
                    loginBtn.disabled = false;
                    loginBtn.innerHTML = `Login`;
                }
            }
        };
    }

    // Checkout form handler
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.onsubmit = async function (e) {
            e.preventDefault();

            // Collect form data
            const email = document.getElementById('email').value;
            const gameUsername = document.getElementById('gameUsername').value;
            const whatsappNumber = document.getElementById('whatsappNumber')?.value || '';
            const customerRegion = document.getElementById('serverRegion')?.value || '';
            const customerNotes = document.getElementById('customerNotes')?.value || '';
            const paymentMethod = document.getElementById('paymentMethod').value;
            const currency = selectedCurrency;
            const orderId = generateOrderId();
            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

            // Prepare items for backend
            const itemsForOrder = cart.map(item => ({
                id: item.id,
                name: item.name,
                game: item.game,
                price: item.price,
                quantity: item.quantity
            }));

            // Build order data
            const orderData = {
                orderId,
                email,
                gameUsername,
                whatsappNumber,
                customerRegion,
                customerNotes,
                paymentMethod,
                currency,
                total,
                items: itemsForOrder,
                timestamp: new Date().toISOString()
            };

            // Show loading state
            const completeBtn = checkoutForm.querySelector('.complete-purchase-btn');
            if (completeBtn) {
                completeBtn.disabled = true;
                completeBtn.innerHTML = `<span class="spinner"></span> Processing...`;
            }

            try {
                const response = await fetch('/.netlify/functions/process-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });
                const result = await response.json();
                if (result.success) {
                    showNotification('Order placed successfully!', 'success');
                    cart = [];
                    updateCartCount();
                    displayCartItems();
                    document.getElementById('checkoutModal').style.display = 'none';
                } else {
                    showNotification(result.message || 'Order failed', 'error');
                }
            } catch (err) {
                showNotification('Order processing error', 'error');
            } finally {
                if (completeBtn) {
                    completeBtn.disabled = false;
                    completeBtn.innerHTML = `Complete Purchase`;
                }
            }
        };
    }

    //Mobile Design
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const drawer = document.getElementById('mobileNavDrawer');
    const closeBtn = document.querySelector('.mobile-drawer-close');
    if (menuBtn && drawer && closeBtn) {
        menuBtn.addEventListener('click', () => {
            drawer.classList.add('open');
        });
        closeBtn.addEventListener('click', () => {
            drawer.classList.remove('open');
        });
        // Optional: close drawer when clicking outside
        drawer.addEventListener('click', (e) => {
            if (e.target === drawer) {
                drawer.classList.remove('open');
            }
        });
    }
});

// Also initialize on window load as fallback
window.addEventListener('load', function () {
    console.log('Window Load event - LilyBlock Online Shop fallback initialization...');
    const itemsGrid = document.getElementById('itemsGrid');
    if (itemsGrid && !itemsGrid.innerHTML.trim()) {
        console.log('Items grid is empty, forcing initialization...');
        init();
    }
});

// Additional fallback - initialize after a short delay if nothing happened
setTimeout(() => {
    console.log('Timeout fallback - checking if LilyBlock Online Shop needs initialization...');
    const itemsGrid = document.getElementById('itemsGrid');
    if (itemsGrid && !itemsGrid.innerHTML.trim()) {
        console.log('Items grid is empty, forcing initialization...');
        init();
    }
}, 3000); // Increased timeout to 3 seconds

// Initialize everything
function init() {
    console.log('LilyBlock Online Shop Initializing...');
    if (typeof items === 'undefined' || !Array.isArray(items) || items.length === 0) {
        showNotification('No items available. Cannot connect to database (local mode)', 'error');
        return;
    }
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
            console.log('Offline');
        }
    }, 1000);
    
    console.log('LilyBlock Online Shop Initialized successfully!');
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
            // Always use the current filter value
            await filterOrders();
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
            await loadAdminUsers();
        } else {
            // Hide customers tab if no permission
            const customersTab = document.querySelector('[data-tab="users"]');
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
        // Always use the current filter value
        await filterOrders();
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
            console.log('Database update failed:', serverError.message);
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
            const orderId = order.order_id;
            const customerEmail = order.customer_email;
            const gameUsername = order.customer_game_username;
            const paymentMethod = order.payment_method;
            const orderTotal = Number(order.total_amount ?? 0);
            const orderStatus = order.status || 'pending';
            const createdAt = order.created_at;
            const region = order.customer_region || '';
            const whatsapp = order.customer_whatsapp || '';
            const notes = order.customer_notes || '';
            const adminNotes = order.admin_notes || '';
            const orderItems = order.order_items || order.items || [];

            return `
                <div class="admin-order-item">
                    <div class="order-header" style="
                        display: flex; 
                        justify-content: space-between; 
                        align-items: flex-start; 
                        border-bottom: 1px solid #444; 
                        padding-bottom: 6px; 
                        margin-bottom: 8px;
                    ">
                        <div>
                            <div style="font-size:1.1em; font-weight:700; color:#f1c40f;">
                                #${orderId}
                            </div>
                            <div style="font-size:0.97em; color:#aaa;">
                                ${customerEmail}
                            </div>
                            <div style="font-size:0.95em; color:#aaa;">
                                ${gameUsername}${region ? ' &bull; ' + region : ''}
                            </div>
                        </div>
                        <div style="text-align:right;">
                            <span class="order-status status-${orderStatus}" style="
                                display:inline-block; 
                                margin-bottom:4px; 
                                font-size:1em; 
                                font-weight:600;
                            ">
                                ${orderStatus.toUpperCase()}
                            </span>
                            <div style="font-size:0.95em; color:#aaa;">
                                ${new Date(createdAt).toLocaleString()}
                            </div>
                            <div style="font-size:0.95em; color:#aaa;">
                                ${paymentMethod}
                            </div>
                        </div>
                    </div>
                    <div class="order-details" style="margin-bottom:8px;">
                        <p style="margin:2px 0;"><strong>Total:</strong> ${formatPrice(orderTotal)}</p>
                        ${whatsapp ? `<p style="margin:2px 0;"><strong>WhatsApp:</strong> ${whatsapp}</p>` : ''}
                        ${notes ? `<p style="margin:2px 0;"><strong>Customer Notes:</strong> ${notes}</p>` : ''}
                        ${adminNotes ? `<p style="margin:2px 0; color:#e67e22;"><strong>Admin Notes:</strong> ${adminNotes}</p>` : ''}
                    </div>
                    <div class="order-items">
                        <h5 style="margin-bottom:4px;">Items:</h5>
                        ${orderItems.map(item => {
                const itemName = item.item_name || item.name;
                const itemGame = item.item_game || item.game;
                const quantity = item.quantity;
                return `
                                <div class="admin-order-item-detail" style="font-size:0.97em; color:#fff;">
                                    ${itemName} (${itemGame ? itemGame.toUpperCase() : ''}) x${quantity}
                                </div>
                            `;
            }).join('')}
                    </div>
                    <div class="admin-order-actions" style="margin-top:8px;">
                        <button onclick="updateOrderStatus('${orderId}', 'processing')" class="admin-btn processing-btn">Mark Processing</button>
                        <button onclick="updateOrderStatus('${orderId}', 'completed')" class="admin-btn completed-btn">Mark Completed</button>
                        <button onclick="updateOrderStatus('${orderId}', 'cancelled')" class="admin-btn cancel-btn">Cancel Order</button>
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
                <div class="rarity-badge rarity-${item.rarity}">${item.rarity || ''}</div>
            </div>
            <div class="item-image ${item.game}-bg">
                ${item.image_url ? `<img src="${item.image_url}" alt="${item.name}" class="item-img" />` : ''}
            </div>
            <div class="item-name">${item.name}</div>
            <div class="item-description">${item.description || ''}</div>
            <div class="item-stock">Stock: ${item.stock ?? 0}</div>
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
    const userDropdown = document.getElementById('userDropdown');
    const userBtn = document.querySelector('.user-info-btn');

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
    if (userDropdown && userBtn) {
        if (userDropdown.style.display === 'block') {
            if (!userBtn.contains(event.target) && !userDropdown.contains(event.target)) {
                window.closeUserDropdown();
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
    const cartTotalElem = document.getElementById('cartTotal');
    if (!cartList) return;
    if (!cart || cart.length === 0) {
        cartList.innerHTML = '<div class="empty-cart">Your cart is empty.</div>';
        if (cartTotalElem) cartTotalElem.textContent = formatPrice(0); // <-- Fix: set total to zero
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
async function loadOrderHistory(user) {
    const historyContent = document.getElementById('orderHistoryContent');
    if (!historyContent || !user) return;
    historyContent.innerHTML = '<div class="loading">Loading your orders...</div>';

    try {
        const response = await fetch(`/.netlify/functions/get-orders?email=${encodeURIComponent(user.email)}`);
        const result = await response.json();
        const orders = (result.success && Array.isArray(result.data)) ? result.data : [];

        if (!orders.length) {
            historyContent.innerHTML = '<div class="no-user-orders">No orders found.</div>';
            return;
        }

        historyContent.innerHTML = `
            <div class="user-orders-list">
                ${orders.map(order => `
                    <div class="user-order-card">
                        <div class="user-order-header">
                            <div class="user-order-id-row">
                                <span class="user-order-id">${order.order_id}</span>
                            </div>
                            <div class="user-order-header-flex">
                                <div class="user-order-header-left">
                                    <div class="user-order-username"><strong>Game Username:</strong> ${order.customer_game_username}</div>
                                    <div class="user-order-payment"><strong>Payment:</strong> ${order.payment_method}</div>
                                    <div class="user-order-total"><strong>Total:</strong> ${formatPrice(order.total_amount)}</div>
                                    <span class="user-order-notes"><strong>Notes:</strong> ${order.customer_notes || ''}</span>
                                </div>
                                <div class="user-order-header-right">
                                    <div class="user-order-status status-${order.status || 'pending'}">${(order.status || 'pending').toUpperCase()}</div>
                                    <div class="user-order-date">${new Date(order.created_at).toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                        <div class="user-order-items">
                            <strong>Items:</strong>
                            ${order.items && order.items.length ? order.items.map(item => `
                                <div class="user-order-item-detail">
                                    ${item.item_name} (${item.item_game}) x${item.quantity} - ${formatPrice(item.subtotal)} subtotal
                                </div>
                            `).join('') : '<div class="user-order-item-detail">No items found.</div>'}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (err) {
        historyContent.innerHTML = '<div class="no-user-orders">Failed to load orders.</div>';
    }
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
        modal.style.zIndex = '10001';
        modal.innerHTML = `
            <div class="modal-content" style="
                background: linear-gradient(135deg, #23272f 0%, #2c313c 100%);
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.35);
                padding: 2.5rem 2rem;
                max-width: 420px;
                width: 98vw;
                color: #fff;
                position: relative;
                animation: adminFadeIn 0.3s;
            ">
                <span class="close" style="
                    position: absolute;
                    top: 18px;
                    right: 22px;
                    font-size: 1.5rem;
                    color: #f1c40f;
                    cursor: pointer;
                    background: none;
                    border: none;
                " onclick="document.getElementById('addItemModal').style.display='none'">&times;</span>
                <h2 style="color:#f1c40f; margin-bottom:1.2rem; text-align:center;">
                    <span style="vertical-align:middle;">&#128722;</span> Add New Item
                </h2>
                <form id="addItemForm" style="display:flex; flex-direction:column; gap:1rem;">
                    <div class="form-group">
                        <label style="color:#e67e22;">Item Name</label>
                        <input type="text" id="newItemName" placeholder="Item Name" required style="width:100%;padding:0.5rem;border-radius:6px;border:1px solid #e67e22;background:#23272f;color:#fff;">
                    </div>
                    <div class="form-group">
                        <label style="color:#e67e22;">Description</label>
                        <textarea id="newItemDescription" placeholder="Description" style="width:100%;padding:0.5rem;border-radius:6px;border:1px solid #e67e22;background:#23272f;color:#fff;"></textarea>
                    </div>
                    <div class="form-group" style="display:flex;gap:1rem;">
                        <div style="flex:1;">
                            <label style="color:#e67e22;">Price</label>
                            <input type="number" id="newItemPrice" placeholder="Price" required style="width:100%;padding:0.5rem;border-radius:6px;border:1px solid #e67e22;background:#23272f;color:#fff;">
                        </div>
                        <div style="flex:1;">
                            <label style="color:#e67e22;">Stock</label>
                            <input type="number" id="newItemStock" placeholder="Stock" value="0" min="0" style="width:100%;padding:0.5rem;border-radius:6px;border:1px solid #e67e22;background:#23272f;color:#fff;">
                        </div>
                    </div>
                    <div class="form-group">
                        <label style="color:#e67e22;">Image URL</label>
                        <input type="text" id="newItemImageUrl" placeholder="Image URL" style="width:100%;padding:0.5rem;border-radius:6px;border:1px solid #e67e22;background:#23272f;color:#fff;">
                    </div>
                    <div class="form-group" style="display:flex;gap:1rem;">
                        <div style="flex:1;">
                            <label style="color:#e67e22;">Game</label>
                            <select id="newItemGame" style="width:100%;padding:0.5rem;border-radius:6px;border:1px solid #e67e22;background:#23272f;color:#fff;">
                                <option value="ml">Mobile Legends</option>
                                <option value="roblox">Roblox</option>
                            </select>
                        </div>
                        <div style="flex:1;">
                            <label style="color:#e67e22;">Rarity</label>
                            <input type="text" id="newItemRarity" placeholder="Rarity" style="width:100%;padding:0.5rem;border-radius:6px;border:1px solid #e67e22;background:#23272f;color:#fff;">
                        </div>
                    </div>
                    <button type="submit" style="
                        background:#27ae60;
                        color:#fff;
                        border:none;
                        border-radius:6px;
                        padding:0.7rem 1.2rem;
                        font-size:1.1rem;
                        font-weight:600;
                        cursor:pointer;
                        transition:background 0.2s,color 0.2s;
                    ">+ Add Item</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        // Clear fields when modal is closed
        modal.querySelector('.close').onclick = function () {
            modal.style.display = 'none';
            document.getElementById('newItemName').value = '';
            document.getElementById('newItemDescription').value = '';
            document.getElementById('newItemPrice').value = '';
            document.getElementById('newItemStock').value = '0';
            document.getElementById('newItemImageUrl').value = '';
            document.getElementById('newItemGame').selectedIndex = 0;
            document.getElementById('newItemRarity').value = '';
        };

        document.getElementById('addItemForm').onsubmit = async function (e) {
            e.preventDefault();
            const submitBtn = document.querySelector('#addItemForm button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Adding...`;
            }
            const itemData = {
                name: document.getElementById('newItemName').value,
                description: document.getElementById('newItemDescription').value,
                price: parseFloat(document.getElementById('newItemPrice').value),
                image_url: document.getElementById('newItemImageUrl').value,
                game: document.getElementById('newItemGame').value,
                rarity: document.getElementById('newItemRarity').value,
                stock: parseInt(document.getElementById('newItemStock').value, 10),
                active: true
            };
            try {
                const response = await fetch('/.netlify/functions/admin-api', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'add_item',
                        adminEmail: window.TriogelAuth?.getCurrentUser()?.email,
                        itemData
                    })
                });
                const result = await response.json();
                if (result.success) {
                    showNotification('Item added successfully!', 'success');
                    modal.style.display = 'none';
                    await fetchItems();
                    loadAdminItems();
                    displayItems(); // Refresh customer grid
                } else {
                    showNotification(result.message || 'Failed to add item', 'error');
                }
            } catch (err) {
                showNotification('Error adding item', 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '+ Add Item';
                }
            }
        };
    }
    modal.style.display = 'block';
    modal.style.zIndex = '10001';
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
            <span>Stock: ${item.stock ?? 0}</span>
            <div class="item-footer">
                <button onclick="openModifyStockModal(${item.id}, ${item.stock ?? 0})" class="admin-btn">Modify Quantity</button>
            </div>
        </div>
    `).join('');
}

window.openModifyStockModal = function (itemId, currentStock) {
    let modal = document.getElementById('modifyStockModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modifyStockModal';
        modal.className = 'modal';
        modal.style.zIndex = '10001';
        modal.innerHTML = `
            <div class="modal-content" style="
                background: linear-gradient(135deg, #23272f 0%, #2c313c 100%);
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.35);
                padding: 2.5rem 2rem;
                max-width: 350px;
                width: 98vw;
                color: #fff;
                position: relative;
                animation: adminFadeIn 0.3s;
            ">
                <span class="close" style="
                    position: absolute;
                    top: 18px;
                    right: 22px;
                    font-size: 1.5rem;
                    color: #f1c40f;
                    cursor: pointer;
                    background: none;
                    border: none;
                " onclick="document.getElementById('modifyStockModal').style.display='none'">&times;</span>
                <h2 style="color:#f1c40f; margin-bottom:1.2rem; text-align:center;">
                    <span style="vertical-align:middle;">&#128202;</span> Modify Item Quantity
                </h2>
                <form id="modifyStockForm" style="display:flex; flex-direction:column; gap:1.2rem;">
                    <div class="form-group">
                        <label style="color:#e67e22;">New Stock Quantity</label>
                        <input type="number" id="modifyItemStock" placeholder="New Stock" min="0" required
                            style="width:100%;padding:0.5rem;border-radius:6px;border:1px solid #e67e22;background:#23272f;color:#fff;">
                    </div>
                    <button type="submit" style="
                        background:#3498db;
                        color:#fff;
                        border:none;
                        border-radius:6px;
                        padding:0.7rem 1.2rem;
                        font-size:1.1rem;
                        font-weight:600;
                        cursor:pointer;
                        transition:background 0.2s,color 0.2s;
                    ">Update Quantity</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('modifyStockForm').onsubmit = async function (e) {
            e.preventDefault();
            const newStock = parseInt(document.getElementById('modifyItemStock').value, 10);
            if (isNaN(newStock) || newStock < 0) {
                showNotification('Please enter a valid stock quantity.', 'error');
                return;
            }
            // Show loading state
            const submitBtn = document.querySelector('#modifyStockForm button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Updating...`;
            }
            try {
                // Send update request to Netlify function
                const response = await fetch('/.netlify/functions/admin-api', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'update_item',
                        adminEmail: window.TriogelAuth?.getCurrentUser()?.email,
                        itemId: itemId,
                        itemData: { stock: newStock }
                    })
                });
                const result = await response.json();
                if (result.success) {
                    showNotification('Item quantity updated!', 'success');
                    modal.style.display = 'none';
                    await fetchItems();
                    loadAdminItems();
                    displayItems();
                } else {
                    showNotification(result.message || 'Failed to update quantity', 'error');
                }
            } catch (err) {
                showNotification('Error updating item quantity', 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Update Quantity';
                }
            }
        };
    }
    document.getElementById('modifyItemStock').value = currentStock;
    modal.style.display = 'block';
    modal.style.zIndex = '10001';
}
async function loadAdminAnalytics() {
    const currentUser = window.TriogelAuth?.getCurrentUser();
    const response = await fetch('/.netlify/functions/admin-api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'get_analytics',
            adminEmail: currentUser.email
        })
    });
    const result = await response.json();
    if (result.success && result.analytics) {
        const a = result.analytics;
        document.getElementById('analytics-total-orders').textContent = a.totalOrders;
        document.getElementById('analytics-total-sales').textContent = '₱' + a.totalSales.toFixed(2);
        document.getElementById('analytics-average-order').textContent = '₱' + a.averageOrderValue.toFixed(2);
        document.getElementById('analytics-status-pending').textContent = a.statusCounts.pending;
        document.getElementById('analytics-status-processing').textContent = a.statusCounts.processing;
        document.getElementById('analytics-status-completed').textContent = a.statusCounts.completed;
        document.getElementById('analytics-status-cancelled').textContent = a.statusCounts.cancelled;
        document.getElementById('analytics-recent-orders').textContent = a.recentOrders;
        document.getElementById('analytics-conversion-rate').textContent = a.conversionRate + '%';

        // Payment methods
        const pmList = document.getElementById('analytics-payment-methods');
        pmList.innerHTML = '';
        Object.entries(a.paymentMethods).forEach(([method, count]) => {
            const li = document.createElement('li');
            li.textContent = `${method}: ${count}`;
            pmList.appendChild(li);
        });

        // Top items
        const tiList = document.getElementById('analytics-top-items');
        tiList.innerHTML = '';
        a.topItems.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name}: ${item.qty}`;
            tiList.appendChild(li);
        });

        // Top games
        const tgList = document.getElementById('analytics-top-games');
        tgList.innerHTML = '';
        a.topGames.forEach(game => {
            const li = document.createElement('li');
            li.textContent = `${game.game}: ${game.qty}`;
            tgList.appendChild(li);
        });
    }
}
async function loadAdminUsers() {
    try {
        const usersList = document.getElementById('adminUsersList');
        if (!usersList) return;
        usersList.innerHTML = '<div class="loading">Loading users...</div>';

        const response = await fetch('/.netlify/functions/admin-api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'get_users',
                adminEmail: window.TriogelAuth?.getCurrentUser()?.email
            })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success && Array.isArray(data.users)) {
                usersList.innerHTML = data.users.map(user => `
                    <div class="admin-user-item">
                        <strong>${user.email}</strong>
                        <span>Username: ${user.username}</span>
                        <span>Favorite Game: ${user.favorite_game}</span>
                        <span>Created: ${new Date(user.created_at).toLocaleString()}</span>
                    </div>
                `).join('');
            } else {
                usersList.innerHTML = '<div class="admin-empty">No users found</div>';
            }
        } else {
            usersList.innerHTML = '<div class="admin-error">Failed to load users</div>';
        }
    } catch (error) {
        console.error('Error loading admin users:', error);
        const usersList = document.getElementById('adminUsersList');
        if (usersList) {
            usersList.innerHTML = '<div class="admin-error">Error loading users</div>';
        }
    }
}
function clearLoginForm() {
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    if (emailInput) emailInput.value = '';
    if (passwordInput) passwordInput.value = '';
}

function clearRegisterForm() {
    const usernameInput = document.getElementById('registerUsername');
    const emailInput = document.getElementById('registerEmail');
    const passwordInput = document.getElementById('registerPassword');
    const confirmPasswordInput = document.getElementById('registerConfirmPassword');
    const favoriteGameInput = document.getElementById('registerFavoriteGame');
    if (usernameInput) usernameInput.value = '';
    if (emailInput) emailInput.value = '';
    if (passwordInput) passwordInput.value = '';
    if (confirmPasswordInput) confirmPasswordInput.value = '';
    if (favoriteGameInput) favoriteGameInput.value = 'ml'; // or your default value
}
function generateOrderId() {
    // Generates a random 16-character hex string prefixed with TRIO-
    const arr = new Uint8Array(8);
    window.crypto.getRandomValues(arr);
    return 'TRIO-' + Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}
function showOtpModal(email, initialSecondsLeft) {
    // Remove any existing modal
    const existing = document.getElementById('otpModal');
    if (existing) existing.remove();

    // Create modal
    const modal = document.createElement('div');
    modal.id = 'otpModal';
    modal.className = 'modal otp-modal';
    modal.innerHTML = `
        <div class="modal-content otp-content">
            <span class="close" onclick="document.getElementById('otpModal').remove()">&times;</span>
            <div class="otp-header">
                <div class="otp-icon">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <circle cx="24" cy="24" r="22" stroke="#e67e22" stroke-width="4" fill="url(#otpGrad)" />
                        <path d="M24 14v10l7 7" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        <defs>
                            <linearGradient id="otpGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#e67e22"/>
                                <stop offset="1" stop-color="#f1c40f"/>
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <h2>Email Verification</h2>
            </div>
            <p class="otp-desc">Enter the <b>6-digit code</b> sent to <span class="otp-email">${email}</span></p>
            <div class="otp-input-group">
                <input id="otpInput" type="text" maxlength="6" autocomplete="one-time-code" class="otp-input" placeholder="------" />
            </div>
            <div class="otp-timer-group">
                <div id="otpTimerRing" class="otp-timer-ring"></div>
                <div id="otpTimerDisplay" class="otp-timer-text"></div>
            </div>
            <div class="otp-actions">
                <button id="otpSubmitBtn" class="otp-btn primary">Verify</button>
                <button id="otpResendBtn" class="otp-btn secondary" disabled>Resend OTP</button>
            </div>
            <div id="otpError" class="otp-error"></div>
        </div>
    `;
    document.body.appendChild(modal);

    // Add styles (only once)
    if (!document.getElementById('otpModalStyles')) {
        const style = document.createElement('style');
        style.id = 'otpModalStyles';
        style.textContent = `
        .otp-modal {
            position: fixed; top:0; left:0; width:100vw; height:100vh;
            background: rgba(20,24,32,0.85); z-index:9999;
            display: flex; align-items: center; justify-content: center;
        }
        .otp-content {
            background: linear-gradient(135deg, #23272f 0%, #2c313c 100%);
            border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.35);
            padding: 2.5rem 2rem; max-width: 350px; width: 100%;
            text-align: center; position: relative;
            animation: otpFadeIn 0.3s;
        }
        @keyframes otpFadeIn { from { opacity:0; transform:scale(0.95);} to { opacity:1; transform:scale(1);} }
        .otp-header { margin-bottom: 1rem; }
        .otp-icon { margin-bottom: 0.5rem; }
        .otp-desc { color: #f1c40f; font-size: 1.05rem; margin-bottom: 1.2rem; }
        .otp-email { color: #fff; background: #e67e22; border-radius: 4px; padding: 2px 6px; font-weight: 500; }
        .otp-input-group { margin-bottom: 1.2rem; }
        .otp-input {
            font-size: 1.6rem; text-align: center; letter-spacing: 0.35em;
            width: 220px; max-width: 100%; min-width: 180px;
            padding: 0.5rem 0.7rem; border-radius: 8px;
            border: 2px solid #e67e22; background: #23272f; color: #fff;
            outline: none; transition: border 0.2s;
            box-sizing: border-box;
        }
        .otp-input:focus { border-color: #f1c40f; }
        .otp-timer-group { display: flex; flex-direction: column; align-items: center; margin-bottom: 1.2rem; }
        .otp-timer-ring {
            width: 48px; height: 48px; margin-bottom: 0.2rem;
            background: none; position: relative;
        }
        .otp-timer-text {
            color: #e67e22; font-weight: bold; font-size: 1.05rem;
        }
        .otp-actions { display: flex; gap: 0.7rem; justify-content: center; margin-bottom: 0.8rem; }
        .otp-btn {
            padding: 0.5rem 1.2rem; border-radius: 6px; border: none;
            font-size: 1rem; font-weight: 500; cursor: pointer;
            transition: background 0.2s, color 0.2s;
        }
        .otp-btn.primary { background: #e67e22; color: #fff; }
        .otp-btn.primary:hover { background: #f1c40f; color: #23272f; }
        .otp-btn.secondary { background: #23272f; color: #e67e22; border: 1px solid #e67e22; }
        .otp-btn.secondary:disabled { opacity: 0.5; cursor: not-allowed; }
        .otp-error { color: #e74c3c; min-height: 1.2em; font-size: 0.98em; }
        .otp-content .close {
            position: absolute; top: 16px; right: 18px; font-size: 1.5rem;
            color: #f1c40f; cursor: pointer; background: none; border: none;
        }
        @media (max-width: 500px) {
            .otp-content { padding: 1.2rem 0.5rem; max-width: 98vw; }
            .otp-input { width: 140px; min-width: 120px; font-size: 1.2rem; letter-spacing: 0.25em; }
        }
        `;
        document.head.appendChild(style);
    }

    // Timer logic with progress ring
    let secondsLeft = initialSecondsLeft;
    let timerInterval;
    const resendBtn = document.getElementById('otpResendBtn');
    const timerDisplay = document.getElementById('otpTimerDisplay');
    const timerRing = document.getElementById('otpTimerRing');
    const errorDisplay = document.getElementById('otpError');
    const maxSeconds = initialSecondsLeft || 60;

    function updateTimerDisplay() {
        if (timerDisplay) {
            timerDisplay.textContent = secondsLeft > 0
                ? `Resend available in ${secondsLeft}s`
                : 'You can now resend OTP.';
        }
        if (resendBtn) {
            resendBtn.disabled = secondsLeft > 0;
        }
        // Progress ring SVG
        if (timerRing) {
            const percent = Math.max(0, Math.min(1, secondsLeft / maxSeconds));
            const radius = 22, stroke = 4, circ = 2 * Math.PI * radius;
            timerRing.innerHTML = `
                <svg width="48" height="48">
                    <circle cx="24" cy="24" r="${radius}" stroke="#444" stroke-width="${stroke}" fill="none"/>
                    <circle cx="24" cy="24" r="${radius}" stroke="#e67e22" stroke-width="${stroke}" fill="none"
                        stroke-dasharray="${circ}" stroke-dashoffset="${circ * (1 - percent)}"
                        style="transition: stroke-dashoffset 0.5s;" />
                </svg>
            `;
        }
    }

    updateTimerDisplay();
    timerInterval = setInterval(() => {
        secondsLeft--;
        updateTimerDisplay();
        if (secondsLeft <= 0) {
            clearInterval(timerInterval);
        }
    }, 1000);

    // --- UPDATED: Add loading indicator to Verify button ---
    const otpSubmitBtn = document.getElementById('otpSubmitBtn');
    otpSubmitBtn.onclick = async function () {
        const otp = document.getElementById('otpInput').value.trim();
        if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
            errorDisplay.textContent = 'Please enter a valid 6-digit code.';
            return;
        }
        errorDisplay.textContent = '';
        otpSubmitBtn.disabled = true;
        otpSubmitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Verifying...`;
        try {
            const result = await window.TriogelAuth.makeAuthRequest('verify_otp', { email, otp });
            if (result.success && result.user) {
                showNotification('Email verified!', 'success');
                modal.remove();
                window.TriogelAuth.currentUser = result.user;
                window.TriogelAuth.saveUserSession(result.user);
                window.TriogelAuth.showUserSection();
                if (typeof closeLoginModal === 'function') closeLoginModal();
            } else {
                errorDisplay.textContent = result.message || 'Invalid code. Please try again.';
            }
        } catch (err) {
            errorDisplay.textContent = err.message || 'Verification failed.';
        } finally {
            otpSubmitBtn.disabled = false;
            otpSubmitBtn.innerHTML = 'Verify';
        }
    };

    resendBtn.onclick = async function () {
        resendBtn.disabled = true;
        resendBtn.textContent = 'Resending...';
        errorDisplay.textContent = '';
        try {
            const result = await window.TriogelAuth.makeAuthRequest('resend_otp', { email });
            if (result.success) {
                showNotification('OTP resent!', 'success');
                secondsLeft = result.timeRemaining || maxSeconds;
                updateTimerDisplay();
                timerInterval = setInterval(() => {
                    secondsLeft--;
                    updateTimerDisplay();
                    if (secondsLeft <= 0) {
                        clearInterval(timerInterval);
                    }
                }, 1000);
            } else {
                errorDisplay.textContent = result.message || 'Failed to resend OTP.';
            }
        } catch (err) {
            errorDisplay.textContent = err.message || 'Failed to resend OTP.';
        }
        resendBtn.textContent = 'Resend OTP';
    };

    // Focus input on open
    setTimeout(() => {
        document.getElementById('otpInput').focus();
    }, 200);
}