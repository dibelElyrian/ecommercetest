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
    'switchToLogin', 'switchToRegister', 'logoutUser'
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
const currencies = {
    'PHP': { symbol: '', name: 'Philippine Peso', code: 'PHP', rate: 1.0 },
    'USD': { symbol: '', name: 'US Dollar', code: 'USD', rate: 0.018 },
    'EUR': { symbol: '', name: 'Euro', code: 'EUR', rate: 0.016 },
    'GBP': { symbol: '', name: 'British Pound', code: 'GBP', rate: 0.014 },
    'JPY': { symbol: '', name: 'Japanese Yen', code: 'JPY', rate: 2.65 },
    'KRW': { symbol: '', name: 'Korean Won', code: 'KRW', rate: 23.5 },
    'SGD': { symbol: '', name: 'Singapore Dollar', code: 'SGD', rate: 0.024 },
    'MYR': { symbol: '', name: 'Malaysian Ringgit', code: 'MYR', rate: 0.082 },
    'THB': { symbol: '', name: 'Thai Baht', code: 'THB', rate: 0.63 },
    'VND': { symbol: '', name: 'Vietnamese Dong', code: 'VND', rate: 440 }
};

// Real-time currency conversion system
const currencySystem = {
    // Cache settings for exchange rates
    cacheKey: 'triogel-exchange-rates',
    cacheTimestamp: 'triogel-rates-timestamp',
    cacheExpiry: 4 * 60 * 60 * 1000, // 4 hours in milliseconds
    
    // API configuration (using free exchangerate-api.com)
    apiConfig: {
        baseURL: 'https://api.exchangerate-api.com/v4/latest/PHP',
        fallbackURL: 'https://api.fxratesapi.com/latest?base=PHP',
        timeout: 10000, // 10 second timeout
        retryAttempts: 3
    },
    
    // Static fallback rates (BSP-compliant estimates for business continuity)
    fallbackRates: {
        'PHP': 1.0,
        'USD': 0.018,
        'EUR': 0.016,
        'GBP': 0.014,
        'JPY': 2.65,
        'KRW': 23.5,
        'SGD': 0.024,
        'MYR': 0.082,
        'THB': 0.63,
        'VND': 440
    },
    
    // BSP compliance: transaction limits per currency
    transactionLimits: {
        'USD': { single: 50000, daily: 100000 }, // BSP limits for USD
        'EUR': { single: 45000, daily: 90000 },
        'GBP': { single: 40000, daily: 80000 },
        'JPY': { single: 6500000, daily: 13000000 },
        'KRW': { single: 65000000, daily: 130000000 },
        'SGD': { single: 70000, daily: 140000 },
        'MYR': { single: 220000, daily: 440000 },
        'THB': { single: 1800000, daily: 3600000 },
        'VND': { single: 1200000000, daily: 2400000000 },
        'PHP': { single: 500000, daily: 1000000 } // PHP limits for local transactions
    },
    
    // Check if cached rates are still valid
    isCacheValid: function() {
        try {
            const timestamp = localStorage.getItem(this.cacheTimestamp);
            if (!timestamp) return false;
            
            const cacheAge = Date.now() - parseInt(timestamp);
            return cacheAge < this.cacheExpiry;
        } catch (error) {
            console.error('Error checking cache validity:', error);
            return false;
        }
    },
    
    // Get cached exchange rates
    getCachedRates: function() {
        try {
            if (!this.isCacheValid()) return null;
            
            const cachedRates = localStorage.getItem(this.cacheKey);
            return cachedRates ? JSON.parse(cachedRates) : null;
        } catch (error) {
            console.error('Error retrieving cached rates:', error);
            return null;
        }
    },
    
    // Cache exchange rates with timestamp
    cacheRates: function(rates) {
        try {
            localStorage.setItem(this.cacheKey, JSON.stringify(rates));
            localStorage.setItem(this.cacheTimestamp, Date.now().toString());
            console.log('Exchange rates cached successfully');
        } catch (error) {
            console.error('Error caching exchange rates:', error);
        }
    },
    
    // Fetch real-time exchange rates from API
    fetchRealTimeRates: async function() {
        let attempt = 0;
        const maxAttempts = this.apiConfig.retryAttempts;
        
        while (attempt < maxAttempts) {
            try {
                console.log(`Fetching exchange rates (attempt ${attempt + 1}/${maxAttempts})...`);
                
                // Create abort controller for timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.apiConfig.timeout);
                
                // Try primary API
                let response;
                try {
                    response = await fetch(this.apiConfig.baseURL, {
                        signal: controller.signal,
                        headers: {
                            'Accept': 'application/json',
                            'User-Agent': 'TRIOGEL-Exchange-Rate-Client'
                        }
                    });
                } catch (primaryError) {
                    console.log('Primary API failed, trying fallback...');
                    // Try fallback API
                    response = await fetch(this.apiConfig.fallbackURL, {
                        signal: controller.signal,
                        headers: {
                            'Accept': 'application/json',
                            'User-Agent': 'TRIOGEL-Exchange-Rate-Client'
                        }
                    });
                }
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`API responded with status: ${response.status}`);
                }
                
                const data = await response.json();
                
                // Validate response structure
                if (!data.rates || typeof data.rates !== 'object') {
                    throw new Error('Invalid API response structure');
                }
                
                // Extract rates for our supported currencies
                const extractedRates = {};
                Object.keys(currencies).forEach(currencyCode => {
                    if (currencyCode === 'PHP') {
                        extractedRates[currencyCode] = 1.0; // Base currency
                    } else if (data.rates[currencyCode]) {
                        extractedRates[currencyCode] = data.rates[currencyCode];
                    } else {
                        // Use fallback rate if not available in API
                        extractedRates[currencyCode] = this.fallbackRates[currencyCode];
                        console.warn(`Using fallback rate for ${currencyCode}`);
                    }
                });
                
                console.log('Real-time exchange rates fetched successfully:', extractedRates);
                return extractedRates;
                
            } catch (error) {
                console.error(`Exchange rate fetch attempt ${attempt + 1} failed:`, error.message);
                attempt++;
                
                if (attempt < maxAttempts) {
                    // Wait before retrying (exponential backoff)
                    const waitTime = Math.pow(2, attempt) * 1000;
                    console.log(`Retrying in ${waitTime / 1000} seconds...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }
            }
        }
        
        // All attempts failed
        console.error('All attempts to fetch real-time rates failed, using fallback rates');
        return null;
    },
    
    // Update currency rates (main function)
    updateExchangeRates: async function() {
        try {
            console.log('Updating exchange rates...');
            
            // Check if we have valid cached rates
            const cachedRates = this.getCachedRates();
            if (cachedRates) {
                console.log('Using cached exchange rates');
                this.applyRates(cachedRates);
                return true;
            }
            
            // Show loading indicator for currency updates
            this.showCurrencyUpdateStatus('Updating exchange rates...');
            
            // Fetch new rates
            const freshRates = await this.fetchRealTimeRates();
            
            if (freshRates) {
                // Apply and cache the new rates
                this.applyRates(freshRates);
                this.cacheRates(freshRates);
                this.showCurrencyUpdateStatus('Exchange rates updated!', false);
                return true;
            } else {
                // Fallback to static rates
                console.log('Using fallback exchange rates');
                this.applyRates(this.fallbackRates);
                this.showCurrencyUpdateStatus('Using standard rates', false);
                return false;
            }
            
        } catch (error) {
            console.error('Error updating exchange rates:', error);
            // Use fallback rates in case of any error
            this.applyRates(this.fallbackRates);
            this.showCurrencyUpdateStatus('Using standard rates', false);
            return false;
        }
    },
    
    // Apply exchange rates to the currencies object
    applyRates: function(rates) {
        Object.keys(rates).forEach(currencyCode => {
            if (currencies[currencyCode]) {
                currencies[currencyCode].rate = rates[currencyCode];
                // Add last updated timestamp
                currencies[currencyCode].lastUpdated = new Date().toISOString();
            }
        });
        
        // Refresh the display if items are already shown
        if (typeof displayItems === 'function') {
            displayItems();
        }
        
        console.log('Exchange rates applied successfully');
    },
    
    // Show currency update status to user
    showCurrencyUpdateStatus: function(message, persist = true) {
        // Create or update status indicator
        let statusDiv = document.getElementById('currency-status');
        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.id = 'currency-status';
            statusDiv.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(103, 126, 234, 0.9);
                color: white;
                padding: 10px 15px;
                border-radius: 8px;
                font-size: 0.9rem;
                font-weight: 600;
                z-index: 2500;
                max-width: 300px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                transition: all 0.3s ease;
            `;
            document.body.appendChild(statusDiv);
        }
        
        statusDiv.textContent = message;
        statusDiv.style.opacity = '1';
        
        if (!persist) {
            // Auto-hide after 3 seconds
            setTimeout(() => {
                statusDiv.style.opacity = '0';
                setTimeout(() => {
                    if (statusDiv.parentNode) {
                        statusDiv.remove();
                    }
                }, 300);
            }, 3000);
        }
    },
    
    // Compliance check for transaction amounts
    checkTransactionCompliance: function(amount, currency) {
        const limits = this.transactionLimits[currency];
        if (!limits) return { compliant: true }; // No limits defined
        
        const amountInTargetCurrency = amount * (currencies[currency]?.rate || 1);
        
        return {
            compliant: amountInTargetCurrency <= limits.single,
            limit: limits.single,
            currentAmount: amountInTargetCurrency,
            requiresDocumentation: amountInTargetCurrency > 50000 && currency !== 'PHP',
            requiresBSPApproval: amountInTargetCurrency > 100000 && currency !== 'PHP'
        };
    },
    
    // Get exchange rate with metadata
    getExchangeRateInfo: function(currency) {
        const currencyInfo = currencies[currency];
        if (!currencyInfo) return null;
        
        return {
            code: currency,
            name: currencyInfo.name,
            rate: currencyInfo.rate,
            lastUpdated: currencyInfo.lastUpdated || 'Static rate',
            source: currencyInfo.lastUpdated ? 'Real-time API' : 'Static fallback'
        };
    }
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
    
    // Check BSP compliance for transaction
    const compliance = currencySystem.checkTransactionCompliance(priceInPHP, targetCurrency);
    
    let formattedAmount;
    if (targetCurrency === 'JPY' || targetCurrency === 'KRW' || targetCurrency === 'VND') {
        formattedAmount = Math.round(convertedPrice).toLocaleString();
    } else {
        formattedAmount = convertedPrice.toLocaleString('en-US', {minimumFractionDigits: 2});
    }
    
    let priceDisplay = `${currencyConfig.code} ${formattedAmount}`;
    
    // Add compliance warning for high-value transactions
    if (!compliance.compliant) {
        priceDisplay += ' (Requires Documentation)';
    }
    
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
    const rateInfo = currencySystem.getExchangeRateInfo(currencyCode);
    
    let notificationMessage = `Currency changed to ${currencyName}`;
    if (rateInfo && rateInfo.source === 'Real-time API') {
        notificationMessage += ` (Live rates)`;
    }
    
    showNotification(notificationMessage);
    localStorage.setItem('triogel-currency', currencyCode);
}

function updateCurrencySelector() {
    const selectedOption = document.getElementById('selectedCurrency');
    if (selectedOption && currencies[selectedCurrency]) {
        selectedOption.textContent = currencies[selectedCurrency].code;
    }
}

function toggleCurrencySelector() {
    const dropdown = document.getElementById('currencyDropdown');
    const selector = document.getElementById('currencySelector');
    
    if (dropdown && selector) {
        const isOpen = dropdown.style.display === 'block';
        dropdown.style.display = isOpen ? 'none' : 'block';
        selector.classList.toggle('active', !isOpen);
    }
}

function setupCurrencySelector() {
    console.log('Setting up currency selector...');
    
    const currencyDropdown = document.getElementById('currencyDropdown');
    if (!currencyDropdown) {
        console.error('currencyDropdown element not found');
        return;
    }
    
    currencyDropdown.innerHTML = Object.entries(currencies).map(([code, config]) => {
        const rateInfo = currencySystem.getExchangeRateInfo(code);
        const isLiveRate = rateInfo && rateInfo.source === 'Real-time API';
        
        return `
            <div class="currency-option" data-currency="${code}">
                <div class="currency-main">
                    <span class="currency-code">${code}</span>
                    <span class="currency-name">${config.name}</span>
                </div>
                <div class="currency-meta">
                    <span class="currency-rate">1 PHP = ${config.rate.toFixed(code === 'JPY' || code === 'KRW' || code === 'VND' ? 0 : 4)} ${code}</span>
                    ${isLiveRate ? '<span class="rate-badge live">Live</span>' : '<span class="rate-badge static">Static</span>'}
                </div>
            </div>
        `;
    }).join('');
    
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

// Add rate refresh functionality
function refreshExchangeRates() {
    console.log('Manual exchange rate refresh requested');
    
    // Clear cache to force fresh fetch
    localStorage.removeItem(currencySystem.cacheKey);
    localStorage.removeItem(currencySystem.cacheTimestamp);
    
    // Update rates
    currencySystem.updateExchangeRates().then(success => {
        if (success) {
            showNotification('Exchange rates refreshed successfully!');
            // Update currency selector to show new rates
            setupCurrencySelector();
        } else {
            showNotification('Using standard rates - API unavailable');
        }
    });
}

// Enhanced initialization with real-time rate loading
function initializeCurrencySystem() {
    console.log('Initializing currency system...');
    
    // Load saved currency preference
    const savedCurrency = localStorage.getItem('triogel-currency');
    if (savedCurrency && currencies[savedCurrency]) {
        selectedCurrency = savedCurrency;
        console.log('Loaded saved currency:', savedCurrency);
    }
    
    // Update exchange rates in background
    currencySystem.updateExchangeRates().then(success => {
        console.log('Currency system initialized:', success ? 'with live rates' : 'with fallback rates');
        
        // Update currency selector after rates are loaded
        setupCurrencySelector();
        updateCurrencySelector();
        
        // Refresh display if items are already shown
        if (typeof displayItems === 'function') {
            displayItems();
        }
    });
}

// Add currency rate monitoring (updates every 4 hours)
function startCurrencyRateMonitoring() {
    // Check for rate updates every 4 hours
    setInterval(() => {
        console.log('Periodic exchange rate update check...');
        currencySystem.updateExchangeRates();
    }, 4 * 60 * 60 * 1000); // 4 hours
    
    // Also update when tab becomes visible again (user returns to site)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && !currencySystem.isCacheValid()) {
            console.log('Tab became visible, checking for rate updates...');
            currencySystem.updateExchangeRates();
        }
    });
}


// Local Order Storage Functions
function saveOrderLocally(orderData) {
    console.log('Saving order locally:', orderData.orderId);
    
    if (!currentUser) {
        console.error('Cannot save order locally - no user logged in');
        return;
    }
    
    // Add order to user's order history
    currentUser.orders = currentUser.orders || [];
    currentUser.orders.push({
        orderId: orderData.orderId,
        status: 'pending',
        total: orderData.total,
        username: orderData.gameUsername,
        timestamp: orderData.timestamp,
        items: orderData.items
    });
    
    localStorage.setItem('triogel-user', JSON.stringify(currentUser));
    console.log('Order saved locally to user data');
}

// Close dropdowns when clicking outside
document.addEventListener('click', function (e) {
    // Close currency dropdown
    if (!e.target.closest('#currencySelector') && !e.target.closest('#currencyDropdown')) {
        const dropdown = document.getElementById('currencyDropdown');
        const selector = document.getElementById('currencySelector');
        if (dropdown && selector) {
            dropdown.style.display = 'none';
            selector.classList.remove('active');
        }
    }
    
    // Close user dropdown
    if (!e.target.closest('.user-dropdown')) {
        closeUserDropdown();
    }
    
    // Close modals when clicking outside
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded - Starting TRIOGEL...');
    console.log('DEBUG: About to call init()...');
    
    // Validate onclick functions first
    setTimeout(() => {
        const functionsValid = validateOnclickFunctions();
        if (!functionsValid) {
            console.error('CRITICAL: onclick functions validation failed');
            alert('CRITICAL ERROR: Some functions missing. Check console for details.');
        } else {
            console.log('onclick functions validation passed');
        }
    }, 500);
    
    // Emergency check - are all critical elements present?
    const itemsGrid = document.getElementById('itemsGrid');
    console.log('DEBUG: itemsGrid element found:', itemsGrid ? 'YES' : 'NO');
    
    if (!itemsGrid) {
        console.error('CRITICAL: itemsGrid element missing from HTML!');
        alert('CRITICAL ERROR: itemsGrid element not found in HTML. Check the DOM.');
        return;
    }
    
    // Emergency check - is items array defined?
    console.log('DEBUG: items array defined:', typeof items);
    console.log('DEBUG: items array length:', Array.isArray(items) ? items.length : 'NOT ARRAY');
    
    if (!Array.isArray(items) || items.length === 0) {
        console.error('CRITICAL: Items array missing or empty!');
        alert('CRITICAL ERROR: Items array not loaded. Check JavaScript.');
        return;
    }
    
    // Emergency direct item display test
    console.log('DEBUG: Attempting direct item display...');
    try {
        itemsGrid.innerHTML = '<div style="color: white; padding: 20px;">DEBUG: Direct HTML insertion test successful</div>';
        setTimeout(() => {
            displayItems();
        }, 100);
    } catch (error) {
        console.error('CRITICAL: Error in direct display test:', error);
        alert('CRITICAL ERROR: Direct display test failed. Check console.');
        return;
    }
    
    init();
    
    // Validate after initialization
    setTimeout(() => {
        const itemsValid = validateItemsSystem();
        if (!itemsValid) {
            console.error('CRITICAL: Items system failed validation');
            alert('CRITICAL ERROR: Items not loading. Check console for details.');
        } else {
            console.log('Items system working correctly');
        }
        
        // Test currency dropdown
        const currencyButton = document.getElementById('currencySelector');
        const currencyDropdown = document.getElementById('currencyDropdown');
        
        if (currencyButton && currencyDropdown) {
            console.log('Currency selector elements found');
        } else {
            console.error('Currency selector elements missing');
        }
        
        console.log('TRIOGEL validation completed!');
    }, 1000);
});

console.log('TRIOGEL JavaScript loaded successfully!');

// EMERGENCY FALLBACK - Force items to load after 2 seconds if nothing else works
setTimeout(() => {
    const grid = document.getElementById('itemsGrid');
    if (grid && (!grid.innerHTML || grid.innerHTML.trim() === '')) {
        console.log('EMERGENCY: Force loading items after timeout...');
        
        // Emergency direct items loading
        if (Array.isArray(items) && items.length > 0) {
            try {
                displayItems();
                console.log('EMERGENCY: Items force-loaded successfully');
            } catch (error) {
                console.error('EMERGENCY: Force loading failed:', error);
                
                // Last resort - manual HTML generation
                const emergencyHTML = items.map(item => `
                    <div style="background: rgba(255,255,255,0.1); padding: 20px; margin: 10px; border-radius: 10px; color: white;">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        <p><strong>Price: PHP ${item.price}</strong></p>
                        <button onclick="alert('Emergency mode - cart disabled')" style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 5px;">Add to Cart (Debug)</button>
                    </div>
                `).join('');
                
                grid.innerHTML = emergencyHTML;
                console.log('EMERGENCY: Manual HTML generation successful');
            }
        } else {
            console.error('EMERGENCY: Items array still not available');
            grid.innerHTML = '<div style="color: red; padding: 40px; text-align: center; background: rgba(255,0,0,0.1); border-radius: 10px;"><h2>EMERGENCY ERROR</h2><p>Items array not loaded. Check JavaScript console for details.</p></div>';
        }
    } else {
        console.log('Items already loaded, emergency fallback not needed');
    }
}, 2000);

function openWishlistModal() {
    closeUserDropdown();
    showNotification('Wishlist feature coming soon!');
}

function openForgotPassword() {
    closeLoginModal();
    showNotification('Password reset via email coming soon!');
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    document.getElementById('cartModal').style.display = 'none';
    document.getElementById('checkoutModal').style.display = 'block';
    displayOrderSummary();
}

function closeCheckout() {
    document.getElementById('checkoutModal').style.display = 'none';
}

function displayOrderSummary() {
    const summaryDiv = document.getElementById('orderSummary');
    if (!summaryDiv) return;
    
    const totalInPHP = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update the currency display field when checkout opens
    const currencyDisplayField = document.getElementById('selectedCurrencyDisplay');
    if (currencyDisplayField) {
        const currencyName = currencies[selectedCurrency]?.name || selectedCurrency;
        currencyDisplayField.value = `${selectedCurrency} - ${currencyName}`;
    }

    summaryDiv.innerHTML = `
        <h3 style="margin-bottom: 20px; color: var(--text-primary);">Order Summary</h3>
        ${cart.map(item => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>${item.name} x${item.quantity}</span>
                <span style="color: var(--success-green);">${formatPrice(item.price * item.quantity)}</span>
            </div>
        `).join('')}
        <hr style="border: 1px solid rgba(255, 255, 255, 0.1); margin: 20px 0;">
        <div style="display: flex; justify-content: space-between; font-size: 1.3rem; font-weight: 800;">
            <span>Total:</span>
            <span style="color: var(--success-green);">${formatPrice(totalInPHP)}</span>
        </div>
        ${selectedCurrency !== 'PHP' ? `
            <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 10px; text-align: center;">
                <em>Prices converted from PHP at current exchange rates</em>
            </div>
        ` : ''}
    `;
}

// Validation Functions
function validateItemsSystem() {
    console.log('Validating items system...');
    
    if (!Array.isArray(items) || items.length === 0) {
        console.error('Items array missing or empty');
        return false;
    }
    
    if (typeof displayItems !== 'function') {
        console.error('displayItems function missing');
        return false;
    }
    
    const grid = document.getElementById('itemsGrid');
    if (!grid) {
        console.error('itemsGrid element missing');
        return false;
    }
    
    try {
        displayItems();
        const itemCards = grid.querySelectorAll('.item-card');
        if (itemCards.length === 0) {
            console.error('Items not rendering to DOM');
            return false;
        }
        console.log(`Items system validated: ${itemCards.length} items displayed`);
        return true;
    } catch (error) {
        console.error('Error in displayItems():', error);
        return false;
    }
}

// Initialize everything
function init() {
    console.log('TRIOGEL Initializing...');
    
    // Initialize currency system with real-time rates
    initializeCurrencySystem();
    
    // Start currency rate monitoring
    startCurrencyRateMonitoring();
    
    // Initialize authentication
    initAuth();
    
    displayItems();
    updateCartCount();
    setupFilters();
    setupEventHandlers();
    
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

currencySystem.updateExchangeRates();

// Demo and testing functions for real-time currency conversion
const currencyDemo = {
    // Demo function to show currency conversion in action
    demonstrateRealTimeRates: function() {
        console.log('=== TRIOGEL Real-Time Currency Demo ===');
        
        // Show current rates
        console.log('Current Exchange Rates:');
        Object.entries(currencies).forEach(([code, config]) => {
            const rateInfo = currencySystem.getExchangeRateInfo(code);
            console.log(`${code}: ${config.rate.toFixed(6)} (${rateInfo.source})`);
        });
        
        // Demo price conversions
        const testPricesPHP = [100, 1000, 5000, 10000];
        console.log('\nPrice Conversion Examples:');
        
        testPricesPHP.forEach(price => {
            console.log(`PHP ${price}:`);
            Object.keys(currencies).forEach(currency => {
                if (currency !== 'PHP') {
                    const formatted = formatPrice(price, currency);
                    console.log(`  ? ${formatted}`);
                }
            });
            console.log('');
        });
        
        // Show compliance information
        console.log('BSP Compliance Check for PHP 100,000:');
        Object.keys(currencies).forEach(currency => {
            if (currency !== 'PHP') {
                const compliance = currencySystem.checkTransactionCompliance(100000, currency);
                console.log(`${currency}: ${compliance.compliant ? 'COMPLIANT' : 'REQUIRES DOCUMENTATION'}`);
            }
        });
    },
    
    // Test function to simulate API failure and fallback
    testFallbackRates: function() {
        console.log('=== Testing Fallback Rate System ===');
        
        // Clear cache to force API call
        localStorage.removeItem(currencySystem.cacheKey);
        localStorage.removeItem(currencySystem.cacheTimestamp);
        
        // Temporarily disable API to test fallback
        const originalURL = currencySystem.apiConfig.baseURL;
        currencySystem.apiConfig.baseURL = 'https://invalid-api-url.com/fail';
        currencySystem.apiConfig.fallbackURL = 'https://another-invalid-url.com/fail';
        
        // Attempt to update rates (should fail and use fallback)
        currencySystem.updateExchangeRates().then(success => {
            console.log(`Fallback test result: ${success ? 'API Success' : 'Using Fallback Rates'}`);
            
            // Restore original URL
            currencySystem.apiConfig.baseURL = originalURL;
            currencySystem.apiConfig.fallbackURL = 'https://api.fxratesapi.com/latest?base=PHP';
        });
    },
    
    // Function to manually update rates (useful for testing)
    forceRateUpdate: function() {
        console.log('Forcing exchange rate update...');
        refreshExchangeRates();
    }
};

// Add demo functions to global scope for easy testing
window.currencyDemo = currencyDemo;