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

window.logoutUser = async function() {
    try {
        console.log('Logging out user...');
        
        // Update session status in database if user is logged in
        if (window.currentUser && window.currentUser.id) {
            try {
                await dbUserManager.updateUserSession(window.currentUser.id, {
                    session_active: false,
                    last_logout: new Date().toISOString()
                });
                console.log('Database session updated on logout');
            } catch (dbError) {
                console.error('Error updating database session on logout:', dbError);
                // Continue with logout even if database update fails
            }
        }
        
        // Clear local session
        window.currentUser = null;
        localStorage.removeItem('triogel-user');
        
        if (typeof showLoginSection === 'function') showLoginSection();
        if (typeof showNotification === 'function') {
            showNotification('Logged out successfully!');
        }
        
        console.log('User logged out successfully');
    } catch (e) { 
        console.error('logoutUser error:', e);
        
        // Fallback: still clear local session even if database fails
        window.currentUser = null;
        localStorage.removeItem('triogel-user');
        if (typeof showLoginSection === 'function') showLoginSection();
        if (typeof showNotification === 'function') {
            showNotification('Logged out successfully!');
        }
    }
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
    apiConfig = {
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

// Authentication system initialization
window.initAuth = async function() {
    try {
        console.log('Initializing authentication system with database...');
        
        // Initialize Supabase
        initializeSupabase();
        
        // Check for existing user session in localStorage
        const savedUser = localStorage.getItem('triogel-user');
        if (savedUser) {
            try {
                window.currentUser = JSON.parse(savedUser);
                console.log('User session restored:', window.currentUser.username);
                
                // Verify session with database (optional - for enhanced security)
                if (window.currentUser.id && typeof window.currentUser.id === 'number') {
                    try {
                        const dbUser = await dbUserManager.getUserProfile(window.currentUser.id);
                        if (dbUser) {
                            // Update session with latest data from database
                            window.currentUser = {
                                id: dbUser.id,
                                username: dbUser.username,
                                email: dbUser.email,
                                favoriteGame: dbUser.favorite_game,
                                joinDate: dbUser.created_at
                            };
                            localStorage.setItem('triogel-user', JSON.stringify(window.currentUser));
                            console.log('Session verified with database');
                        }
                    } catch (dbError) {
                        console.log('Database verification failed, using cached session');
                    }
                }
                
                if (typeof showUserSection === 'function') {
                    showUserSection();
                }
            } catch (e) {
                console.error('Error restoring user session:', e);
            }
        } else {
            console.log('No existing user session found');
        }
    } catch (e) {
        console.error('Initialization error:', e);
    }
};