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

## Code Integrity Standards (CRITICAL)

### Code Completion Validation (MANDATORY AFTER EVERY EDIT)
- **Always Check for Truncated Code**: After any code edit, verify that:
  - Functions have complete opening/closing braces `{}`
  - All arrays and objects are properly closed `[]`, `{}`
  - String literals are properly closed with matching quotes
  - No incomplete lines or cut-off statements
  - All imported/referenced files are complete and accessible
  - CSS rules have complete property declarations
  - JavaScript statements end with proper semicolons where required

### Critical Items Loading Validation (MANDATORY AFTER EVERY CHANGE)
**ALWAYS VERIFY THESE AFTER ANY CODE EDIT:**

- **Items Array Integrity**: Verify `items` array is complete and accessible
- **Display Function Completeness**: Check `displayItems()` function is not truncated
- **Grid Element Existence**: Confirm `itemsGrid` element exists in HTML
- **Filter System Integrity**: Verify filter buttons work and don't break item display
- **Currency System Integration**: Ensure currency changes don't break item rendering
- **Authentication Integration**: Verify user login/logout doesn't break item display

### Items Loading Debug Pattern (MANDATORY AFTER EVERY CHANGE)
```javascript
// Add this validation after every code edit
function validateItemsSystem() {
    console.log('?? Validating items system...');
    
    // Check items array
    if (!Array.isArray(items) || items.length === 0) {
        console.error('?? CRITICAL: Items array missing or empty');
        return false;
    }
    
    // Check display function
    if (typeof displayItems !== 'function') {
        console.error('?? CRITICAL: displayItems function missing or incomplete');
        return false;
    }
    
    // Check grid element
    const grid = document.getElementById('itemsGrid');
    if (!grid) {
        console.error('?? CRITICAL: itemsGrid element missing from DOM');
        return false;
    }
    
    // Test item display
    try {
        displayItems();
        const itemCards = grid.querySelectorAll('.item-card');
        if (itemCards.length === 0) {
            console.error('?? CRITICAL: Items not rendering to DOM');
            return false;
        }
        console.log(`? Items system validated: ${itemCards.length} items displayed`);
        return true;
    } catch (error) {
        console.error('?? CRITICAL: Error in displayItems():', error);
        return false;
    }
}

// Call after DOM loaded and after every major change
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (!validateItemsSystem()) {
            console.error('?? ITEMS SYSTEM FAILURE - CHECK CODE IMMEDIATELY');
        }
    }, 100);
});
```

### Currency Dropdown Design Validation (MANDATORY AFTER EVERY CHANGE)
**ALWAYS CHECK THESE AFTER CSS/JS EDITS:**

- **Dropdown Positioning**: Ensure dropdown appears correctly positioned
- **Visual Hierarchy**: Verify currency options are clearly readable
- **Responsive Design**: Check dropdown works on mobile devices
- **Hover States**: Confirm hover effects work properly
- **Z-index Layering**: Ensure dropdown appears above other elements

### File Completeness Verification Pattern
```javascript
// Add at end of every major code section for verification
console.log('?? Code section complete - verifying integrity...');

// Check for common truncation issues
if (typeof functionName === 'undefined') {
    console.error('?? TRUNCATION DETECTED: Function may be incomplete');
}

// Validate critical objects/arrays
if (!Array.isArray(items) || items.length === 0) {
    console.error('?? TRUNCATION DETECTED: Items array incomplete');
}
```

### Pre-Save Validation Checklist (ENFORCE BEFORE EVERY COMMIT)
- [ ] **Items System Check**: Run validateItemsSystem() and confirm it passes
- [ ] **Currency Dropdown Check**: Test currency selector in browser
- [ ] **Syntax Check**: All brackets, braces, and parentheses properly paired
- [ ] **Function Integrity**: Every function has complete body with return/closing
- [ ] **Object/Array Completion**: All data structures properly closed
- [ ] **String/Template Literals**: All quotes and backticks matched
- [ ] **Import/Reference Integrity**: All file references point to complete files
- [ ] **CSS Rule Completion**: All CSS rules have complete property:value pairs
- [ ] **Comment Blocks**: Multi-line comments properly closed

### Truncation Detection Commands (Use These Patterns)
```javascript
// Function completion check
function validateCodeIntegrity() {
    console.log('?? Running code integrity check...');
    
    // Check critical functions exist and are complete
    const criticalFunctions = ['init', 'displayItems', 'addToCart', 'setCurrency', 'setupCurrencySelector'];
    criticalFunctions.forEach(funcName => {
        if (typeof window[funcName] !== 'function') {
            console.error(`?? CRITICAL: ${funcName} function missing or incomplete`);
        }
    });
    
    // Check critical data structures
    if (!Array.isArray(items) || !items.length) {
        console.error('?? CRITICAL: Items array truncated or empty');
    }
    
    if (!currencies || typeof currencies !== 'object') {
        console.error('?? CRITICAL: Currencies object truncated or missing');
    }
    
    // Test items system
    if (!validateItemsSystem()) {
        console.error('?? CRITICAL: Items system failure detected');
    }
    
    console.log('? Code integrity check completed');
}

// Call after every major code change
document.addEventListener('DOMContentLoaded', validateCodeIntegrity);
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
        showNotification('?? Order confirmed!');
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
2. **CODE INTEGRITY FIRST**: Always check for truncated code after every edit - verify complete functions, objects, arrays
3. **ITEMS LOADING MANDATORY CHECK**: After every change, run validateItemsSystem() to ensure items display properly
4. **CURRENCY DROPDOWN VALIDATION**: Always test currency selector functionality after CSS/JS changes
5. **NEVER regenerate entire files** - Always use targeted edits
6. **Mobile-first responsive design** - Test on mobile viewports
7. **Gaming theme consistency** - Maintain dark aesthetic with neon accents
8. **Comprehensive error handling** - All API calls in try/catch blocks
9. **Emoji console logging** - Use emoji system for all console outputs
10. **CSS variables** - Never use hardcoded colors/gradients
11. **International market focus** - Multi-currency support, global payment methods
12. **Accessibility** - Proper contrast ratios, keyboard navigation support

## Testing & Validation Checklist

### Code Integrity Verification (MANDATORY AFTER EVERY CHANGE)
- [ ] **Function Completeness**: All functions have complete bodies with proper closing braces
- [ ] **Object/Array Integrity**: All data structures are complete with no truncated properties
- [ ] **Items System Validation**: Run validateItemsSystem() and confirm it passes
- [ ] **Currency Dropdown Test**: Test currency selector dropdown in browser
- [ ] **String/Template Completeness**: All strings and template literals properly closed
- [ ] **Import/Reference Validation**: All file references point to complete, accessible files
- [ ] **CSS Rule Completeness**: All CSS rules have complete property declarations
- [ ] **Syntax Validation**: No unclosed brackets, braces, or parentheses

### Browser Testing (Instead of Build)
- [ ] Open index.html in browser (no errors in console)
- [ ] **Verify items load and display properly**
- [ ] **Test currency dropdown functionality and design**
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
4. **Items Loading Test**: Refresh page and verify all items appear
5. **Currency Dropdown Test**: Click currency selector and verify dropdown appears correctly
6. **Mobile Testing**: Use browser dev tools device simulation
7. **Cross-browser Testing**: Test in Chrome, Firefox, Safari, Edge

### Console Validation Pattern (Include After Every Major Change)
```javascript
// Add this to end of main.js for validation
document.addEventListener('DOMContentLoaded', function() {
    console.log('?? Running TRIOGEL validation...');
    
    // Check for code completeness first
    validateCodeIntegrity();
    
    // CRITICAL: Validate items system
    setTimeout(() => {
        if (!validateItemsSystem()) {
            console.error('?? CRITICAL FAILURE: Items not loading properly');
            alert('CRITICAL ERROR: Items not loading. Check console for details.');
        }
    }, 500);
    
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
    const requiredFunctions = ['init', 'addToCart', 'setCurrency', 'displayItems'];
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

// MANDATORY ITEMS VALIDATION FUNCTION
function validateItemsSystem() {
    console.log('?? Validating items system...');
    
    // Check items array
    if (!Array.isArray(items) || items.length === 0) {
        console.error('?? CRITICAL: Items array missing or empty');
        return false;
    }
    
    // Check display function
    if (typeof displayItems !== 'function') {
        console.error('?? CRITICAL: displayItems function missing or incomplete');
        return false;
    }
    
    // Check grid element
    const grid = document.getElementById('itemsGrid');
    if (!grid) {
        console.error('?? CRITICAL: itemsGrid element missing from DOM');
        return false;
    }
    
    // Test item display
    try {
        displayItems();
        const itemCards = grid.querySelectorAll('.item-card');
        if (itemCards.length === 0) {
            console.error('?? CRITICAL: Items not rendering to DOM');
            return false;
        }
        console.log(`? Items system validated: ${itemCards.length} items displayed`);
        return true;
    } catch (error) {
        console.error('?? CRITICAL: Error in displayItems():', error);
        return false;
    }
}

function validateCodeIntegrity() {
    console.log('?? Validating code integrity...');
    
    // Critical function existence check
    const criticalFunctions = ['init', 'displayItems', 'addToCart', 'setCurrency', 'showNotification', 'setupCurrencySelector'];
    criticalFunctions.forEach(funcName => {
        if (typeof window[funcName] !== 'function') {
            console.error(`?? CRITICAL TRUNCATION: ${funcName} function missing or incomplete`);
        }
    });
    
    // Data structure integrity check
    if (!Array.isArray(items) || items.length === 0) {
        console.error('?? CRITICAL TRUNCATION: Items array incomplete or empty');
    }
    
    if (!currencies || typeof currencies !== 'object' || Object.keys(currencies).length === 0) {
        console.error('?? CRITICAL TRUNCATION: Currencies object incomplete or missing');
    }
    
    if (!gameNames || typeof gameNames !== 'object') {
        console.error('?? CRITICAL TRUNCATION: GameNames object incomplete or missing');
    }
    
    console.log('? Code integrity validation completed');
}
```

**Target Market**: International gamers, mobile-first experience, multi-currency support, global payment methods, gaming item delivery via username/ID

## CRITICAL RECURRING ISSUES TO PREVENT

### Items Not Loading Issue
**Root Causes & Prevention:**
- **Function Truncation**: Always verify `displayItems()` function is complete
- **Array Corruption**: Ensure `items` array is not truncated or overwritten
- **DOM Element Missing**: Confirm `itemsGrid` element exists in HTML
- **Initialization Order**: Ensure proper function calling sequence in `init()`
- **Event Handler Conflicts**: Avoid duplicate event listeners that might break display

### Currency Dropdown Design Issues
**Root Causes & Prevention:**
- **CSS Rule Truncation**: Verify all currency selector CSS rules are complete
- **Z-index Conflicts**: Ensure dropdown appears above other elements
- **Positioning Issues**: Check dropdown positioning relative to trigger button
- **Responsive Breakpoints**: Test dropdown on all screen sizes
- **JavaScript Integration**: Ensure dropdown logic is not broken by other functions

**MANDATORY AFTER EVERY EDIT: Test these specific issues in browser immediately**