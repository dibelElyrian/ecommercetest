# GitHub Copilot Instructions for TRIOGEL E-commerce

## Project Overview
TRIOGEL: Premium gaming items marketplace (Mobile Legends & Roblox). Modern responsive e-commerce site.

**Tech Stack**: HTML5, CSS3, Vanilla JS, Netlify Functions, GCash/PayPal payments

**Project Type**: Static HTML website (no build system required)

## Project Structure & Build Information

### File Architecture
```
ecommercesite/
??? index.html                  (Main HTML file - 168 lines max)
??? assets/
?   ??? css/
?   ?   ??? main.css           (All styles)
?   ??? js/
?       ??? main.js            (All JavaScript)
??? .github/
?   ??? copilot-instructions.md (This file)
??? netlify/
    ??? functions/             (Serverless functions)
        ??? process-order.js   (Order processing)
```

### Build System Notes (IMPORTANT)
- **No Build Required**: This is a static HTML project with no build system (no package.json, webpack, etc.)
- **No npm/yarn**: Project uses vanilla HTML/CSS/JS without Node.js dependencies
- **Direct File Serving**: Files are served directly by web server (Netlify, Apache, nginx)
- **Testing Method**: Open index.html directly in browser or use live server
- **Error Checking**: Validate through browser console and HTML/CSS validators

### Development Workflow
1. **Edit Files Directly**: Modify HTML, CSS, JS files directly
2. **Browser Testing**: Open index.html in browser to test changes
3. **Console Validation**: Check browser developer tools for errors
4. **Live Server**: Use VS Code Live Server extension for development
5. **Netlify Deploy**: Push to Git repository for automatic deployment

### Error Validation Methods (Use Instead of Build)
```javascript
// Browser console validation
console.log('? TRIOGEL loaded successfully!');

// Manual error checks
if (typeof items === 'undefined') {
    console.error('? Items array not loaded');
}

// DOM validation
document.addEventListener('DOMContentLoaded', function() {
    const requiredElements = ['itemsGrid', 'cartCount', 'currencySelector'];
    requiredElements.forEach(id => {
        if (!document.getElementById(id)) {
            console.error(`? Missing element: ${id}`);
        }
    });
});
```

## Code Style Standards (MANDATORY)

### HTML Structure
- Semantic HTML5 elements (`<section>`, `<article>`, `<header>`, `<footer>`)
- BEM-like class naming: `.item-card`, `.game-filter`, `.checkout-btn`
- Mobile-first responsive design with proper viewport meta
- Meaningful IDs and classes for JavaScript interaction
- 4-space indentation consistently

### CSS Standards
- **CSS Custom Properties**: Always use variables from `:root`
- **Naming Convention**: kebab-case with descriptive names
- **Responsive Design**: Mobile-first with `@media (max-width: 768px)`
- **Animations**: Smooth transitions (0.3s ease) with hover effects
- **Gradients**: Use predefined gradient variables
- **Z-index Management**: Modals (1000+), notifications (2000+), overlays (3000+)

### CSS Variables (REQUIRED - Use These)
```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    --ml-gradient: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    --roblox-gradient: linear-gradient(135deg, #00d4ff 0%, #090979 100%);
    --dark-bg: #0a0a1a;
    --card-bg: rgba(255, 255, 255, 0.08);
    --text-primary: #ffffff;
    --text-secondary: rgba(255, 255, 255, 0.7);
    --success-green: #00ff88;
    --roblox-red: #ff3333;
}
```

### JavaScript Standards
- **ES6+ Syntax**: const/let, arrow functions, template literals, async/await
- **Error Handling**: Every async function wrapped in try/catch
- **Console Logging**: Emoji-based logging system
- **Function Naming**: Descriptive camelCase names
- **Event Handling**: Proper event listener cleanup and delegation
- **Data Management**: Immutable state patterns where possible

### JavaScript Patterns (ENFORCE)

#### Console Logging Standard
```javascript
console.log('?? Processing...');  // Loading/Processing
console.log('?? Searching...');   // Search operations
console.log('? Success!');       // Success states
console.error('? Error:', err);  // Error states
console.warn('?? Warning!');      // Warnings
console.log('?? Game logic...');  // Gaming-specific
```

#### Error Handling Pattern
```javascript
async function processOrder(orderData) {
    try {
        console.log('?? Processing order...');
        const response = await fetch('/.netlify/functions/process-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        
        if (!response.ok) throw new Error('Network error');
        console.log('? Order processed successfully');
        showNotification('? Order confirmed!');
    } catch (error) {
        console.error('? Order failed:', error);
        showNotification('?? Order failed. Please try again.');
    }
}
```

#### Event Listener Pattern
```javascript
document.addEventListener('DOMContentLoaded', function() {
    console.log('?? DOM loaded - Initializing...');
    init();
    setupEventListeners();
});

function setupEventListeners() {
    // Use delegation for dynamic elements
    document.addEventListener('click', (e) => {
        if (e.target.matches('.add-to-cart-btn')) {
            const itemId = e.target.dataset.itemId;
            addToCart(itemId);
        }
    });
}
```

#### State Management Pattern
```javascript
let cart = [];
const gameNames = {
    'ml': 'Mobile Legends: Bang Bang',
    'roblox': 'Roblox'
};

// Pure functions for state updates
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}
```

## Gaming-Specific Standards

### Currency & Pricing
- **Multi-Currency Support**: PHP (default), USD, EUR, GBP, JPY, KRW, SGD, MYR, THB, VND
- **Price formatting**: Use formatPrice() function with proper currency symbols
- **Payment methods priority**: GCash ? PayPal ? Crypto ? Bank Transfer
- **Currency persistence**: Save selection in localStorage

### Game Classification
```javascript
const gameTypes = {
    'ml': {
        name: 'Mobile Legends: Bang Bang',
        gradient: 'var(--ml-gradient)',
        tag: 'ml-tag'
    },
    'roblox': {
        name: 'Roblox',
        gradient: 'var(--roblox-gradient)', 
        tag: 'roblox-tag'
    }
};
```

### Rarity System (MAINTAIN CONSISTENCY)
- **legendary**: Gold gradient `linear-gradient(45deg, #fbbf24, #f59e0b)`
- **epic**: Purple gradient `linear-gradient(45deg, #8b5cf6, #7c3aed)`
- **rare**: Blue gradient `linear-gradient(45deg, #3b82f6, #2563eb)`
- **common**: Gray gradient `linear-gradient(45deg, #6b7280, #4b5563)`

### Order Management
- **Order ID Format**: `'TRIO-' + Date.now()`
- **Status States**: pending ? processing ? completed / cancelled
- **Required Fields**: gameUsername, email, paymentMethod

## UI/UX Standards

### Button Design Patterns
```css
.primary-btn {
    background: var(--primary-gradient);
    color: white;
    border: none;
    padding: 18px 36px;
    border-radius: 50px;
    font-weight: 800;
    text-transform: uppercase;
    transition: all 0.3s ease;
    cursor: pointer;
}

.primary-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
}
```

### Card Component Pattern
```css
.item-card {
    background: var(--card-bg);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}
```

### Animation Standards
- **Hover Effects**: `transform: translateY(-3px)` + appropriate box-shadow
- **Loading States**: CSS spinner with `animation: spin 1s ease-in-out infinite`
- **Transitions**: Use `0.3s ease` for most interactions
- **Entrance Animations**: `slideInRight`, `fadeIn` for notifications

## File Organization (ENFORCE)

### Modular Structure
```
index.html          (168 lines max - structure only)
assets/css/main.css (all styles)
assets/js/main.js   (all JavaScript)
.github/copilot-instructions.md (this file)
```

### Component Separation
- **HTML**: Semantic structure, no inline styles/scripts
- **CSS**: Organized by component type (header, cards, modals, footer)
- **JavaScript**: Grouped by functionality (cart, checkout, display, utils)

## Performance Standards

### Loading Optimization
- External CSS/JS files to prevent parsing bottlenecks
- Minimal inline styles (only for dynamic content)
- Efficient DOM queries (cache selectors when reused)
- Event delegation over individual listeners

### Mobile Performance
- Touch-friendly button sizes (min 44px)
- Optimized images and animations for mobile
- Reduced motion preferences respected
- Fast tap response (<300ms)

## Critical Guidelines (NON-NEGOTIABLE)

1. **NO BUILD SYSTEM**: This is a static HTML project - do not attempt npm install, build commands, or add package.json
2. **NEVER regenerate entire files** - Always use targeted edits
3. **Mobile-first responsive design** - Test on mobile viewports
4. **Gaming theme consistency** - Maintain dark aesthetic with neon accents
5. **Comprehensive error handling** - All API calls in try/catch blocks
6. **Emoji console logging** - Use emoji system for all console outputs
7. **CSS variables** - Never use hardcoded colors/gradients
8. **International market focus** - Multi-currency support, global payment methods
9. **Accessibility** - Proper contrast ratios, keyboard navigation support

## Testing & Validation Checklist

### Browser Testing (Instead of Build)
- [ ] Open index.html in browser (no errors in console)
- [ ] Test all JavaScript functions work correctly
- [ ] Verify CSS styles load and render properly
- [ ] Check responsive design (320px - 1400px)
- [ ] Test currency selector functionality
- [ ] Validate cart and checkout flow
- [ ] Verify GCash payment integration
- [ ] Test order tracking system

### Manual Validation Steps
1. **HTML Validation**: Use W3C HTML validator
2. **CSS Validation**: Use W3C CSS validator  
3. **JavaScript Testing**: Check browser console for errors
4. **Mobile Testing**: Use browser dev tools device simulation
5. **Cross-browser Testing**: Test in Chrome, Firefox, Safari, Edge

### Console Validation Pattern
```javascript
// Add this to end of main.js for validation
document.addEventListener('DOMContentLoaded', function() {
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
    }
});
```

**Target Market**: International gamers, mobile-first experience, multi-currency support, global payment methods, gaming item delivery via username/ID