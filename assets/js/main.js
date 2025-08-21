// TRIOGEL JavaScript - Clean Version
console.log('?? Loading TRIOGEL JavaScript...');

// Currency configuration
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
let currentUser = null;

// Core Functions
function formatPrice(priceInPHP, targetCurrency = selectedCurrency) {
    if (targetCurrency === 'PHP') return `PHP ${priceInPHP.toLocaleString('en-PH', {minimumFractionDigits: 2})}`;
    
    const rate = currencies[targetCurrency]?.rate || 1;
    const convertedPrice = priceInPHP * rate;
    const currencyConfig = currencies[targetCurrency];
    
    if (!currencyConfig) return `PHP ${priceInPHP.toLocaleString('en-PH', {minimumFractionDigits: 2})}`;
    
    let formattedAmount;
    if (targetCurrency === 'JPY' || targetCurrency === 'KRW' || targetCurrency === 'VND') {
        formattedAmount = Math.round(convertedPrice).toLocaleString();
    } else {
        formattedAmount = convertedPrice.toLocaleString('en-US', {minimumFractionDigits: 2});
    }
    
    return `${currencyConfig.code} ${formattedAmount}`;
}

function displayItems() {
    console.log('?? Displaying items for filter:', currentFilter);
    const grid = document.getElementById('itemsGrid');
    if (!grid) {
        console.error('? Items grid element not found!');
        return;
    }
    
    const filteredItems = currentFilter === 'all' ? items : items.filter(item => item.game === currentFilter);
    console.log(`?? Items to display: ${filteredItems.length}`);

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
        console.error('? Item not found:', itemId);
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

function setCurrency(currencyCode) {
    console.log('?? Changing currency to:', currencyCode);
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
    console.log('?? Setting up currency selector...');
    
    const currencyDropdown = document.getElementById('currencyDropdown');
    if (!currencyDropdown) {
        console.error('? currencyDropdown element not found');
        return;
    }
    
    currencyDropdown.innerHTML = Object.entries(currencies).map(([code, config]) => `
        <div class="currency-option" data-currency="${code}">
            <span class="currency-code">${code}</span>
            <span class="currency-name">${config.name}</span>
        </div>
    `).join('');
    
    currencyDropdown.addEventListener('click', (e) => {
        const option = e.target.closest('.currency-option');
        if (option) {
            const currency = option.dataset.currency;
            setCurrency(currency);
            toggleCurrencySelector();
        }
    });
    
    console.log('? Currency selector setup complete');
}

function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.game;
            displayItems();
        });
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-gradient);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 3000;
        font-weight: 700;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Cart Functions
function openCart() {
    document.getElementById('cartModal').style.display = 'block';
    displayCartItems();
}

function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

function displayCartItems() {
    const cartItemsDiv = document.getElementById('cartItems');
    const cartTotalDiv = document.getElementById('cartTotal');

    if (!cartItemsDiv || !cartTotalDiv) {
        console.error('? Cart elements not found');
        return;
    }

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">Your cart is empty</p>';
        cartTotalDiv.innerHTML = `Total: ${formatPrice(0)}`;
        return;
    }

    const totalInPHP = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    cartItemsDiv.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <strong>${item.name}</strong><br>
                <small style="color: var(--text-secondary);">${gameNames[item.game]} - Qty: ${item.quantity}</small>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 1.2rem; font-weight: 700; color: var(--success-green);">${formatPrice(item.price * item.quantity)}</div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');

    cartTotalDiv.innerHTML = `Total: ${formatPrice(totalInPHP)}`;
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartCount();
    displayCartItems();
}

// Auth stub functions
function openLoginModal() { showNotification('Login feature coming soon!'); }
function openRegisterModal() { showNotification('Register feature coming soon!'); }
function openOrderTracking() { showNotification('Order tracking coming soon!'); }

// Validation Functions
function validateItemsSystem() {
    console.log('?? Validating items system...');
    
    if (!Array.isArray(items) || items.length === 0) {
        console.error('? Items array missing or empty');
        return false;
    }
    
    if (typeof displayItems !== 'function') {
        console.error('? displayItems function missing');
        return false;
    }
    
    const grid = document.getElementById('itemsGrid');
    if (!grid) {
        console.error('? itemsGrid element missing');
        return false;
    }
    
    try {
        displayItems();
        const itemCards = grid.querySelectorAll('.item-card');
        if (itemCards.length === 0) {
            console.error('? Items not rendering to DOM');
            return false;
        }
        console.log(`? Items system validated: ${itemCards.length} items displayed`);
        return true;
    } catch (error) {
        console.error('? Error in displayItems():', error);
        return false;
    }
}

// Initialize everything
function init() {
    console.log('?? TRIOGEL Initializing...');
    
    // Load saved currency
    const savedCurrency = localStorage.getItem('triogel-currency');
    if (savedCurrency && currencies[savedCurrency]) {
        selectedCurrency = savedCurrency;
        console.log('?? Loaded saved currency:', savedCurrency);
    }
    
    displayItems();
    updateCartCount();
    setupFilters();
    setupCurrencySelector();
    updateCurrencySelector();
    
    console.log('? TRIOGEL Initialized successfully!');
}

// Make functions globally accessible
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.toggleCurrencySelector = toggleCurrencySelector;
window.setCurrency = setCurrency;
window.openLoginModal = openLoginModal;
window.openRegisterModal = openRegisterModal;
window.openOrderTracking = openOrderTracking;
window.validateItemsSystem = validateItemsSystem;

// Close dropdowns when clicking outside
document.addEventListener('click', function (e) {
    if (!e.target.closest('#currencySelector') && !e.target.closest('#currencyDropdown')) {
        const dropdown = document.getElementById('currencyDropdown');
        const selector = document.getElementById('currencySelector');
        if (dropdown && selector) {
            dropdown.style.display = 'none';
            selector.classList.remove('active');
        }
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('?? DOM loaded - Starting TRIOGEL...');
    
    init();
    
    // Validate after initialization
    setTimeout(() => {
        const itemsValid = validateItemsSystem();
        if (!itemsValid) {
            console.error('? CRITICAL: Items system failed validation');
            alert('CRITICAL ERROR: Items not loading. Check console for details.');
        }
        
        // Test currency dropdown
        const currencyButton = document.getElementById('currencySelector');
        const currencyDropdown = document.getElementById('currencyDropdown');
        
        if (currencyButton && currencyDropdown) {
            console.log('? Currency selector elements found');
        } else {
            console.error('? Currency selector elements missing');
        }
        
        console.log('?? TRIOGEL validation completed!');
    }, 500);
});

console.log('? TRIOGEL JavaScript loaded successfully!');