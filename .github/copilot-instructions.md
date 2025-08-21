# GitHub Copilot Instructions for TRIOGEL E-commerce

## Project Overview
**TRIOGEL** is a premium virtual gaming items marketplace specializing in Mobile Legends: Bang Bang and Roblox items. It's a modern, responsive e-commerce platform with comprehensive payment integration, user management, and order processing capabilities.

**Tech Stack**: HTML5, CSS3, Vanilla JavaScript, Netlify Functions, Supabase Database, Discord Integration
**Project Type**: Static HTML website with serverless backend (no local build system)

## ?? **CRITICAL RULE: FUNCTIONALITY FIRST, NO IMAGES/ICONS**

**FOCUS ON CORE FUNCTIONALITY ONLY - NO VISUAL ASSETS YET**

This rule applies to:
- ? **No favicon.ico**: Don't add favicon files (causes 404 errors in console)
- ? **No images**: No product images, logos, or graphics
- ? **No icon fonts**: No Font Awesome, Material Icons, or similar
- ? **No SVGs**: No SVG graphics or icons
- ? **No background images**: Stick to CSS gradients and colors only
- ? **No external assets**: No loading of external image resources

**Why**: Focus on building robust functionality first. Images and visual assets can be distracting, cause 404 errors, slow down development, and aren't needed for core e-commerce functionality.

**Use instead**:
- ? **Text-based icons**: Use simple text like "SKIN", "HERO", "STAR" for item icons
- ? **CSS styling**: Use gradients, colors, and text styling for visual appeal
- ? **Unicode text**: Simple characters like ">" for arrows, "X" for close buttons
- ? **CSS pseudo-elements**: Use ::before and ::after for decorative elements
- ? **Focus on UX**: Perfect the user experience and functionality flow first

**Common 404 errors to ignore for now**:
- `favicon.ico` not found - this is expected and not critical
- Image loading errors - we're not using images yet

## ?? **CRITICAL RULE: NO EMOJIS OR UNICODE SYMBOLS**

**NEVER USE EMOJIS OR SPECIAL UNICODE SYMBOLS IN THIS PROJECT**

This rule applies to:
- ? **Console logs**: No emojis in console.log, console.error messages
- ? **User interface text**: No emojis in buttons, notifications, labels
- ? **Currency symbols**: Use text codes (PHP, USD, EUR) instead of symbols (?, $, €)
- ? **Special characters**: No diamonds ?, multiplication ×, arrows ??, etc.
- ? **HTML content**: No emojis in any HTML elements or attributes
- ? **JavaScript strings**: No emojis in any string literals

**Why**: Emojis and special Unicode symbols cause encoding issues that display as question marks (?) in certain browsers and environments, breaking the user experience.

**Use instead**:
- ? **Text labels**: "PHP" instead of "?", "USD" instead of "$"
- ? **Plain text**: "Order confirmed!" instead of "?? Order confirmed!"
- ? **Simple characters**: "X" instead of "×", ">" instead of "?"

## ?? **CRITICAL RULE: NEVER BREAK THE ITEMS LOADING SYSTEM**

**THE MOST IMPORTANT RULE: Items MUST always load on the website. This is the core functionality.**

### ? **COMMON MISTAKES THAT BREAK ITEM LOADING:**

1. **Function Duplication**: Never duplicate functions like `openOrderHistoryModal()`, `displayItems()`, `init()`, etc.
   - **CRITICAL**: Duplicating ANY function causes JavaScript conflicts and prevents items from loading
   - **Example of duplication that breaks the site**:
     ```javascript
     function init() { ... } // First definition
     // ... other code ...
     function init() { ... } // DUPLICATE - BREAKS EVERYTHING!
     ```

2. **Missing Essential Functions**: Never remove or accidentally delete:
   - `init()` function
   - `displayItems()` function  
   - `setupEventHandlers()` function
   - `validateItemsSystem()` function
   - `proceedToCheckout()` function
   - `closeCheckout()` function
   - `displayOrderSummary()` function

3. **Syntax Errors**: Always double-check for typos like:
   - `foundFound.status` instead of `foundOrder.status`
   - Missing semicolons or brackets
   - Incorrect variable names

4. **Function Order Dependency**: Never move critical functions like `init()` or `setupEventHandlers()` to wrong locations in the file

5. **Missing Checkout Functions**: The `proceedToCheckout()` and `closeCheckout()` functions MUST be defined before the `window.proceedToCheckout` assignment

6. **Adding Code at End of File**: Never add new functions at the very end of main.js after the emergency fallback - this causes duplication

### ?? **EMERGENCY PROCEDURE WHEN ITEMS DON'T LOAD:**

**STEP 1**: Check for duplicate functions immediately:
```bash
# Search for duplicate function definitions
grep -n "^function " assets/js/main.js | sort
```

**STEP 2**: Look for these specific error patterns in console:
- "Function already defined" errors
- "displayItems is not a function"
- "init is not a function"  
- JavaScript syntax errors

**STEP 3**: Recovery actions:
1. Remove ALL duplicate function definitions
2. Ensure there's only ONE definition of each critical function
3. Verify the file ends with the emergency fallback setTimeout
4. Test items loading immediately after any fix

### ? **MANDATORY CHECKS BEFORE ANY CODE CHANGE:**

```javascript
// ALWAYS run this validation after ANY change to main.js:
function criticalSystemCheck() {
    const essentialFunctions = [
        'init', 'displayItems', 'setupEventHandlers', 'validateItemsSystem',
        'proceedToCheckout', 'closeCheckout', 'displayOrderSummary',
        'addToCart', 'updateCartCount', 'formatPrice'
    ];
    
    const missing = essentialFunctions.filter(name => typeof window[name] !== 'function');
    if (missing.length > 0) {
        console.error('CRITICAL ERROR: Missing functions:', missing);
        return false;
    }
    
    // Check items array
    if (!Array.isArray(items) || items.length === 0) {
        console.error('CRITICAL ERROR: Items array missing or empty');
        return false;
    }
    
    // Check DOM elements
    if (!document.getElementById('itemsGrid')) {
        console.error('CRITICAL ERROR: itemsGrid element missing');
        return false;
    }
    
    return true;
}
```

### ?? **RECOVERY PROCESS WHEN ITEMS DON'T LOAD:**

1. **Check browser console** for JavaScript errors
2. **Verify items array** exists and has 11 items
3. **Confirm itemsGrid element** exists in HTML
4. **Test displayItems() function** manually in console
5. **Check for duplicate function definitions**
6. **Verify all essential functions exist**

### ?? **NEVER DO THESE WHEN EDITING MAIN.JS:**

- ? Don't copy/paste large sections without verifying syntax
- ? Don't move functions without understanding dependencies  
- ? Don't duplicate existing functions (causes conflicts)
- ? Don't remove essential functions even temporarily
- ? Don't edit while other JavaScript errors exist
- ? Don't assume the code will work without testing

## Current Website Capabilities (Comprehensive Feature Documentation)

### ?? **Core E-commerce Features**
- **Multi-Game Item Marketplace**: Mobile Legends and Roblox gaming items
- **Dynamic Item Filtering**: Filter by "All Items", "Mobile Legends", or "Roblox"
- **Shopping Cart System**: Add/remove items with quantity management
- **Multi-Currency Support**: 10 currencies (PHP, USD, EUR, GBP, JPY, KRW, SGD, MYR, THB, VND)
- **Real-time Price Conversion**: Automatic currency conversion with live exchange rates
- **Item Rarity System**: Legendary, Epic, Rare, Common with color-coded badges
- **Responsive Design**: Mobile-first design optimized for all screen sizes

### ?? **Payment Processing System**
- **GCash Integration**: Manual GCash payment processing with payment instructions
- **Multiple Payment Methods**: PayPal, GCash, PayMaya, Cryptocurrency, Bank Transfer, Western Union
- **Payment Reference Generation**: Unique reference codes for payment tracking
- **Payment Instructions UI**: Green notification panel with detailed GCash payment steps
- **Environment Variable Integration**: Secure GCash number and account details from Netlify

### ?? **User Management System**
- **User Registration**: Create accounts with display name, email, password, favorite game
- **User Authentication**: Secure login/logout with localStorage persistence
- **User Profiles**: Profile dropdown with stats (orders count, wishlist count)
- **Session Management**: Auto-login on page refresh, secure logout
- **User Preferences**: Favorite game selection affects personalized UI

### ?? **Order Management System**
- **Order Processing**: Complete checkout flow with form validation
- **Order ID Generation**: Format: 'TRIO-' + timestamp for unique identification
- **Order Tracking**: Track orders by ID with status updates (pending/processing/completed/cancelled)
- **Local Order Storage**: Orders saved to user's localStorage for offline access
- **Customer Information**: Game username, email, WhatsApp, region, special instructions

### ?? **Notification & Communication Systems**
- **Discord Integration**: Rich embed notifications sent to Discord webhook on new orders
- **GCash Payment Notifications**: Specialized green notification panel for GCash payment instructions
- **Toast Notifications**: Success/error messages with clean text (no emojis)
- **Owner Notifications**: Alert system for new orders received

### ?? **Database Integration (Supabase)**
- **Order Storage**: All orders automatically saved to Supabase database
- **Customer Tracking**: Customer profiles with order history and spending analytics
- **Order Items Tracking**: Detailed item-level tracking with quantities and subtotals
- **Database Tables**: 
  - `triogel_orders`: Main order records with customer details and payment info
  - `triogel_order_items`: Individual items within each order
  - `triogel_customers`: Customer profiles with aggregate data

### ?? **User Interface & Design**
- **Dark Gaming Theme**: Cyberpunk-inspired design with neon accents
- **Gradient System**: Custom CSS gradients for Mobile Legends (blue) and Roblox (cyan-purple)
- **Card-based Layout**: Glass-morphism effect with backdrop blur
- **Interactive Elements**: Hover effects, smooth transitions, animated buttons
- **Modal System**: Overlay modals for cart, checkout, login, registration, order tracking
- **Currency Dropdown**: Elegant dropdown with search and selection functionality

### ?? **Security & Privacy Features**
- **Environment Variables**: Sensitive data (GCash numbers, API keys) stored securely in Netlify
- **Client-side Validation**: Form validation before submission
- **Error Handling**: Comprehensive try/catch blocks with user-friendly error messages
- **No Hardcoded Secrets**: All sensitive values retrieved from environment variables

## Technical Architecture

### File Structure
```
ecommercesite/
??? index.html                    # Main HTML structure (single-page application)
??? assets/
?   ??? css/main.css             # All styles and animations
?   ??? js/main.js               # All JavaScript functionality
??? netlify/
?   ??? functions/
?       ??? process-order.js     # Serverless order processing function
??? .github/
?   ??? copilot-instructions.md  # This documentation file
??? DATABASE-SETUP.md            # Supabase database schema and setup
??? GCASH-SETUP.md               # GCash payment integration guide
??? netlify.toml                 # Netlify deployment configuration
```

### Data Structures

#### Item Object Structure
```javascript
{
    id: 1,
    name: "Legendary Skin Bundle",
    game: "ml", // "ml" or "roblox"
    description: "Premium legendary skin collection...",
    price: 4949.45, // Always in PHP
    icon: "SKIN", // Display icon/symbol
    rarity: "legendary", // legendary/epic/rare/common
    stats: { // Game-specific attributes
        skins: "5",
        effects: "Special",
        voice: "Yes"
    }
}
```

#### Order Object Structure
```javascript
{
    orderId: "TRIO-1755778449713",
    gameUsername: "PlayerName123",
    email: "customer@example.com",
    whatsappNumber: "+1234567890",
    paymentMethod: "gcash",
    currency: "PHP",
    serverRegion: "Southeast Asia",
    customerNotes: "Special delivery instructions",
    customer: {
        email: "customer@example.com",
        gameUsername: "PlayerName123",
        whatsappNumber: "+1234567890",
        serverRegion: "Southeast Asia"
    },
    items: [
        {
            id: 1,
            name: "Epic Skin - Fanny",
            game: "ml",
            price: 1924.45,
            quantity: 1
        }
    ],
    total: 1924.45,
    timestamp: "2024-01-15T10:30:00.000Z"
}
```

#### User Object Structure
```javascript
{
    id: "1705123456789",
    username: "GamerName123",
    email: "user@example.com",
    favoriteGame: "ml", // "ml", "roblox", or "other"
    joinDate: "2024-01-15T10:30:00.000Z",
    orders: [], // Array of user's order history
    wishlist: [] // Array of favorited items
}
```

### Environment Variables (Netlify Configuration)
```
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/[your-webhook-id]
GCASH_NUMBER=[your-gcash-number]
GCASH_NAME=[your-gcash-account-name]
SUPABASE_URL=https://[your-project].supabase.co
SUPABASE_ANON_KEY=[your-supabase-anon-key]
```

## Current Workflow & User Journey

### 1. **Customer Shopping Experience**
1. **Browse Items**: View all items or filter by Mobile Legends/Roblox
2. **Currency Selection**: Choose from 10 supported currencies with live conversion
3. **Add to Cart**: Items added with quantity tracking and cart count display
4. **Account Creation** (Optional): Register for order tracking and faster checkout
5. **Checkout Process**: Complete form with game username, email, payment method, region
6. **Payment Processing**: 
   - GCash: Receive detailed payment instructions in green notification panel
   - Other methods: Standard order confirmation
7. **Order Confirmation**: Receive order ID and tracking information

### 2. **Payment Processing (GCash Focus)**
1. **Customer selects GCash**: At checkout, chooses "GCash (PHP only)"

2. **Payment Instructions Generated**: Netlify function creates payment reference and amount
3. **Customer Notification**: Green panel displays:
   - GCash number (from environment variable)
   - Exact amount in PHP
   - Unique payment reference
   - Email instructions for payment proof
4. **Manual Verification**: Customer sends payment screenshot via email
5. **Order Fulfillment**: Manual processing and item delivery

### 3. **Order Management Workflow**
1. **Order Submission**: Customer completes checkout form
2. **Server Processing**: Netlify function processes order data
3. **Database Storage**: Order saved to Supabase with full details
4. **Discord Notification**: Rich embed sent to Discord channel with order details
5. **Customer Confirmation**: Order ID provided for tracking
6. **Order Tracking**: Customer can track order status using order ID

### 4. **Backend Integration Flow**
1. **Order Processing**: JavaScript sends POST request to `/.netlify/functions/process-order`
2. **Payment Setup**: Function generates payment details based on method selected
3. **Database Operations**: 
   - Save order to `triogel_orders` table
   - Save individual items to `triogel_order_items` table
   - Update customer record in `triogel_customers` table
4. **External Notifications**: Send Discord webhook with order information
5. **Response Handling**: Return success/error status to frontend

## Key JavaScript Functions & Their Roles

### Core Initialization
- `init()`: Main initialization function, sets up all systems
- `displayItems()`: Renders item cards to the DOM with current filter and currency
- `setupCurrencySelector()`: Populates currency dropdown and handles selection
- `setupFilters()`: Configures game filter buttons (All/Mobile Legends/Roblox)

### E-commerce Functions
- `addToCart(itemId)`: Adds items to shopping cart with quantity management
- `updateCartCount()`: Updates cart badge with current item count
- `formatPrice(priceInPHP, targetCurrency)`: Converts prices between currencies
- `displayCartItems()`: Renders cart modal content with items and total
- `proceedToCheckout()`: Opens checkout modal and displays order summary

### Order Processing
- `processOrder(orderData)`: Sends order to Netlify function for processing
- `saveOrderLocally(orderData)`: Saves order to user's localStorage for tracking
- `trackOrderById(orderId)`: Retrieves and displays order tracking information
- `findOrderInLocalStorage(orderId)`: Searches local orders by ID

### Authentication System
- `loginUser(email, password)`: Authenticates user and creates session
- `registerUser(userData)`: Creates new user account with validation
- `initAuth()`: Checks for existing session and auto-logs in user
- `showUserSection()`: Displays user dropdown with stats and options
- `logoutUser()`: Clears session and returns to login state

### Payment & Notifications
- `showGcashNotification(message)`: Displays specialized GCash payment instruction panel
- `showNotification(message)`: Shows general toast notifications
- `displayOrderTrackingResult(orderData)`: Renders order tracking information
- `copyGcashDetails()`: Allows copying of payment information to clipboard

### Utility Functions
- `validateItemsSystem()`: Ensures items are loading properly (critical system check)
- `validateCodeIntegrity()`: Checks for code corruption or missing functions
- `setCurrency(currencyCode)`: Changes active currency and updates display
- `toggleCurrencySelector()`: Shows/hides currency dropdown
- `closeAllModals()`: Utility to close any open modal dialogs

## Current Known Issues & Solutions

### Fixed Issues
1. **GCash Notification System**: ? Working correctly with proper emoji display
2. **Netlify Security Scan**: ? Resolved by removing hardcoded values, using environment variables
3. **Items Loading System**: ? Robust with validation and error recovery
4. **Currency Conversion**: ? Working with all 10 supported currencies
5. **Database Integration**: ? All orders saved to Supabase successfully
6. **Discord Notifications**: ? Rich embeds sent with complete order information

### Current Limitations
1. **Manual Payment Processing**: GCash payments require manual verification via email
2. **No Real-time Inventory**: Items don't have stock quantity management
3. **Basic Order Status**: Limited to 4 status states (pending/processing/completed/cancelled)
4. **No Email Integration**: All communication handled through Discord and manual email

## Development Guidelines & Standards

### Critical System Requirements
1. **No Build System**: Static HTML project - never attempt npm install or build commands
2. **Never Use Visual Studio Build**: This is a static HTML project - never run Visual Studio build commands or use build tools
3. **Manual Error Checking Only**: Always manually check for JavaScript errors in browser console instead of using build systems
4. **Code Integrity First**: Always verify complete functions, objects, and arrays after edits
5. **Items Loading Validation**: Run `validateItemsSystem()` after every change
6. **Security Best Practices**: Never hardcode sensitive values, always use environment variables
7. **Mobile-First Design**: Test all features on mobile devices first

### Manual Error Detection Process
Instead of using build systems, always:
1. **Open browser developer console** (F12) to check for JavaScript errors
2. **Test core functionality manually** by clicking buttons and testing features
3. **Check items loading** by refreshing the page and verifying items display
4. **Validate forms manually** by trying to submit with invalid data
5. **Test responsive design** by resizing browser window or using mobile view

### Never Use These Commands
- ? `npm install`
- ? `npm run build` 
- ? `yarn build`
- ? Visual Studio "Build Solution"
- ? Any build or compile commands
- ? Package managers or bundlers

### Always Use These Instead
- ? Open index.html directly in browser
- ? Check browser console for errors (F12 ? Console)
- ? Test functionality by clicking and using the website
- ? Validate with manual testing only