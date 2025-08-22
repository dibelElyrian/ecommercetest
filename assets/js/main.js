// IMMEDIATE DEBUG - Add at very start of file
console.log('TRIOGEL DEBUG: Script file starting to load...');

// Test basic functionality immediately
window.addEventListener('load', function() {
    console.log('TRIOGEL DEBUG: Window loaded event fired');
});

// TRIOGEL JavaScript - Clean Version
console.log('Loading TRIOGEL JavaScript...');

// ========================================
// CRITICAL: Define all onclick functions IMMEDIATELY to prevent ReferenceError
// ========================================

// Essential onclick functions that MUST be globally accessible
const essentialFunctions = [
    'openCart', 'closeCart', 'openOrderTracking', 'closeOrderTracking',
    'openLoginModal', 'closeLoginModal', 'openRegisterModal', 'closeRegisterModal',
    'proceedToCheckout', 'closeCheckout', 'addToCart', 'removeFromCart',
    'toggleCurrencySelector', 'toggleUserDropdown', 'closeUserDropdown',
    'switchToLogin', 'switchToRegister', 'logoutUser', 'initAuth', 'initializeCurrencySystem'
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
        if (typeof openLoginModal === 'function') openLoginModal();
    } catch (e) { console.error('switchToLogin error:', e); }
};

window.switchToRegister = function() {
    try {
        if (typeof closeLoginModal === 'function') closeLoginModal();
        if (typeof openRegisterModal === 'function') openRegisterModal();
    } catch (e) { console.error('switchToRegister error:', e); }
};

window.logoutUser = function() {
    try {
        console.log('Logging out user...');
        window.currentUser = null;
        localStorage.removeItem('triogel-user');
        if (typeof showLoginSection === 'function') showLoginSection();
        if (typeof showNotification === 'function') {
            showNotification('Logged out successfully!');
        }
    } catch (e) { console.error('logoutUser error:', e); }
};

// Validation function for onclick functions
function validateOnclickFunctions() {
    const requiredFunctions = [
        'openCart', 'closeCart', 'openOrderTracking', 'closeOrderTracking',
        'openLoginModal', 'closeLoginModal', 'openRegisterModal', 'closeRegisterModal',
        'proceedToCheckout', 'closeCheckout', 'toggleCurrencySelector',
        'toggleUserDropdown', 'closeUserDropdown', 'addToCart', 'removeFromCart'
    ];
    
    const missingFunctions = requiredFunctions.filter(name => typeof window[name] !== 'function');
    
    if (missingFunctions.length > 0) {
        console.error('MISSING ONCLICK FUNCTIONS:', missingFunctions);
        console.error('This will cause ReferenceError when buttons are clicked!');
        return false;
    }
    
    console.log('All onclick functions are properly defined');
    return true;
}

// Run validation immediately
setTimeout(() => validateOnclickFunctions(), 100);

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

// Real-time currency fetching system
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
            
            // PHP rate is always 1.0 (base currency)
            currencies['PHP'].rate = 1.0;
            currencies['PHP'].lastUpdate = new Date().toISOString();
            currencies['PHP'].source = 'base';
            
            lastCurrencyUpdate = new Date();
            
            // Save to localStorage as cache
            localStorage.setItem('triogel-currency-cache', JSON.stringify({
                rates: currencies,
                lastUpdate: lastCurrencyUpdate.toISOString()
            }));
            
            console.log('Live exchange rates updated successfully');
            
            // Update UI if currency selector is visible
            if (typeof setupCurrencySelector === 'function') {
                setupCurrencySelector();
            }
            
            // Refresh item prices if items are displayed
            if (typeof displayItems === 'function') {
                displayItems();
            }
            
            // Show success notification
            if (typeof showNotification === 'function') {
                showNotification('Exchange rates updated with live data');
            }
            
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

// Load cached exchange rates from localStorage
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

// Initialize real-time currency system
function initializeLiveCurrencySystem() {
    console.log('Initializing live currency system...');
    
    // Load cached rates first for immediate display
    loadCachedExchangeRates();
    
    // Fetch live rates immediately
    fetchLiveExchangeRates();
    
    // Set up automatic updates every 30 minutes
    if (currencyUpdateInterval) {
        clearInterval(currencyUpdateInterval);
    }
    
    currencyUpdateInterval = setInterval(() => {
        console.log('Automatic currency rate update...');
        fetchLiveExchangeRates();
    }, 30 * 60 * 1000); // 30 minutes
    
    console.log('Live currency system initialized - updates every 30 minutes');
}

// Manual refresh function for currency rates
window.refreshExchangeRates = function() {
    console.log('Manual currency rate refresh requested...');
    
    if (typeof showNotification === 'function') {
        showNotification('Updating exchange rates...');
    }
    
    fetchLiveExchangeRates();
};

let selectedCurrency = 'PHP';

// TRIOGEL Items Database
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

// Core Functions
// Enhanced price formatting with real-time rates and compliance checking
function formatPrice(priceInPHP, targetCurrency = selectedCurrency) {
    if (targetCurrency === 'PHP') {
        return `PHP ${priceInPHP.toLocaleString('en-PH', {minimumFractionDigits: 2})}`;
    }
    
    const rate = currencies[targetCurrency]?.rate || 1;
    const convertedPrice = priceInPHP * rate;
    const currencyConfig = currencies[targetCurrency];
    
    if (!currencyConfig) {
        return `PHP ${priceInPHP.toLocaleString('en-PH', {minimumFractionDigits: 2})}`;
    }
    
    let formattedAmount;
    if (targetCurrency === 'JPY' || targetCurrency === 'KRW' || targetCurrency === 'VND') {
        formattedAmount = Math.round(convertedPrice).toLocaleString();
    } else {
        formattedAmount = convertedPrice.toLocaleString('en-US', {minimumFractionDigits: 2});
    }
    
    let priceDisplay = `${currencyConfig.code} ${formattedAmount}`;
    
    return priceDisplay;
}

function displayItems() {
    console.log('Displaying items for filter:', currentFilter);
    const grid = document.getElementById('itemsGrid');
    if (!grid) {
        console.error('Items grid element not found!');
        return;
    }
    
    const filteredItems = currentFilter === 'all' ? items : items.filter(item => item.game === currentFilter);
    console.log(`Items to display: ${filteredItems.length}`);

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

function addToCart(itemId) {
    const item = items.find(i => i.id === itemId);
    if (!item) {
        console.error('Item not found:', itemId);
        return;
    }
    
    const existingItem = cart.find(i => i.id === itemId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    updateCartCount();
    showNotification(`${item.name} added to cart!`);
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = count;
    }
}

// Enhanced currency selection with real-time rate updates
function setCurrency(currencyCode) {
    console.log('Changing currency to:', currencyCode);
    selectedCurrency = currencyCode;
    updateCurrencySelector();
    displayItems();
    
    const currencyName = currencies[currencyCode]?.name || currencyCode;
    showNotification(`Currency changed to ${currencyName}`);
    localStorage.setItem('triogel-currency', currencyCode);
}

function updateCurrencySelector() {
    const selectedOption = document.getElementById('selectedCurrency');
    if (selectedOption && currencies[selectedCurrency]) {
        selectedOption.textContent = currencies[selectedCurrency].code;
    }
}

function setupCurrencySelector() {
    console.log('Setting up currency selector...');
    
    const currencyDropdown = document.getElementById('currencyDropdown');
    if (!currencyDropdown) {
        console.error('currencyDropdown element not found');
        return;
    }
    
    // Add header with refresh button
    const currentTime = new Date();
    const updateAge = lastCurrencyUpdate ? 
        Math.round((currentTime - lastCurrencyUpdate) / 1000 / 60) : 'Never';
    
    currencyDropdown.innerHTML = `
        <div class="currency-dropdown-header">
            <div class="currency-dropdown-title">Select Currency</div>
            <button class="currency-refresh-btn" onclick="refreshExchangeRates()">
                Refresh
            </button>
        </div>
        ${Object.entries(currencies).map(([code, config]) => {
            const isLive = config.source === 'live';
            const isFallback = config.source === 'fallback';
            const isBase = config.source === 'base';
            const isStatic = !config.source;
            
            let statusBadge = '';
            if (isLive) {
                statusBadge = '<span class="rate-badge live">LIVE</span>';
            } else if (isFallback) {
                statusBadge = '<span class="rate-badge fallback">BACKUP</span>';
            } else if (isBase) {
                statusBadge = '<span class="rate-badge base">BASE</span>';
            } else {
                statusBadge = '<span class="rate-badge static">STATIC</span>';
            }
            
            return `
                <div class="currency-option" data-currency="${code}">
                    <div class="currency-main">
                        <span class="currency-code">${code}</span>
                        <span class="currency-name">${config.name}</span>
                    </div>
                    <div class="currency-meta">
                        <span class="currency-rate">1 PHP = ${config.rate.toFixed(code === 'JPY' || code === 'KRW' || code === 'VND' ? 0 : 4)} ${code}</span>
                        ${statusBadge}
                    </div>
                </div>
            `;
        }).join('')}
        <div class="rate-timestamp">
            Last updated: ${updateAge === 'Never' ? 'Never' : updateAge + ' minutes ago'}
        </div>
    `;
    
    currencyDropdown.addEventListener('click', (e) => {
        const option = e.target.closest('.currency-option');
        if (option) {
            const currency = option.dataset.currency;
            setCurrency(currency);
            toggleCurrencySelector();
        }
    });
    
    console.log('Currency selector setup complete');
}

// Initialize everything
function init() {
    console.log('TRIOGEL Initializing...');
    
    // Initialize live currency system first
    initializeLiveCurrencySystem();
    
    displayItems();
    updateCartCount();
    setupFilters();
    setupEventHandlers();
    setupCurrencySelector();
    updateCurrencySelector();
    
    console.log('TRIOGEL Initialized successfully!');
}

// Event Handlers Setup
function setupEventHandlers() {
    console.log('Setting up event handlers...');
    
    // Authentication form handlers
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            console.log('Login form submitted');

            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Logging in...';
            submitBtn.disabled = true;

            try {
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                await loginUser(email, password);
            } catch (error) {
                showNotification(`Login failed: ${error.message}`);
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            console.log('Register form submitted');

            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Creating Account...';
            submitBtn.disabled = true;

            try {
                const userData = {
                    username: document.getElementById('registerUsername').value,
                    email: document.getElementById('registerEmail').value,
                    password: document.getElementById('registerPassword').value,
                    confirmPassword: document.getElementById('confirmPassword').value,
                    favoriteGame: document.getElementById('favoriteGame').value
                };
                await registerUser(userData);
            } catch (error) {
                showNotification(`Registration failed: ${error.message}`);
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Order tracking form handler
    const trackingForm = document.getElementById('trackingForm');
    if (trackingForm) {
        trackingForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            console.log('Order tracking form submitted');

            const orderId = document.getElementById('orderId').value.trim();
            if (!orderId) {
                showNotification('Please enter an Order ID');
                return;
            }
            await trackOrderById(orderId);
        });
    }

    // Checkout form handler
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            console.log('Checkout form submitted');

            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Processing Order...';
            submitBtn.disabled = true;

            try {
                // Collect form data
                const orderData = {
                    orderId: 'TRIO-' + Date.now(),
                    gameUsername: document.getElementById('gameUsername').value,
                    email: document.getElementById('email').value,
                    whatsappNumber: document.getElementById('whatsappNumber').value || '',
                    paymentMethod: document.getElementById('paymentMethod').value,
                    currency: selectedCurrency,
                    serverRegion: document.getElementById('serverRegion').value || '',
                    customerNotes: document.getElementById('customerNotes').value || '',
                    customer: {
                        email: document.getElementById('email').value,
                        gameUsername: document.getElementById('gameUsername').value,
                        whatsappNumber: document.getElementById('whatsappNumber').value || '',
                        serverRegion: document.getElementById('serverRegion').value || ''
                    },
                    items: cart.map(item => ({
                        id: item.id,
                        name: item.name,
                        game: item.game,
                        price: item.price,
                        quantity: item.quantity
                    })),
                    total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                    timestamp: new Date().toISOString()
                };

                console.log('Processing order:', orderData);

                try {
                    const response = await fetch('/.netlify/functions/process-order', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(orderData)
                    });

                    if (response.ok) {
                        const result = await response.json();
                        console.log('Order processed successfully:', result);
                        
                        // Save order locally for tracking
                        saveOrderLocally(orderData);
                        
                        // Clear cart and close checkout
                        cart = [];
                        updateCartCount();
                        closeCheckout();
                        
                        // Check for GCash payment and show appropriate notification
                        if (orderData.paymentMethod === 'gcash') {
                            const gcashDetails = `Order ${orderData.orderId} confirmed!

GCash Payment Required:
Amount: PHP ${orderData.total.toFixed(2)}
GCash Number: ${result.paymentResult?.gcash_number || 'Will be sent via email'}
Reference: ${result.paymentResult?.reference || orderData.orderId}

Email payment screenshot to: ${orderData.email}
We'll process your order within 1-24 hours!`;
                            
                            if (typeof showGcashNotification === 'function') {
                                showGcashNotification(gcashDetails);
                            } else {
                                showNotification(gcashDetails);
                            }
                        } else {
                            showNotification(`Order ${orderData.orderId} confirmed! Check your email for details.`);
                        }
                        
                    } else {
                        const errorData = await response.json().catch(() => ({}));
                        console.error('Server response error:', response.status, errorData);
                        throw new Error(`Server error: ${response.status} - ${errorData.error || response.statusText}`);
                    }
                } catch (netError) {
                    console.log('Server not available, using local fallback...', netError.message);
                    
                    // Fallback: save order locally and show user
                    saveOrderLocally(orderData);
                    
                    // Clear cart and close checkout
                    cart = [];
                    updateCartCount();
                    closeCheckout();
                    
                    // Show local save notification
                    showNotification(`Order ${orderData.orderId} saved locally! We'll process it when servers are available.`);
                }

            } catch (error) {
                console.error('Checkout error:', error);
                showNotification('Order failed. Please try again.');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// Add missing essential functions to complete the system
window.displayCartItems = function() {
    try {
        const cartModal = document.getElementById('cartModal');
        const cartItemsContainer = document.getElementById('cartItems');
        const cartTotalElement = document.getElementById('cartTotal');
        
        if (!cartItemsContainer) {
            console.error('Cart items container not found');
            return;
        }
        
        if (!cart || cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
            if (cartTotalElement) cartTotalElement.textContent = formatPrice(0);
            return;
        }
        
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                    <div class="cart-item-quantity">Qty: ${item.quantity}</div>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (cartTotalElement) cartTotalElement.textContent = formatPrice(total);
        
    } catch (e) { console.error('displayCartItems error:', e); }
};

window.displayOrderSummary = function() {
    try {
        const orderSummaryContainer = document.getElementById('orderSummary');
        if (!orderSummaryContainer) {
            console.error('Order summary container not found');
            return;
        }
        
        if (!cart || cart.length === 0) {
            orderSummaryContainer.innerHTML = '<div>No items in cart</div>';
            return;
        }
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        orderSummaryContainer.innerHTML = `
            <h3>Order Summary</h3>
            <div class="order-items">
                ${cart.map(item => `
                    <div class="order-item">
                        <span>${item.name} x${item.quantity}</span>
                        <span>${formatPrice(item.price * item.quantity)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                <strong>Total: ${formatPrice(total)}</strong>
            </div>
        `;
        
    } catch (e) { console.error('displayOrderSummary error:', e); }
};

window.showNotification = function(message) {
    try {
        console.log('Notification:', message);
        
        // Create or update notification element
        let notification = document.getElementById('notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(103, 126, 234, 0.95);
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                font-size: 0.9rem;
                font-weight: 600;
                z-index: 2000;
                max-width: 300px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                transition: all 0.3s ease;
                opacity: 0;
            `;
            document.body.appendChild(notification);
        }
        
        notification.textContent = message;
        notification.style.opacity = '1';
        
        // Auto-hide after 4 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 4000);
        
    } catch (e) { console.error('showNotification error:', e); }
};

window.setupFilters = function() {
    try {
        console.log('Setting up game filters...');
        
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                // Set current filter
                const filter = button.dataset.game;
                currentFilter = filter;
                
                console.log('Filter changed to:', filter);
                displayItems();
            });
        });
        
        console.log('Game filters setup complete');
    } catch (e) { console.error('setupFilters error:', e); }
};

window.saveOrderLocally = function(orderData) {
    try {
        console.log('Saving order locally:', orderData.orderId);
        
        // Get existing orders
        const existingOrders = JSON.parse(localStorage.getItem('triogel-orders') || '[]');
        
        // Add new order
        existingOrders.push(orderData);
        
        // Save back to localStorage
        localStorage.setItem('triogel-orders', JSON.stringify(existingOrders));
        
        console.log('Order saved locally successfully');
    } catch (e) { console.error('saveOrderLocally error:', e); }
};

window.trackOrderById = function(orderId) {
    try {
        console.log('Tracking order:', orderId);
        
        // Search in local storage first
        const localOrders = JSON.parse(localStorage.getItem('triogel-orders') || '[]');
        const foundOrder = localOrders.find(order => order.orderId === orderId);
        
        const resultDiv = document.getElementById('orderResult');
        if (!resultDiv) {
            console.error('Order result container not found');
            return;
        }
        
        if (foundOrder) {
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = `
                <div class="order-found">
                    <h3>Order Found: ${foundOrder.orderId}</h3>
                    <div class="order-details">
                        <p><strong>Game Username:</strong> ${foundOrder.gameUsername}</p>
                        <p><strong>Email:</strong> ${foundOrder.email}</p>
                        <p><strong>Payment Method:</strong> ${foundOrder.paymentMethod}</p>
                        <p><strong>Total:</strong> ${formatPrice(foundOrder.total)}</p>
                        <p><strong>Status:</strong> <span class="status-pending">Pending</span></p>
                        <p><strong>Date:</strong> ${new Date(foundOrder.timestamp).toLocaleString()}</p>
                    </div>
                    <div class="order-items-list">
                        <h4>Items:</h4>
                        ${foundOrder.items.map(item => `
                            <div class="order-item-detail">
                                ${item.name} (${item.game.toUpperCase()}) x${item.quantity} - ${formatPrice(item.price * item.quantity)}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else {
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = `
                <div class="order-not-found">
                    <h3>Order Not Found</h3>
                    <p>No order found with ID: ${orderId}</p>
                    <p>Please check your order ID and try again.</p>
                </div>
            `;
        }
        
    } catch (e) { console.error('trackOrderById error:', e); }
};

window.loginUser = async function(email, password) {
    try {
        console.log('Attempting login for:', email);
        
        // Simple validation
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        
        // For now, use simple localStorage authentication
        const registeredUsers = JSON.parse(localStorage.getItem('triogel-users') || '[]');
        const existingUser = registeredUsers.find(user => 
            user.email === email && user.password === password
        );
        
        if (existingUser) {
            // User found - log them in
            console.log('User found, logging in:', existingUser.username);
            
            const user = {
                id: existingUser.id,
                username: existingUser.username,
                email: existingUser.email,
                favoriteGame: existingUser.favoriteGame,
                joinDate: existingUser.joinDate
            };
            
            window.currentUser = user;
            localStorage.setItem('triogel-user', JSON.stringify(user));
            
            showUserSection();
            closeLoginModal();
            showNotification(`Welcome back, ${user.username}!`);
            
            console.log('Login successful');
        } else {
            // For demo purposes, create a session anyway
            const user = {
                id: Date.now(),
                username: email.split('@')[0],
                email: email,
                favoriteGame: 'ml',
                joinDate: new Date().toISOString()
            };
            
            window.currentUser = user;
            localStorage.setItem('triogel-user', JSON.stringify(user));
            
            showUserSection();
            closeLoginModal();
            showNotification(`Welcome, ${user.username}! (Demo login)`);
            
            console.log('Demo login successful');
        }
        
    } catch (e) { 
        console.error('loginUser error:', e);
        throw e; 
    }
};

window.registerUser = async function(userData) {
    try {
        console.log('Attempting registration for:', userData.username);
        
        // Simple validation
        if (!userData.username || !userData.email || !userData.password) {
            throw new Error('All fields are required');
        }
        
        if (userData.password !== userData.confirmPassword) {
            throw new Error('Passwords do not match');
        }
        
        // Check if user already exists
        const registeredUsers = JSON.parse(localStorage.getItem('triogel-users') || '[]');
        const existingUser = registeredUsers.find(user => user.email === userData.email);
        
        if (existingUser) {
            throw new Error('An account with this email already exists');
        }
        
        // Create user record
        const user = {
            id: Date.now(),
            username: userData.username,
            email: userData.email,
            password: userData.password, // Store password for demo login
            favoriteGame: userData.favoriteGame || 'ml',
            joinDate: new Date().toISOString()
        };
        
        // Save to users array
        registeredUsers.push(user);
        localStorage.setItem('triogel-users', JSON.stringify(registeredUsers));
        
        // Create current session (without password)
        const sessionUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            favoriteGame: user.favoriteGame,
            joinDate: user.joinDate
        };
        
        window.currentUser = sessionUser;
        localStorage.setItem('triogel-user', JSON.stringify(sessionUser));
        
        showUserSection();
        closeRegisterModal();
        showNotification(`Account created successfully! Welcome, ${user.username}!`);
        
        console.log('Registration successful');
        
    } catch (e) { 
        console.error('registerUser error:', e);
        throw e; 
    }
};

window.showLoginSection = function() {
    try {
        const loginSection = document.getElementById('loginSection');
        const userSection = document.getElementById('userSection');
        
        if (loginSection) loginSection.style.display = 'block';
        if (userSection) userSection.style.display = 'none';
    } catch (e) { console.error('showLoginSection error:', e); }
};

window.showUserSection = function() {
    try {
        if (!window.currentUser) {
            showLoginSection();
            return;
        }
        
        const loginSection = document.getElementById('loginSection');
        const userSection = document.getElementById('userSection');
        
        if (loginSection) loginSection.style.display = 'none';
        if (userSection) {
            userSection.style.display = 'block';
            const userName = userSection.querySelector('.user-name');
            if (userName) userName.textContent = window.currentUser.username;
        }
    } catch (e) { console.error('showUserSection error:', e); }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded - Starting TRIOGEL...');
    
    // Check for existing user session
    const savedUser = localStorage.getItem('triogel-user');
    if (savedUser) {
        try {
            window.currentUser = JSON.parse(savedUser);
            showUserSection();
        } catch (e) {
            localStorage.removeItem('triogel-user');
            showLoginSection();
        }
    } else {
        showLoginSection();
    }
    
    init();
    
    console.log('TRIOGEL startup completed!');
});

// Clean up currency update interval when page is closed
window.addEventListener('beforeunload', function() {
    if (currencyUpdateInterval) {
        clearInterval(currencyUpdateInterval);
        console.log('Currency update interval cleared');
    }
});