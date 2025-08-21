// IMMEDIATE DEBUG - Add at very start of file
console.log('TRIOGEL DEBUG: Script file starting to load...');

// Test basic functionality immediately
window.addEventListener('load', function() {
    console.log('TRIOGEL DEBUG: Window loaded event fired');
});

// TRIOGEL JavaScript - Clean Version
console.log('Loading TRIOGEL JavaScript...');

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
    
    console.log('Currency selector setup complete');
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

function showGcashNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 25px;
        border-radius: 15px;
        z-index: 3000;
        font-weight: 600;
        font-family: monospace;
        white-space: pre-line;
        max-width: 400px;
        box-shadow: 0 15px 40px rgba(16, 185, 129, 0.4);
        border: 2px solid rgba(16, 185, 129, 0.6);
        animation: slideInRight 0.5s ease;
    `;
    notification.textContent = message;

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = 'X';
    closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        opacity: 0.7;
    `;
    closeBtn.onclick = () => notification.remove();
    notification.appendChild(closeBtn);

    document.body.appendChild(notification);
    
    // Keep GCash notification longer (10 seconds)
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 10000);
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
        console.error('Cart elements not found');
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

// Auth and Modal Functions
let currentUser = null;

// Authentication Functions
function initAuth() {
    console.log('Initializing authentication...');
    
    const savedUser = localStorage.getItem('triogel-user');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            showUserSection();
            console.log('User auto-logged in:', currentUser.username);
        } catch (error) {
            console.error('Error loading saved user:', error);
            localStorage.removeItem('triogel-user');
        }
    }
}

function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    document.getElementById('loginEmail').focus();
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    clearLoginForm();
}

function openRegisterModal() {
    document.getElementById('registerModal').style.display = 'block';
    document.getElementById('registerUsername').focus();
}

function closeRegisterModal() {
    document.getElementById('registerModal').style.display = 'none';
    clearRegisterForm();
}

function switchToRegister() {
    closeLoginModal();
    openRegisterModal();
}

function switchToLogin() {
    closeRegisterModal();
    openLoginModal();
}

function clearLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.reset();
}

function clearRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) registerForm.reset();
}

async function loginUser(email, password) {
    try {
        console.log('Attempting login for:', email);
        
        const users = JSON.parse(localStorage.getItem('triogel-users') || '{}');
        const user = users[email.toLowerCase()];
        
        if (!user) {
            throw new Error('Account not found. Please register first.');
        }
        
        if (user.password !== password) {
            throw new Error('Invalid password. Please try again.');
        }
        
        currentUser = {
            id: user.id,
            username: user.username,
            email: user.email.toLowerCase(),
            favoriteGame: user.favoriteGame,
            joinDate: user.joinDate,
            orders: user.orders || [],
            wishlist: user.wishlist || []
        };
        
        localStorage.setItem('triogel-user', JSON.stringify(currentUser));
        showUserSection();
        closeLoginModal();
        showNotification(`Welcome back, ${currentUser.username}!`);
        console.log('Login successful:', currentUser.username);
        
        return { success: true, user: currentUser };
        
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

async function registerUser(userData) {
    try {
        console.log('Attempting registration for:', userData.email);
        
        if (userData.password !== userData.confirmPassword) {
            throw new Error('Passwords do not match!');
        }
        
        if (userData.password.length < 6) {
            throw new Error('Password must be at least 6 characters long!');
        }
        
        const users = JSON.parse(localStorage.getItem('triogel-users') || '{}');
        const email = userData.email.toLowerCase();
        
        if (users[email]) {
            throw new Error('An account with this email already exists!');
        }
        
        const newUser = {
            id: Date.now().toString(),
            username: userData.username,
            email: email,
            password: userData.password,
            favoriteGame: userData.favoriteGame,
            joinDate: new Date().toISOString(),
            orders: [],
            wishlist: []
        };
        
        users[email] = newUser;
        localStorage.setItem('triogel-users', JSON.stringify(users));
        
        currentUser = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            favoriteGame: newUser.favoriteGame,
            joinDate: newUser.joinDate,
            orders: [],
            wishlist: []
        };
        
        localStorage.setItem('triogel-user', JSON.stringify(currentUser));
        showUserSection();
        closeRegisterModal();
        showNotification(`Welcome to TRIOGEL, ${currentUser.username}!`);
        console.log('Registration successful:', currentUser.username);
        
        return { success: true, user: currentUser };
        
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

function showUserSection() {
    const loginSection = document.getElementById('loginSection');
    const userSection = document.getElementById('userSection');
    const userName = document.querySelector('.user-name');
    const userStats = document.getElementById('userStats');
    
    if (loginSection && userSection && userName && currentUser) {
        loginSection.style.display = 'none';
        userSection.style.display = 'block';
        userName.textContent = currentUser.username;
        
        const gameIcon = currentUser.favoriteGame === 'ml' ? 'ML' : currentUser.favoriteGame === 'roblox' ? 'RBX' : 'GAME';
        if (userStats) {
            userStats.innerHTML = `
                <div style="text-align: center; color: var(--text-secondary); font-size: 0.85rem;">
                    <div style="margin-bottom: 8px;">
                        ${gameIcon} ${getGameName(currentUser.favoriteGame)} Player
                    </div>
                    <div style="margin-bottom: 8px;">
                        Orders: ${currentUser.orders.length}
                    </div>
                    <div>
                        Wishlist: ${currentUser.wishlist.length} Items
                    </div>
                </div>
            `;
        }
    }
}

function showLoginSection() {
    const loginSection = document.getElementById('loginSection');
    const userSection = document.getElementById('userSection');
    
    if (loginSection && userSection) {
        loginSection.style.display = 'flex';
        userSection.style.display = 'none';
    }
}

function getGameName(gameCode) {
    const names = {
        'ml': 'Mobile Legends',
        'roblox': 'Roblox',
        'other': 'Various Games'
    };
    return names[gameCode] || 'Gamer';
}

function logoutUser() {
    console.log('Logging out user:', currentUser?.username);
    currentUser = null;
    localStorage.removeItem('triogel-user');
    showLoginSection();
    showNotification('Logged out successfully!');
}

// Order Tracking Functions
function openOrderTracking() {
    document.getElementById('orderTrackingModal').style.display = 'block';
    document.getElementById('orderId').value = '';
    const orderResult = document.getElementById('orderResult');
    if (orderResult) orderResult.style.display = 'none';
}

function closeOrderTracking() {
    document.getElementById('orderTrackingModal').style.display = 'none';
}

async function trackOrderById(orderId) {
    try {
        console.log('Tracking order:', orderId);
        
        const trackBtn = document.querySelector('.track-btn');
        const originalText = trackBtn.innerHTML;
        trackBtn.innerHTML = 'Tracking...';
        trackBtn.disabled = true;

        let orderData = null;
        
        // Try to fetch from Netlify function first
        try {
            const response = await fetch(`/.netlify/functions/track-order?orderId=${orderId}`);
            if (response.ok) {
                const result = await response.json();
                if (result.success && result.orders && result.orders.length > 0) {
                    orderData = result.orders[0];
                    console.log('Order found in database:', orderData);
                }
            }
        } catch (netError) {
            console.log('Database not available, checking local storage...');
        }

        // Fallback to localStorage
        if (!orderData) {
            orderData = findOrderInLocalStorage(orderId);
        }

        if (orderData) {
            displayOrderTrackingResult(orderData);
        } else {
            displayOrderNotFound(orderId);
        }

        trackBtn.innerHTML = originalText;
        trackBtn.disabled = false;
    } catch (error) {
        console.error('Error tracking order:', error);
        showNotification('Error tracking order. Please try again.');
    }
}

function findOrderInLocalStorage(orderId) {
    // Check if user is logged in and has orders
    if (currentUser && currentUser.orders) {
        const userOrder = currentUser.orders.find(order => order.orderId === orderId);
        if (userOrder) {
            return {
                orderId: userOrder.orderId,
                status: userOrder.status || 'pending',
                totalAmount: userOrder.total,
                gameUsername: userOrder.username,
                orderDate: userOrder.timestamp,
                items: userOrder.items || []
            };
        }
    }

    // Check all registered users for the order
    try {
        const users = JSON.parse(localStorage.getItem('triogel-users') || '{}');
        for (const [email, user] of Object.entries(users)) {
            if (user.orders) {
                const foundOrder = user.orders.find(order => order.orderId === orderId);
                if (foundOrder) {
                    return {
                        orderId: foundOrder.orderId,
                        status: foundOrder.status || 'pending',
                        totalAmount: foundOrder.total,
                        gameUsername: foundOrder.gameUsername || user.username,
                        customerEmail: email,
                        orderDate: foundOrder.timestamp,
                        items: foundOrder.items || []
                    };
                }
            }
        }
    } catch (error) {
        console.error('Error searching localStorage:', error);
    }

    return null;
}

function displayOrderTrackingResult(orderData) {
    console.log('Displaying order result:', orderData);
    
    const orderResult = document.getElementById('orderResult');
    const orderStatus = document.getElementById('orderStatus');
    const orderItemsList = document.getElementById('orderItemsList');
    const customerSummary = document.getElementById('customerSummary');

    if (!orderResult || !orderStatus || !orderItemsList || !customerSummary) {
        console.error('Tracking modal elements not found');
        return;
    }

    orderResult.style.display = 'block';

    const status = orderData.status || 'pending';
    const statusIcons = {
        'pending': 'PENDING',
        'processing': 'PROCESSING',
        'completed': 'COMPLETED',
        'cancelled': 'CANCELLED'
    };
    
    orderStatus.innerHTML = `
        <div class="order-status status-${status}">
            ${statusIcons[status] || 'UNKNOWN'} ${status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
        <div style="margin-top: 15px; color: var(--text-secondary);">
            <strong>Order ID:</strong> ${orderData.orderId}<br>
            <strong>Date:</strong> ${new Date(orderData.orderDate).toLocaleDateString()}<br>
            <strong>Total:</strong> ${formatPrice(orderData.totalAmount)}
        </div>
    `;

    if (orderData.items && orderData.items.length > 0) {
        orderItemsList.innerHTML = `
            <h4 style="color: var(--text-primary); margin-bottom: 15px;">Items Ordered:</h4>
            ${orderData.items.map(item => `
                <div class="order-item">
                    <div>
                        <strong>${item.name}</strong><br>
                        <small style="color: var(--text-secondary);">Quantity: ${item.quantity}</small>
                    </div>
                    <div style="text-align: right; color: var(--success-green);">
                        ${formatPrice(item.price * item.quantity)}
                    </div>
                </div>
            `).join('')}
        `;
    } else {
        orderItemsList.innerHTML = '<p style="color: var(--text-secondary);">No item details available</p>';
    }

    const deliveryEstimate = getDeliveryEstimate(status);
    customerSummary.innerHTML = `
        <h4 style="color: var(--text-primary); margin-bottom: 15px;">Delivery Information:</h4>
        <div style="background: var(--card-bg); padding: 20px; border-radius: 15px;">
            <p><strong>Game Username:</strong> ${orderData.gameUsername || 'N/A'}</p>
            ${orderData.customerEmail ? `<p><strong>Email:</strong> ${orderData.customerEmail}</p>` : ''}
            <p><strong>Status:</strong> ${getStatusDescription(status)}</p>
            <p><strong>Estimated Delivery:</strong> ${deliveryEstimate}</p>
        </div>
    `;
}

function displayOrderNotFound(orderId) {
    const orderResult = document.getElementById('orderResult');
    const orderStatus = document.getElementById('orderStatus');
    const orderItemsList = document.getElementById('orderItemsList');
    const customerSummary = document.getElementById('customerSummary');

    if (!orderResult) return;

    orderResult.style.display = 'block';

    orderStatus.innerHTML = `
        <div class="order-status status-cancelled">
            ORDER NOT FOUND
        </div>
    `;

    orderItemsList.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
            <h4>Order ${orderId} not found</h4>
            <p style="margin-top: 15px;">Please check your order ID and try again.</p>
            <p style="margin-top: 10px; font-size: 0.9rem;">
                Order IDs start with "TRIO-" and are sent to your email after purchase.
            </p>
        </div>
    `;

    customerSummary.innerHTML = '';
}

function getStatusDescription(status) {
    const descriptions = {
        'pending': 'Order received and awaiting payment verification',
        'processing': 'Payment confirmed, preparing your items for delivery', 
        'completed': 'Items delivered successfully to your game account',
        'cancelled': 'Order has been cancelled or refunded'
    };
    return descriptions[status] || 'Status unknown';
}

function getDeliveryEstimate(status) {
    const estimates = {
        'pending': '1-24 hours after payment',
        'processing': '1-6 hours', 
        'completed': 'Delivered',
        'cancelled': 'N/A'
    };
    return estimates[status] || '1-24 hours';
}

// Additional placeholder functions for dropdown menus
function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        const isOpen = dropdown.style.display === 'block';
        dropdown.style.display = isOpen ? 'none' : 'block';
    }
}

function closeUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.style.display = 'none';
    }
}

function openProfileModal() {
    closeUserDropdown();
    showNotification('Profile settings coming soon!');
}

function openOrderHistoryModal() {
    closeUserDropdown();
    
    if (!currentUser || !currentUser.orders || currentUser.orders.length === 0) {
        showNotification('No orders found. Start shopping!');
        return;
    }

    // Create and show order history modal
    let modal = document.getElementById('orderHistoryModal');
    if (!modal) {
        // Create modal if it doesn't exist
        modal = document.createElement('div');
        modal.id = 'orderHistoryModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="closeOrderHistoryModal()">X</span>
                <h2>Order History</h2>
                <div class="order-history-filters">
                    <button class="filter-btn active" onclick="filterOrderHistory('all')">All Orders</button>
                    <button class="filter-btn" onclick="filterOrderHistory('pending')">Pending</button>
                    <button class="filter-btn" onclick="filterOrderHistory('completed')">Completed</button>
                    <button class="filter-btn" onclick="filterOrderHistory('cancelled')">Cancelled</button>
                </div>
                <div id="orderHistoryList"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    modal.style.display = 'block';
    displayOrderHistory('all');
}

function closeOrderHistoryModal() {
    const modal = document.getElementById('orderHistoryModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function filterOrderHistory(status) {
    // Update active filter button
    const filterBtns = document.querySelectorAll('#orderHistoryModal .filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    displayOrderHistory(status);
}

function displayOrderHistory(filterStatus = 'all') {
    const orderHistoryList = document.getElementById('orderHistoryList');
    if (!orderHistoryList || !currentUser || !currentUser.orders) {
        return;
    }

    let orders = currentUser.orders;
    
    // Filter orders by status
    if (filterStatus !== 'all') {
        orders = orders.filter(order => (order.status || 'pending') === filterStatus);
    }

    if (orders.length === 0) {
        orderHistoryList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                <h3>No ${filterStatus === 'all' ? '' : filterStatus} orders found</h3>
                <p>Your ${filterStatus === 'all' ? 'order history' : filterStatus + ' orders'} will appear here.</p>
            </div>
        `;
        return;
    }

    // Sort orders by date (newest first)
    orders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    orderHistoryList.innerHTML = orders.map(order => {
        const status = order.status || 'pending';
        const statusColors = {
            'pending': '#f59e0b',
            'processing': '#3b82f6', 
            'completed': '#10b981',
            'cancelled': '#ef4444'
        };
        
        const totalItems = order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
        
        return `
            <div class="order-history-item" style="
                background: var(--card-bg);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 15px;
                padding: 20px;
                margin-bottom: 15px;
                transition: all 0.3s ease;
            ">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                    <div>
                        <h4 style="color: var(--text-primary); margin: 0; font-size: 1.1rem;">
                            Order ${order.orderId}
                        </h4>
                        <p style="color: var(--text-secondary); margin: 5px 0; font-size: 0.9rem;">
                            ${new Date(order.timestamp).toLocaleDateString()} at ${new Date(order.timestamp).toLocaleTimeString()}
                        </p>
                    </div>
                    <div style="
                        background: ${statusColors[status] || '#6b7280'};
                        color: white;
                        padding: 5px 15px;
                        border-radius: 20px;
                        font-size: 0.8rem;
                        font-weight: 600;
                        text-transform: uppercase;
                    ">
                        ${status}
                    </div>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div>
                        <span style="color: var(--text-secondary); font-size: 0.9rem;">Items: ${totalItems}</span>
                        <span style="margin-left: 20px; color: var(--text-secondary); font-size: 0.9rem;">
                            Game: ${order.username || 'N/A'}
                        </span>
                    </div>
                    <div style="color: var(--success-green); font-weight: 700; font-size: 1.2rem;">
                        ${formatPrice(order.total)}
                    </div>
                </div>

                ${order.items && order.items.length > 0 ? `
                    <div style="margin-bottom: 15px;">
                        <strong style="color: var(--text-primary); font-size: 0.9rem;">Items:</strong>
                        <div style="margin-top: 8px;">
                            ${order.items.map(item => `
                                <div style="
                                    display: flex; 
                                    justify-content: space-between; 
                                    padding: 5px 0;
                                    color: var(--text-secondary);
                                    font-size: 0.85rem;
                                ">
                                    <span>${item.name} x${item.quantity}</span>
                                    <span>${formatPrice(item.price * item.quantity)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    <button 
                        onclick="trackSpecificOrder('${order.orderId}')" 
                        style="
                            background: var(--primary-gradient);
                            color: white;
                            border: none;
                            padding: 8px 15px;
                            border-radius: 8px;
                            font-size: 0.85rem;
                            cursor: pointer;
                            transition: all 0.3s ease;
                        "
                    >
                        Track Order
                    </button>
                    ${order.items && order.items.length > 0 ? `
                        <button 
                            onclick="reorderItems('${order.orderId}')" 
                            style="
                                background: transparent;
                                color: var(--success-green);
                                border: 1px solid var(--success-green);
                                padding: 8px 15px;
                                border-radius: 8px;
                                font-size: 0.85rem;
                                cursor: pointer;
                                transition: all 0.3s ease;
                            "
                        >
                            Reorder
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

function trackSpecificOrder(orderId) {
    closeOrderHistoryModal();
    openOrderTracking();
    document.getElementById('orderId').value = orderId;
    // Auto-submit the tracking form
    setTimeout(() => {
        trackOrderById(orderId);
    }, 100);
}

function reorderItems(orderId) {
    if (!currentUser || !currentUser.orders) {
        showNotification('Order not found');
        return;
    }

    const order = currentUser.orders.find(o => o.orderId === orderId);
    if (!order || !order.items) {
        showNotification('Order items not found');
        return;
    }

    // Add all items from the order to cart
    let addedCount = 0;
    order.items.forEach(orderItem => {
        const currentItem = items.find(item => item.id === orderItem.id);
        if (currentItem) {
            const existingCartItem = cart.find(cartItem => cartItem.id === orderItem.id);
            if (existingCartItem) {
                existingCartItem.quantity += orderItem.quantity;
            } else {
                cart.push({ ...currentItem, quantity: orderItem.quantity });
            }
            addedCount++;
        }
    });

    updateCartCount();
    closeOrderHistoryModal();
    
    if (addedCount > 0) {
        showNotification(`${addedCount} items added to cart from order ${orderId}`);
    } else {
        showNotification('No items could be added to cart (items may no longer be available)');
    }
}
 
// Checkout functions
window.proceedToCheckout = proceedToCheckout;
window.closeCheckout = closeCheckout;

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
    }, 500);
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