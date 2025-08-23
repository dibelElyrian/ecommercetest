// IMMEDIATE DEBUG - Add at very start of file
console.log('TRIOGEL DEBUG: Script file starting to load...');


// Test basic functionality immediately
window.addEventListener('load', function() {
    console.log('TRIOGEL DEBUG: Window loaded event fired');
});

// TRIOGEL JavaScript - Clean Version
console.log('Loading TRIOGEL JavaScript...');

// ========================================
// CRITICAL: Define items array and other data IMMEDIATELY
// ========================================

// TRIOGEL Items Database - MUST BE DEFINED EARLY
const items = [
    {
        id: 1,
        name: "Legendary Skin Bundle",
        game: "ml",
        description: "Premium legendary skin collection with special effects and voice lines. Includes 5 top-tier skins.",
        price: 4949.45,
        icon: "SKIN",
        rarity: "legendary",
        stats: { skins: "5", effects: "Special", voice: "Yes" }
    },
    {
        id: 2,
        name: "Epic Skin - Fanny",
        game: "ml",
        description: "Fanny's epic skin with enhanced animations and unique recall effects.",
        price: 1924.45,
        icon: "HERO",
        rarity: "epic",
        stats: { hero: "Fanny", type: "Epic", recall: "Custom" }
    },
    {
        id: 3,
        name: "Starlight Pass (Season)",
        game: "ml",
        description: "Full season Starlight Pass with exclusive rewards and premium benefits.",
        price: 714.45,
        icon: "STAR",
        rarity: "rare",
        stats: { duration: "1 Month", rewards: "Premium", exp: "+50%" }
    },
    {
        id: 4,
        name: "Diamonds - 2000 Pack",
        game: "ml",
        description: "2000 Mobile Legends diamonds for skins, heroes, and premium items.",
        price: 2749.45,
        icon: "GEMS",
        rarity: "common",
        stats: { amount: "2000", bonus: "+200", instant: "Yes" }
    },
    {
        id: 5,
        name: "MLBB Account (Mythic)",
        game: "ml",
        description: "High-rank Mythic account with 50+ heroes and 20+ skins. Hand-leveled.",
        price: 10999.45,
        icon: "RANK",
        rarity: "legendary",
        stats: { rank: "Mythic", heroes: "50+", skins: "20+" }
    },
    {
        id: 6,
        name: "Dominus Crown",
        game: "roblox",
        description: "Legendary Dominus hat showing ultimate status. Rare and prestigious item.",
        price: 16499.45,
        icon: "CROWN",
        rarity: "legendary",
        stats: { type: "Hat", rarity: "Ultra Rare", status: "VIP" }
    },
    {
        id: 7,
        name: "Robux - 10,000 Pack",
        game: "roblox",
        description: "10,000 Robux currency for purchasing items, game passes, and premium content.",
        price: 5499.45,
        icon: "ROBUX",
        rarity: "common",
        stats: { amount: "10,000", bonus: "+1000", delivery: "Instant" }
    },
    {
        id: 8,
        name: "Roblox Premium Account",
        game: "roblox",
        description: "High-level Roblox account with rare items, limiteds, and premium accessories.",
        price: 8249.45,
        icon: "GAME",
        rarity: "epic",
        stats: { level: "High", limiteds: "Yes", premium: "Active" }
    },
    {
        id: 9,
        name: "Golden Wings Package",
        game: "roblox",
        description: "Exclusive golden wings accessory with sparkling effects. Limited edition item.",
        price: 4399.45,
        icon: "WINGS",
        rarity: "rare",
        stats: { color: "Golden", effects: "Sparkle", edition: "Limited" }
    },
    {
        id: 10,
        name: "Pet Collection Bundle",
        game: "roblox",
        description: "Collection of 10 rare pets including legendary and mythical variants.",
        price: 3299.45,
        icon: "PETS",
        rarity: "epic",
        stats: { pets: "10", legendary: "3", mythical: "2" }
    },
    {
        id: 11,
        name: "Test GCash Payment",
        game: "ml",
        description: "Test item to verify GCash payment integration is working correctly.",
        price: 1,
        icon: "TEST",
        rarity: "common",
        stats: { purpose: "Testing", amount: "PHP 1", payment: "GCash" }
    }
];

const gameNames = {
    'ml': 'Mobile Legends: Bang Bang',
    'roblox': 'Roblox'
};

let cart = [];
let currentFilter = 'all';

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

let lastCurrencyUpdate = null;
let currencyUpdateInterval = null;
let selectedCurrency = 'PHP';

console.log('Items array defined with', items.length, 'items');

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
            console.log(`${funcName} called (placeholder)`, args);
        };
    }
});

// Define modal functions immediately
window.openCart = function() {
    try {
        console.log('Opening cart...');
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
        console.log('Opening admin panel...');
        
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
        console.log('Refreshing admin data...');
        loadAdminData();
        showNotification('Admin data refreshed');
    } catch (e) { console.error('refreshAdminData error:', e); }
};

// NEW: User Profile Modal Functions
window.openProfileModal = function() {
    try {
        console.log('Opening profile modal...');
        
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
        console.log('Opening order history modal...');
        
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
        console.log('Opening forgot password modal...');
        
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
            window.cart = cart.filter(item => item.id !== itemId);
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
    //initializeLiveCurrencySystem();
    
    // Display items - this is the key function
    displayItems();
    updateCartCount();
    setupFilters();
    setupEventHandlers();
    setupCurrencySelector();
    updateCurrencySelector();
    
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
    console.log('displayItems() called - Displaying items for filter:', currentFilter);
    const grid = document.getElementById('itemsGrid');
    if (!grid) {
        console.error('Items grid element not found!');
        return;
    }
    
    console.log('Items grid found:', grid);
    console.log('Available items:', items.length);
    
    const filteredItems = currentFilter === 'all' ? items : items.filter(item => item.game === currentFilter);
    console.log(`Items to display: ${filteredItems.length} (filter: ${currentFilter})`);

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
    
    console.log('Items displayed successfully, grid innerHTML length:', grid.innerHTML.length);
}