// TRIOGEL JavaScript - Extracted from index.html
console.log('?? Loading TRIOGEL JavaScript...');

// Currency configuration for international customers
const currencies = {
    'PHP': { symbol: '?', name: 'Philippine Peso', rate: 1.0, fallback: 'PHP' },
    'USD': { symbol: '$', name: 'US Dollar', rate: 0.018, fallback: 'USD' },
    'EUR': { symbol: '€', name: 'Euro', rate: 0.016, fallback: 'EUR' },
    'GBP': { symbol: '£', name: 'British Pound', rate: 0.014, fallback: 'GBP' },
    'JPY': { symbol: '¥', name: 'Japanese Yen', rate: 2.65, fallback: 'JPY' },
    'KRW': { symbol: '?', name: 'Korean Won', rate: 23.5, fallback: 'KRW' },
    'SGD': { symbol: 'S$', name: 'Singapore Dollar', rate: 0.024, fallback: 'SGD' },
    'MYR': { symbol: 'RM', name: 'Malaysian Ringgit', rate: 0.082, fallback: 'MYR' },
    'THB': { symbol: '?', name: 'Thai Baht', rate: 0.63, fallback: 'THB' },
    'VND': { symbol: '?', name: 'Vietnamese Dong', rate: 440, fallback: 'VND' }
};

let selectedCurrency = 'PHP'; // Default to Philippine Peso

// TRIOGEL Items Database - Mobile Legends & Roblox (PHP Prices)
const items = [
    // Mobile Legends Items
    {
        id: 1,
        name: "Legendary Skin Bundle",
        game: "ml",
        description: "Premium legendary skin collection with special effects and voice lines. Includes 5 top-tier skins.",
        price: 4949.45,
        emoji: "?",
        rarity: "legendary",
        stats: { skins: "5", effects: "Special", voice: "Yes" }
    },
    {
        id: 2,
        name: "Epic Skin - Fanny",
        game: "ml",
        description: "Fanny's epic skin with enhanced animations and unique recall effects.",
        price: 1924.45,
        emoji: "??",
        rarity: "epic",
        stats: { hero: "Fanny", type: "Epic", recall: "Custom" }
    },
    {
        id: 3,
        name: "Starlight Pass (Season)",
        game: "ml",
        description: "Full season Starlight Pass with exclusive rewards and premium benefits.",
        price: 714.45,
        emoji: "?",
        rarity: "rare",
        stats: { duration: "1 Month", rewards: "Premium", exp: "+50%" }
    },
    {
        id: 4,
        name: "Diamonds - 2000 Pack",
        game: "ml",
        description: "2000 Mobile Legends diamonds for skins, heroes, and premium items.",
        price: 2749.45,
        emoji: "??",
        rarity: "common",
        stats: { amount: "2000", bonus: "+200", instant: "Yes" }
    },
    {
        id: 5,
        name: "MLBB Account (Mythic)",
        game: "ml",
        description: "High-rank Mythic account with 50+ heroes and 20+ skins. Hand-leveled.",
        price: 10999.45,
        emoji: "??",
        rarity: "legendary",
        stats: { rank: "Mythic", heroes: "50+", skins: "20+" }
    },
    // Roblox Items
    {
        id: 6,
        name: "Dominus Crown",
        game: "roblox",
        description: "Legendary Dominus hat showing ultimate status. Rare and prestigious item.",
        price: 16499.45,
        emoji: "??",
        rarity: "legendary",
        stats: { type: "Hat", rarity: "Ultra Rare", status: "VIP" }
    },
    {
        id: 7,
        name: "Robux - 10,000 Pack",
        game: "roblox",
        description: "10,000 Robux currency for purchasing items, game passes, and premium content.",
        price: 5499.45,
        emoji: "??",
        rarity: "common",
        stats: { amount: "10,000", bonus: "+1000", delivery: "Instant" }
    },
    {
        id: 8,
        name: "Roblox Premium Account",
        game: "roblox",
        description: "High-level Roblox account with rare items, limiteds, and premium accessories.",
        price: 8249.45,
        emoji: "??",
        rarity: "epic",
        stats: { level: "High", limiteds: "Yes", premium: "Active" }
    },
    {
        id: 9,
        name: "Golden Wings Package",
        game: "roblox",
        description: "Exclusive golden wings accessory with sparkling effects. Limited edition item.",
        price: 4399.45,
        emoji: "???",
        rarity: "rare",
        stats: { color: "Golden", effects: "Sparkle", edition: "Limited" }
    },
    {
        id: 10,
        name: "Pet Collection Bundle",
        game: "roblox",
        description: "Collection of 10 rare pets including legendary and mythical variants.",
        price: 3299.45,
        emoji: "??",
        rarity: "epic",
        stats: { pets: "10", legendary: "3", mythical: "2" }
    },
    // Test item for GCash (?1)
    {
        id: 11,
        name: "Test GCash Payment",
        game: "ml",
        description: "?1 test item to verify GCash payment integration is working correctly.",
        price: 1,
        emoji: "??",
        rarity: "common",
        stats: { purpose: "Testing", amount: "?1", payment: "GCash" }
    }
];

const gameNames = {
    'ml': 'Mobile Legends: Bang Bang',
    'roblox': 'Roblox'
};

let cart = [];
let currentFilter = 'all';

// Currency conversion functions
function convertPrice(priceInPHP, targetCurrency = selectedCurrency) {
    if (targetCurrency === 'PHP') return priceInPHP;
    
    const rate = currencies[targetCurrency]?.rate || 1;
    return priceInPHP * rate;
}

function formatPrice(priceInPHP, targetCurrency = selectedCurrency) {
    const convertedPrice = convertPrice(priceInPHP, targetCurrency);
    const currencyConfig = currencies[targetCurrency];
    
    if (!currencyConfig) {
        console.warn('?? Unknown currency:', targetCurrency);
        return `?${priceInPHP.toLocaleString('en-PH', {minimumFractionDigits: 2})}`;
    }
    
    // Use simple string concatenation instead of HTML for better compatibility
    let formattedAmount;
    
    // Special formatting for different currencies
    if (targetCurrency === 'JPY' || targetCurrency === 'KRW' || targetCurrency === 'VND') {
        // No decimal places for these currencies
        formattedAmount = Math.round(convertedPrice).toLocaleString();
    } else {
        formattedAmount = convertedPrice.toLocaleString('en-US', {minimumFractionDigits: 2});
    }
    
    // Return plain text instead of HTML
    return `${currencyConfig.symbol}${formattedAmount}`;
}

function setCurrency(currencyCode) {
    console.log('?? Changing currency to:', currencyCode);
    selectedCurrency = currencyCode;
    
    // Update currency selector display
    updateCurrencySelector();
    
    // Refresh item displays with new currency
    displayItems();
    
    // Update cart if open
    if (document.getElementById('cartModal').style.display === 'block') {
        displayCartItems();
    }
    
    // Show notification
    const currencyName = currencies[currencyCode]?.name || currencyCode;
    showNotification(`?? Currency changed to ${currencyName}`);
    
    // Save preference to localStorage
    localStorage.setItem('triogel-currency', currencyCode);
}

function updateCurrencySelector() {
    const selectedOption = document.getElementById('selectedCurrency');
    
    if (selectedOption) {
        const currencyConfig = currencies[selectedCurrency];
        // Use plain text instead of HTML
        selectedOption.textContent = `${currencyConfig.symbol} ${selectedCurrency}`;
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
    
    // Create currency dropdown HTML
    const currencyDropdown = document.getElementById('currencyDropdown');
    if (currencyDropdown) {
        currencyDropdown.innerHTML = Object.entries(currencies).map(([code, config]) => `
            <div class="currency-option" data-currency="${code}">
                <span class="currency-symbol">${config.symbol}</span>
                <span class="currency-code">${code}</span>
                <span class="currency-name">${config.name}</span>
            </div>
        `).join('');
        
        // Add click handlers for currency options
        currencyDropdown.addEventListener('click', (e) => {
            const option = e.target.closest('.currency-option');
            if (option) {
                const currency = option.dataset.currency;
                setCurrency(currency);
                toggleCurrencySelector();
            }
        });
    }
}

function init() {
    console.log('?? TRIOGEL Initializing...');
    
    // Load saved currency preference
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

// Test emoji support and provide fallbacks
function testEmojiSupport() {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d');
    
    ctx.textBaseline = 'top';
    ctx.font = '32px Arial';
    ctx.fillText('??', 0, 0);
    
    return ctx.getImageData(0, 0, 1, 1).data[3] > 0;
}

// Enhanced items array with fallback images
const itemFallbacks = {
    1: { emoji: "?", fallback: "?", text: "SKIN" },
    2: { emoji: "??", fallback: "?", text: "EPIC" },
    3: { emoji: "?", fallback: "?", text: "STAR" },
    4: { emoji: "??", fallback: "?", text: "GEM" },
    5: { emoji: "??", fallback: "?", text: "RANK" },
    6: { emoji: "??", fallback: "?", text: "CROWN" },
    7: { emoji: "??", fallback: "§", text: "ROBUX" },
    8: { emoji: "??", fallback: "?", text: "GAME" },
    9: { emoji: "???", fallback: "?", text: "WING" },
    10: { emoji: "??", fallback: "?", text: "PET" },
    11: { emoji: "??", fallback: "?", text: "TEST" }
};

function getItemEmoji(itemId, originalEmoji) {
    const hasEmojiSupport = testEmojiSupport();
    const fallback = itemFallbacks[itemId];
    
    if (!hasEmojiSupport && fallback) {
        return fallback.fallback;
    }
    
    return originalEmoji;
}

function displayItems() {
    console.log('?? Displaying items for filter:', currentFilter);
    const grid = document.getElementById('itemsGrid');
    if (!grid) {
        console.error('? Items grid element not found!');
        return;
    }
    
    const filteredItems = currentFilter === 'all'
        ? items
        : items.filter(item => item.game === currentFilter);

    console.log('?? Items to display:', filteredItems.length);

    grid.innerHTML = filteredItems.map(item => {
        // Use fallback emoji if needed
        const displayEmoji = getItemEmoji(item.id, item.emoji);
        const emojiElement = `<div class="item-emoji">${displayEmoji}</div>`;
        
        return `
        <div class="item-card ${item.game}-item" data-game="${item.game}">
            <div class="item-header">
                <div class="game-tag ${item.game}-tag">${gameNames[item.game]}</div>
                <div class="rarity-badge rarity-${item.rarity}">${item.rarity}</div>
            </div>
            <div class="item-image ${item.game}-bg">${emojiElement}</div>
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
            <button class="add-to-cart-btn" onclick="addToCart(${item.id})">
                Add to Cart
            </button>
        </div>
    `;
    }).join('');
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

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartCount();
    displayCartItems();
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = count;
    }
}

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

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    document.getElementById('cartModal').style.display = 'none';
    document.getElementById('checkoutModal').style.display = 'block';
    displayOrderSummary();
    
    // Update currency display in checkout form
    const currencyDisplay = document.getElementById('selectedCurrencyDisplay');
    if (currencyDisplay) {
        const currencyConfig = currencies[selectedCurrency];
        currencyDisplay.value = `${currencyConfig.symbol} ${selectedCurrency} - ${currencyConfig.name}`;
    }
}

function closeCheckout() {
    document.getElementById('checkoutModal').style.display = 'none';
}

function displayOrderSummary() {
    const summaryDiv = document.getElementById('orderSummary');
    if (!summaryDiv) {
        console.error('? Order summary element not found');
        return;
    }
    
    const totalInPHP = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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

function showOrderSuccess(orderData) {
    const checkoutContent = document.getElementById('checkoutContent');
    if (!checkoutContent) {
        console.error('? Checkout content element not found');
        return;
    }
    
    checkoutContent.innerHTML = `
        <div class="success-message">
            <h3 style="margin-bottom: 20px; font-size: 2rem;">?? Order Confirmed!</h3>
            <p style="font-size: 1.2rem; margin-bottom: 15px;">Thank you for your purchase!</p>
            <p style="margin-bottom: 20px;">Order ID: <strong>${orderData.orderId}</strong></p>
            <p style="margin-bottom: 20px;">We've received your order and will contact you within 24 hours via email.</p>
            <p style="font-size: 0.9rem; opacity: 0.8;">A confirmation will be sent to ${orderData.customer.email}</p>
        </div>
        <div style="text-align: center; margin-top: 30px;">
            <button class="checkout-btn" onclick="closeCheckout(); location.reload();">Continue Shopping</button>
        </div>
    `;
}

function showOwnerNotification(orderData) {
    const notification = document.getElementById('ownerNotification');
    if (!notification) {
        console.error('? Owner notification element not found');
        return;
    }
    
    const totalInPHP = orderData.total;
    notification.innerHTML = `
        ?? New TRIOGEL Order!<br>
        <small>Order: ${orderData.orderId} - ${formatPrice(totalInPHP)}</small>
    `;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 10000);
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

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ORDER TRACKING FUNCTIONS
function openOrderTracking() {
    document.getElementById('orderTrackingModal').style.display = 'block';
    document.getElementById('orderId').value = '';
    document.getElementById('orderResult').style.display = 'none';
}

function closeOrderTracking() {
    document.getElementById('orderTrackingModal').style.display = 'none';
}

// Email function to replace WhatsApp
function composeEmail(reference, customerEmail) {
    const subject = `TRIOGEL Order Payment Proof - ${reference}`;
    const body = `Hi TRIOGEL Support,

I've placed an order with reference: ${reference}

I have completed the GCash payment and am attaching the screenshot as proof.

Please process my order and deliver my gaming items.

Customer Email: ${customerEmail}

Thank you!`;

    const mailtoUrl = `mailto:${customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
}

// Helper function for copying GCash payment info
function copyGCashInfo(gcashNumber, amount, reference) {
    const paymentInfo = `GCash Payment Info:
Amount: ?${amount}
Send to: ${gcashNumber}
Reference: ${reference}`;
    
    navigator.clipboard.writeText(paymentInfo).then(() => {
        showNotification('?? Payment info copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = paymentInfo;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('?? Payment info copied!');
    });
}

// Close modals when clicking outside
window.addEventListener('click', function (e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
    
    // Close currency selector when clicking outside
    if (!e.target.closest('#currencySelector') && !e.target.closest('#currencyDropdown')) {
        const dropdown = document.getElementById('currencyDropdown');
        const selector = document.getElementById('currencySelector');
        if (dropdown && selector) {
            dropdown.style.display = 'none';
            selector.classList.remove('active');
        }
    }
});

// PROPERLY INITIALIZE EVERYTHING WHEN DOM IS READY
document.addEventListener('DOMContentLoaded', function () {
    console.log('?? DOM Content Loaded - Starting TRIOGEL...');

    // Initialize the site
    init();

    // Set up the checkout form handler
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            console.log('?? Starting checkout process...');

            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="loading"></span> Processing...';
            submitBtn.disabled = true;

            // Calculate total in PHP for backend processing
            const totalInPHP = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            // Collect form data
            const orderData = {
                orderId: 'TRIO-' + Date.now(),
                timestamp: new Date().toISOString(),
                customer: {
                    gameUsername: document.getElementById('gameUsername').value,
                    email: document.getElementById('email').value,
                    whatsappNumber: document.getElementById('whatsappNumber').value,
                    serverRegion: document.getElementById('serverRegion').value
                },
                paymentMethod: document.getElementById('paymentMethod').value,
                customerNotes: document.getElementById('customerNotes').value,
                items: cart,
                total: totalInPHP, // Always send PHP amount to backend
                currency: selectedCurrency, // Include selected currency for reference
                displayTotal: formatPrice(totalInPHP) // Formatted display price
            };

            console.log('?? Order data prepared:', orderData);

            try {
                console.log('?? Sending to Netlify function...');
                const response = await fetch('/.netlify/functions/process-order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData)
                });

                if (response.ok) {
                    const responseData = await response.json();
                    console.log('? Order processed successfully');

                    // Handle GCash payment instructions (Email-based)
                    if (orderData.paymentMethod === 'gcash' && responseData.paymentResult?.success) {
                        console.log('?? Showing GCash payment instructions...');
                        
                        const checkoutContent = document.getElementById('checkoutContent');
                        if (checkoutContent) {
                            checkoutContent.innerHTML = `
                                <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 40px; border-radius: 25px; text-align: center; margin: 30px 0; box-shadow: 0 15px 40px rgba(16, 185, 129, 0.3);">
                                    <div style="background: white; color: #10b981; padding: 15px 25px; border-radius: 50px; display: inline-block; font-weight: 900; font-size: 1.1rem; margin-bottom: 20px;">
                                        ?? GCash Payment Instructions
                                    </div>
                                    
                                    <h3 style="margin-bottom: 15px; font-size: 1.4rem; opacity: 0.95;">Your order has been created!</h3>
                                    <p style="margin-bottom: 25px; font-size: 1.1rem; opacity: 0.9;">Order ID: <strong>${orderData.orderId}</strong></p>
                                    
                                    <div style="background: rgba(255, 255, 255, 0.15); border-radius: 20px; padding: 30px; margin: 25px 0; backdrop-filter: blur(10px);">
                                        <h4 style="color: #ffffff; margin-bottom: 20px; font-size: 1.2rem;">?? Send GCash Payment To:</h4>
                                        
                                        <div style="background: rgba(255, 255, 255, 0.9); color: #059669; padding: 20px; border-radius: 15px; margin-bottom: 15px;">
                                            <div style="font-size: 1.8rem; font-weight: 900; margin-bottom: 8px;">
                                                ?${responseData.paymentResult.amount_php}
                                            </div>
                                            <div style="font-size: 0.9rem; opacity: 0.7; text-transform: uppercase; font-weight: 600;">Amount to Send (PHP)</div>
                                            ${selectedCurrency !== 'PHP' ? `
                                                <div style="font-size: 1rem; margin-top: 8px; opacity: 0.8;">
                                                    ? ${formatPrice(totalInPHP)} (${currencies[selectedCurrency].name})
                                                </div>
                                            ` : ''}
                                        </div>
                                        
                                        <div style="background: rgba(255, 255, 255, 0.9); color: #059669; padding: 20px; border-radius: 15px; margin-bottom: 15px;">
                                            <div style="font-size: 1.4rem; font-weight: 800; margin-bottom: 8px;">
                                                ${responseData.paymentResult.gcash_number}
                                            </div>
                                            <div style="font-size: 0.9rem; opacity: 0.7; text-transform: uppercase; font-weight: 600;">GCash Number</div>
                                        </div>
                                        
                                        <div style="background: rgba(255, 255, 255, 0.9); color: #059669; padding: 20px; border-radius: 15px; margin-bottom: 15px;">
                                            <div style="font-size: 1.2rem; font-weight: 700; margin-bottom: 8px;">
                                                ${responseData.paymentResult.gcash_name}
                                            </div>
                                            <div style="font-size: 0.9rem; opacity: 0.7; text-transform: uppercase; font-weight: 600;">Account Name</div>
                                        </div>
                                        
                                        <div style="background: rgba(255, 255, 255, 0.9); color: #059669; padding: 20px; border-radius: 15px; margin-bottom: 15px;">
                                            <div style="font-size: 1rem; font-weight: 700; margin-bottom: 8px; word-break: break-all;">
                                                ${responseData.paymentResult.reference}
                                            </div>
                                            <div style="font-size: 0.9rem; opacity: 0.7; text-transform: uppercase; font-weight: 600;">Reference Number</div>
                                        </div>
                                    </div>
                                    
                                    <div style="background: rgba(255, 193, 7, 0.2); border: 2px solid #ffc107; border-radius: 15px; padding: 20px; margin: 25px 0;">
                                        <h4 style="color: #ffc107; margin-bottom: 15px; font-size: 1.1rem;">?? Payment Steps:</h4>
                                        <div style="text-align: left; color: white;">
                                            <div style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                                                <div style="background: #ffc107; color: #0a0a1a; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.8rem; margin-right: 15px; flex-shrink: 0;">1</div>
                                                <div>Send <strong>?${responseData.paymentResult.amount_php}</strong> to GCash <strong>${responseData.paymentResult.gcash_number}</strong></div>
                                            </div>
                                            <div style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                                                <div style="background: #ffc107; color: #0a0a1a; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.8rem; margin-right: 15px; flex-shrink: 0;">2</div>
                                                <div>Include reference <strong>${responseData.paymentResult.reference}</strong> in message</div>
                                            </div>
                                            <div style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                                                <div style="background: #ffc107; color: #0a0a1a; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.8rem; margin-right: 15px; flex-shrink: 0;">3</div>
                                                <div>Take <strong>screenshot</strong> of successful payment</div>
                                            </div>
                                            <div style="display: flex; align-items: flex-start; margin-bottom: 12px;">
                                                <div style="background: #ffc107; color: #0a0a1a; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.8rem; margin-right: 15px; flex-shrink: 0;">4</div>
                                                <div><strong>Email</strong> payment screenshot to <strong>${orderData.customer.email}</strong></div>
                                            </div>
                                            <div style="display: flex; align-items: flex-start;">
                                                <div style="background: #ffc107; color: #0a0a1a; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.8rem; margin-right: 15px; flex-shrink: 0;">5</div>
                                                <div>We'll reply to your email within <strong>1-24 hours</strong> and deliver your items</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div style="margin-top: 30px;">
                                        <p style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 20px;">
                                            Order confirmation sent to ${orderData.customer.email}
                                        </p>
                                        
                                        <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                                            <button class="checkout-btn" onclick="copyGCashInfo('${responseData.paymentResult.gcash_number}', '${responseData.paymentResult.amount_php}', '${responseData.paymentResult.reference}')" 
                                                style="background: linear-gradient(45deg, #667eea, #764ba2); flex: 1; min-width: 200px; margin: 0;">
                                                ?? Copy Payment Info
                                            </button>
                                            <button class="checkout-btn" onclick="composeEmail('${responseData.paymentResult.reference}', '${orderData.customer.email}')" 
                                                style="background: #0ea5e9; flex: 1; min-width: 200px; margin: 0;">
                                                ?? Open Email
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div style="text-align: center; margin-top: 30px;">
                                    <button class="checkout-btn" onclick="closeCheckout(); location.reload();" style="background: var(--ml-gradient);">Continue Shopping</button>
                                </div>
                            `;
                        }
                        
                        cart = [];
                        updateCartCount();
                        showOwnerNotification(orderData);
                        
                    } else {
                        // Regular order success (non-GCash)
                        showOrderSuccess(orderData);
                        showOwnerNotification(orderData);
                        cart = [];
                        updateCartCount();
                    }
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error('?? Order submission failed:', error);
                showOrderSuccess(orderData);
                showOwnerNotification(orderData);
                cart = [];
                updateCartCount();
            } finally {
                // Restore button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    } else {
        console.error('? Checkout form not found!');
    }
    
    // Add validation logging
    console.log('?? Running TRIOGEL validation...');
    
    // Check required elements
    const requiredElements = ['itemsGrid', 'cartCount', 'currencySelector'];
    let allElementsFound = true;
    
    requiredElements.forEach(id => {
        if (!document.getElementById(id)) {
            console.error(`? Missing element: ${id}`);
            allElementsFound = false;
        }
    });
    
    // Check required functions
    const requiredFunctions = ['init', 'addToCart', 'setCurrency'];
    requiredFunctions.forEach(func => {
        if (typeof window[func] !== 'function') {
            console.error(`? Missing function: ${func}`);
            allElementsFound = false;
        }
    });
    
    if (allElementsFound) {
        console.log('? All TRIOGEL components validated successfully!');
    } else {
        console.warn('?? Some TRIOGEL components missing - check console for details');
    }
});

// Make functions globally accessible for onclick handlers
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.proceedToCheckout = proceedToCheckout;
window.closeCheckout = closeCheckout;
window.openOrderTracking = openOrderTracking;
window.closeOrderTracking = closeOrderTracking;
window.toggleCurrencySelector = toggleCurrencySelector;
window.setCurrency = setCurrency;
window.copyGCashInfo = copyGCashInfo;
window.composeEmail = composeEmail;

console.log('? TRIOGEL JavaScript loaded successfully!');