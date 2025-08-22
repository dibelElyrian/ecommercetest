# GitHub Copilot Instructions for TRIOGEL E-commerce

## ??? **CRITICAL RULE: LEGAL COMPLIANCE & REGULATORY REQUIREMENTS (PHILIPPINES)**

**?? MANDATORY COMPLIANCE FOR PHILIPPINES OPERATIONS WITH INTERNATIONAL TRAFFIC**

Before implementing ANY payment features or processing customer data, we MUST comply with Philippine laws and international regulations. This section is MANDATORY and takes priority over all other development considerations.

**?? IMPORTANT**: We are based in the Philippines but expect international traffic from customers worldwide. This creates additional compliance requirements for cross-border transactions and data protection.

### ?? **INTERNATIONAL TRAFFIC CONSIDERATIONS**

#### ??? **Geographic Compliance Requirements**

**? MUST COMPLY WITH INTERNATIONAL LAWS:**
- **GDPR (European Union)**: Data protection for EU customers
- **CCPA (California, USA)**: California Consumer Privacy Act compliance
- **PIPEDA (Canada)**: Personal Information Protection and Electronic Documents Act
- **LGPD (Brazil)**: Lei Geral de Proteção de Dados compliance
- **PDPA (Singapore)**: Personal Data Protection Act
- **Privacy Act (Australia)**: Australian privacy regulations

**? CROSS-BORDER TRANSACTION REQUIREMENTS:**
- **Foreign Exchange Regulations**: BSP approval for foreign currency transactions
- **International KYC**: Enhanced due diligence for international customers
- **Sanctions Compliance**: Screen against international sanctions lists (OFAC, UN, EU)
- **Export Control**: Ensure virtual items don't violate export restrictions
- **Tax Treaties**: Understand tax implications for international sales

**? PROHIBITED ACTIVITIES:**
- Processing transactions from sanctioned countries (North Korea, Iran, etc.)
- Accepting payments from individuals on terrorist watch lists
- Violating foreign exchange limits without BSP approval
- Collecting data from EU citizens without GDPR compliance
- Processing payments in countries where we lack proper licenses

#### ?? **Multi-Currency & Foreign Exchange Compliance**

**? BSP FOREIGN EXCHANGE REQUIREMENTS:**
- **Registration Threshold**: Register as Foreign Exchange Dealer if monthly volume exceeds USD 100,000
- **Reporting Requirements**: Report foreign exchange transactions to BSP
- **Documentary Requirements**: Maintain supporting documents for FX transactions
- **Authorized Dealer Banks**: Use only BSP-authorized banks for FX conversion
- **Anti-Money Laundering**: Enhanced AML for cross-border transactions

**?? CURRENCY HANDLING RULES:**
```javascript
// REQUIRED: BSP-compliant currency handling
const currencyCompliance = {
    // Maximum single transaction in foreign currency (BSP limit)
    maxForeignCurrencyTransaction: {
        USD: 50000, // USD 50,000 without additional documentation
        EUR: 45000,
        GBP: 40000
    },
    
    // Required documentation thresholds
    documentationRequired: {
        above_USD_10000: ['Valid ID', 'Source of Income Declaration'],
        above_USD_50000: ['BSP Registration', 'Enhanced Due Diligence']
    },
    
    // Prohibited currencies (sanctioned countries)
    prohibitedCurrencies: ['KPW', 'IRR'], // North Korea Won, Iranian Rial
    
    // Enhanced monitoring for high-risk countries
    enhancedMonitoring: ['Afghanistan', 'Myanmar', 'Yemen']
};
```

#### ?? **Customer Due Diligence for International Customers**

**? ENHANCED KYC REQUIREMENTS:**
```javascript
// REQUIRED: International KYC procedures
const internationalKYC = {
    // Basic information for all international customers
    basicInfo: ['fullName', 'email', 'country', 'gameUsername'],
    
    // Enhanced requirements based on transaction value
    enhancedDueDiligence: {
        above_PHP_50000: ['government_id', 'proof_of_address'],
        above_PHP_100000: ['source_of_funds', 'enhanced_verification'],
        above_PHP_500000: ['bank_reference', 'regulatory_approval']
    },
    
    // Prohibited customer types
    prohibited: ['minors_without_consent', 'sanctioned_individuals', 'pep_without_approval'],
    
    // High-risk country customers require additional verification
    highRiskCountries: ['Afghanistan', 'Iran', 'North Korea', 'Myanmar']
};
```

#### ?? **International Data Protection Implementation**

**? GDPR COMPLIANCE FOR EU CUSTOMERS:**
```javascript
// REQUIRED: GDPR-compliant data handling
const gdprCompliance = {
    // Data minimization - collect only necessary data
    dataCollection: {
        necessary: ['email', 'gameUsername', 'country'],
        optional: ['whatsappNumber', 'preferredRegion'],
        prohibited: ['race', 'religion', 'political_views']
    },
    
    // Explicit consent tracking
    consentManagement: {
        dataProcessing: null, // Must be explicitly set to true
        marketing: false,     // Opt-in only
        analytics: false,     // Opt-in only
        thirdPartySharing: false,
        consentDate: null,
        ipAddress: null,
        userAgent: null
    },
    
    // Customer rights implementation
    customerRights: {
        dataAccess: 'Provide data within 30 days',
        dataRectification: 'Allow corrections within 72 hours',
        dataErasure: 'Delete data within 30 days (right to be forgotten)',
        dataPortability: 'Provide data in machine-readable format',
        objectionToProcessing: 'Stop processing upon request'
    }
};
```

### ?? **INTERNATIONAL SANCTIONS & RESTRICTIONS**

#### ?? **PROHIBITED COUNTRIES & INDIVIDUALS**

**? ABSOLUTELY PROHIBITED:**
- **OFAC Sanctioned Countries**: North Korea, Iran, Syria, Cuba (check current list)
- **UN Sanctioned Individuals**: Anyone on UN Security Council sanctions lists
- **EU Sanctioned Entities**: Individuals/entities on EU sanctions lists
- **Specially Designated Nationals (SDN)**: US Treasury prohibited persons list
- **Politically Exposed Persons (PEP)**: Without proper due diligence

**?? MANDATORY SCREENING:**
```javascript
// REQUIRED: Real-time sanctions screening
const sanctionsScreening = {
    // Check against these lists before processing any payment
    screeningLists: [
        'OFAC_SDN_LIST',      // US Treasury Specially Designated Nationals
        'UN_CONSOLIDATED',    // UN Security Council Consolidated List
        'EU_SANCTIONS',       // European Union sanctions list
        'HMT_SANCTIONS',      // UK HM Treasury sanctions list
        'BSP_WATCHLIST'       // Bangko Sentral ng Pilipinas watchlist
    ],
    
    // Automatic rejection criteria
    autoReject: [
        'exact_name_match',
        'exact_address_match', 
        'known_sanctioned_entity'
    ],
    
    // Manual review criteria
    manualReview: [
        'partial_name_match',
        'high_risk_country',
        'unusual_transaction_pattern'
    ]
};
```

#### ?? **COUNTRY-SPECIFIC RESTRICTIONS**

**?? HIGH-RISK JURISDICTIONS (Enhanced Due Diligence Required):**
- Afghanistan, Myanmar, Yemen, Somalia, Libya
- Countries with weak AML/CFT frameworks (FATF grey list)
- Countries with high corruption indexes

**?? RESTRICTED JURISDICTIONS (Special Approval Required):**
- United States (OFAC compliance required)
- European Union (GDPR compliance required)
- China (Complex regulatory environment)
- Russia (Sanctions compliance required)

**?? PROHIBITED JURISDICTIONS (No Service):**
- Currently sanctioned countries as per BSP/AMLC guidance
- Countries where virtual item trading is explicitly illegal
- Jurisdictions where we cannot comply with local regulations

### ?? **TECHNICAL IMPLEMENTATION FOR INTERNATIONAL COMPLIANCE**

#### ?? **Geo-Location & Country Detection**

```javascript
// REQUIRED: Customer country detection and compliance checking
const geoCompliance = {
    // Detect customer country (use IP geolocation + user declaration)
    detectCustomerCountry: async function(ipAddress, userDeclaration) {
        const geoData = await getGeoLocation(ipAddress);
        return {
            detectedCountry: geoData.country,
            declaredCountry: userDeclaration,
            riskLevel: this.assessCountryRisk(geoData.country),
            complianceRequirements: this.getComplianceRequirements(geoData.country)
        };
    },
    
    // Country risk assessment
    assessCountryRisk: function(country) {
        const highRisk = ['AF', 'MM', 'YE', 'SO', 'LY']; // ISO country codes
        const mediumRisk = ['PK', 'BD', 'LK']; // Example medium risk
        const lowRisk = ['SG', 'JP', 'AU', 'US', 'CA']; // Example low risk
        
        if (highRisk.includes(country)) return 'HIGH';
        if (mediumRisk.includes(country)) return 'MEDIUM';
        return 'LOW';
    },
    
    // Get compliance requirements by country
    getComplianceRequirements: function(country) {
        const requirements = {
            'US': ['OFAC_screening', 'state_licensing_check'],
            'GB': ['FCA_compliance', 'enhanced_kyc'],
            'DE': ['GDPR_compliance', 'BaFin_requirements'],
            'AU': ['AUSTRAC_compliance', 'privacy_act'],
            'SG': ['MAS_compliance', 'PDPA_compliance'],
            'CA': ['FINTRAC_compliance', 'PIPEDA_compliance']
        };
        return requirements[country] || ['basic_kyc', 'standard_compliance'];
    }
};
```

#### ?? **International Payment Processing**

```javascript
// REQUIRED: Multi-jurisdictional payment compliance
const internationalPayments = {
    // Payment method availability by country
    paymentMethodsByCountry: {
        'PH': ['gcash', 'paymaya', 'bpi', 'bdo', 'paypal'],
        'US': ['paypal', 'stripe', 'bank_transfer'],
        'EU': ['paypal', 'sepa', 'bank_transfer'],
        'SG': ['paypal', 'grabpay', 'bank_transfer'],
        'AU': ['paypal', 'poli', 'bank_transfer']
    },
    
    // Currency restrictions by payment method
    currencyRestrictions: {
        'gcash': ['PHP'], // GCash only supports Philippine Peso
        'paymaya': ['PHP'], // PayMaya only supports Philippine Peso
        'paypal': ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SGD'],
        'bank_transfer': 'depends_on_bank'
    },
    
    // Transaction limits by country (to comply with local regulations)
    transactionLimits: {
        'US': { single: 10000, daily: 25000, monthly: 100000 }, // USD
        'EU': { single: 8500, daily: 21000, monthly: 85000 },   // EUR
        'PH': { single: 500000, daily: 1000000, monthly: 5000000 }, // PHP
        'default': { single: 5000, daily: 15000, monthly: 50000 } // USD equivalent
    }
};
```

#### ?? **Multi-Language Privacy Policies**

```javascript
// REQUIRED: Jurisdiction-specific privacy policies
const privacyPolicyByJurisdiction = {
    'EU': {
        language: 'english',
        specificRights: ['right_to_be_forgotten', 'data_portability', 'opt_out_profiling'],
        legalBasis: 'GDPR Article 6',
        dataRetention: '5 years maximum unless legally required',
        transferMechanism: 'Standard Contractual Clauses'
    },
    'US': {
        language: 'english',
        specificRights: ['opt_out_sale', 'non_discrimination', 'data_deletion'],
        legalBasis: 'CCPA compliance',
        dataRetention: 'Business necessity basis',
        transferMechanism: 'Privacy Shield successor framework'
    },
    'CA': {
        language: ['english', 'french'],
        specificRights: ['access', 'correction', 'withdrawal_consent'],
        legalBasis: 'PIPEDA compliance',
        dataRetention: 'Reasonable business purposes',
        transferMechanism: 'Adequate level of protection'
    }
};
```

### ?? **UPDATED COMPLIANCE CHECKLIST**

#### **Phase 1: Legal Foundation (BEFORE launching to international customers)**
- [ ] **Philippine Business Registration**: DTI registration, BIR TIN, Mayor's Permit
- [ ] **BSP Foreign Exchange Registration**: If monthly FX volume exceeds limits
- [ ] **Multi-Jurisdictional Privacy Policy**: GDPR, CCPA, PIPEDA compliant
- [ ] **International Terms of Service**: Country-specific legal requirements
- [ ] **Sanctions Screening System**: Real-time checking against international lists
- [ ] **Country Risk Assessment**: Framework for customer due diligence by country

#### **Phase 2: International Payment Compliance**
- [ ] **Enhanced KYC Procedures**: Risk-based customer verification by country
- [ ] **Multi-Currency Transaction Monitoring**: BSP and international AML compliance
- [ ] **Geo-Location Services**: Accurate country detection and risk assessment
- [ ] **Payment Method Restrictions**: Country-specific payment method availability
- [ ] **Cross-Border Reporting**: BSP and international reporting requirements
- [ ] **Legal Consultation**: International trade and payments lawyer consultation

#### **Phase 3: Ongoing International Compliance**
- [ ] **Regular Sanctions List Updates**: Daily/weekly screening list updates
- [ ] **Cross-Border Transaction Audits**: Monthly compliance reviews
- [ ] **International Regulatory Monitoring**: Track changes in target countries
- [ ] **Customer Support Training**: Multi-timezone, multi-language support
- [ ] **Data Localization Assessment**: Evaluate data residency requirements
- [ ] **Tax Treaty Analysis**: International tax implications and optimization

### ?? **INTERNATIONAL REGULATORY CONTACTS**

#### **Philippines (Home Base)**
- **BSP Foreign Exchange**: (02) 8708-7701 | forex@bsp.gov.ph
- **BIR International Tax**: 8981-8888 | internationaltax@bir.gov.ph
- **AMLC International Cooperation**: (02) 8523-4586 | international@amla.gov.ph

#### **Major Markets**
- **US FinCEN**: +1-800-949-2732 | frc@fincen.gov
- **EU Data Protection**: Various by country, see EDPB website
- **Singapore MAS**: +65-6225-5577 | webmaster@mas.gov.sg
- **Australia AUSTRAC**: +61-2-9950-0055 | info@austrac.gov.au

### ?? **INTERNATIONAL RED FLAGS**

#### **Customer Behavior Red Flags**
- Using VPN to hide true location
- Providing conflicting country information
- Requesting delivery to different country than payment origin
- Multiple accounts from same IP in different countries
- Transactions just below reporting thresholds in multiple currencies

#### **Transaction Pattern Red Flags**
- Rapid succession of international transactions
- Round number amounts in foreign currencies
- Transactions from newly created accounts in high-risk countries
- Payment methods inconsistent with declared country
- Unusual payment timing (outside business hours in customer's timezone)

#### **Geographic Red Flags**
- Transactions from countries not supported by our compliance framework
- IP addresses from sanctioned countries
- Multiple transactions from different countries within short timeframe
- Countries with recent regulatory changes affecting virtual items
- Jurisdictions where we lack proper legal documentation

This comprehensive international compliance framework ensures we can safely serve customers worldwide while maintaining full legal compliance in the Philippines and target markets.

## Project Overview
**TRIOGEL** is a premium virtual gaming items marketplace specializing in Mobile Legends: Bang Bang and Roblox items. It's a modern, responsive e-commerce platform with comprehensive payment integration, user management, and order processing capabilities.

**Tech Stack**: HTML5, CSS3, Vanilla JavaScript, Netlify Functions, Supabase Database, Discord Integration
**Project Type**: Static HTML website with serverless backend (no local build system)

## ?? **CRITICAL RULE: PRESERVE TRIOGEL CYBERPUNK DESIGN THEME**

**NEVER REVERT BUTTON AND UI STYLING TO PLAIN/DEFAULT BROWSER STYLES**

This project has a carefully crafted cyberpunk/gaming aesthetic that MUST be preserved:

### ? **NEVER Allow These Plain Styles:**
- ? **Browser default buttons**: Plain gray/white buttons with basic borders
- ? **Unstyled form elements**: Default input boxes, dropdowns, textareas
- ? **Plain text links**: Basic underlined links instead of styled buttons
- ? **Default modal styling**: Basic modals without glass-morphism effects
- ? **Missing hover effects**: Buttons without animations or interactive states
- ? **Inconsistent theming**: Elements that don't match the TRIOGEL design language

### ? **ALWAYS Maintain These TRIOGEL Design Elements:**
- ? **Gradient backgrounds**: `var(--primary-gradient)` for primary buttons
- ? **Glass-morphism effects**: `backdrop-filter: blur()` for cards and inputs
- ? **Hover animations**: `transform: translateY()` and glow effects
- ? **Rounded corners**: 25px+ border-radius for modern appearance
- ? **Cyberpunk colors**: Purple/blue gradients, neon accents, dark themes
- ? **Interactive feedback**: Shimmer effects, scale transforms, shadow glows
- ? **Consistent typography**: Bold weights, proper spacing, uppercase text

### ?? **Specific Elements That Must Always Be Styled:**

#### **Modal Buttons** (Critical - frequently broken):
```css
/* These buttons MUST have TRIOGEL styling: */
.auth-form button[type="submit"]     /* Login, Register, Create Account */
.auth-links button                   /* "Don't have account?", "Forgot Password?" */
.tracking-form button[type="submit"] /* Track Order button */
.tracking-input                      /* Order ID input textbox */
.checkout-btn                        /* Proceed to Checkout, Complete Purchase */
.remove-btn                          /* Remove from cart buttons */
```

#### **Navigation Elements**:
```css
.account-btn                         /* Login, Register buttons in header */
.currency-button                     /* Currency selector dropdown */
.user-info-btn                       /* User profile dropdown */
.filter-btn                          /* All Items, Mobile Legends, Roblox */
.cart-button                         /* Cart button with count badge */
.track-order-btn                     /* Track Order button in header */
```

#### **Form Elements**:
```css
.form-group input                    /* All text inputs */
.form-group select                   /* All dropdown selects */
.tracking-input                      /* Order tracking input */
```

### ? **Design Preservation Checklist**
Before making ANY changes, verify these elements maintain TRIOGEL styling:

1. **Button Gradients**: All primary buttons use `var(--primary-gradient)`
2. **Hover Effects**: All interactive elements have hover animations
3. **Glass Effects**: Cards and inputs have `backdrop-filter: blur()`
4. **Border Radius**: Modern rounded corners (20px+ for buttons, 15px+ for cards)
5. **Color Consistency**: Purple/blue theme maintained throughout
6. **Typography**: Bold weights and proper font sizing preserved
7. **Animations**: Smooth transitions and transform effects working
8. **Responsive Design**: Mobile styling maintains theme consistency

### ?? **If Styling Breaks, Immediately Fix:**

**Common causes of style regression:**
1. **CSS selector conflicts**: New CSS overriding existing TRIOGEL styles
2. **Missing CSS classes**: Buttons missing their proper class names
3. **Inline style overrides**: JavaScript adding inline styles that override CSS
4. **CSS specificity issues**: New selectors being too general and affecting existing elements

**Emergency fix process:**
1. **Identify affected elements**: Login buttons, modal buttons, form inputs
2. **Check CSS specificity**: Ensure TRIOGEL selectors have proper priority
3. **Verify class names**: Ensure elements have correct CSS classes applied
4. **Test all modals**: Login, Register, Cart, Checkout, Order Tracking
5. **Validate responsive**: Check mobile view maintains styling

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
- ? **Special characters**: No diamonds ?, multiplication ×, arrows ?, etc.
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

### ? **NEVER DO THESE WHEN EDITING MAIN.JS:**

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

### ??? **Database Integration (Supabase)**
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

## ?? **CRITICAL RULE: DO NOT MODIFY WORKING CODE**

**THE THIRD MOST IMPORTANT RULE: Never recklessly change, update, add, or delete any existing code line that is already working, especially if it is not part of or related to the current prompt.**

### ?? **WORKING CODE PROTECTION PRINCIPLES:**

1. **Only Modify What's Asked**: If the user asks to fix a specific function, only modify that function and its direct dependencies
2. **Leave Working Systems Alone**: If cart functionality is working and user asks about login, don't touch cart code
3. **Surgical Precision**: Make the smallest possible change to achieve the requested result
4. **Verify Before Changing**: Test existing functionality before making any modifications

### ? **MANDATORY CODE PRESERVATION RULES:**

#### **Rule 1: Identify what's actually broken before changing anything**
```javascript
// ? WRONG - Rewriting entire function when only one line has issue
function displayItems() {
    // Completely rewriting 50 lines of working code
    // just to fix one small bug
}

// ? CORRECT - Only fix the specific problem
function displayItems() {
    // ...existing working code...
    // Only change the problematic line:
    const filteredItems = currentFilter === 'all' ? items : items.filter(item => item.game === currentFilter);
    // ...rest of existing working code...
}
```

#### **Rule 2: Never refactor working code unless specifically asked**
```javascript
// ? WRONG - "Improving" working code without being asked
// User asked to fix login, but you decide to "clean up" the entire cart system
function addToCart(itemId) {
    // Don't rewrite this if it's working and unrelated to the prompt
}

// ? CORRECT - Only touch what needs fixing
// If user asks to fix login, only modify login-related functions
```

#### **Rule 3: Preserve existing function signatures and behavior**
```javascript
// ? WRONG - Changing function parameters when fixing unrelated issue
// User asks to fix display bug, but you change the function signature
function formatPrice(priceInPHP, targetCurrency, newParameterYouAdded) {
    // This breaks all existing calls to formatPrice()
}

// ? CORRECT - Keep existing signature intact
function formatPrice(priceInPHP, targetCurrency) {
    // Only fix the internal logic, don't change the interface
}
```

#### **Rule 4: Don't "optimize" or "clean up" unless requested**
```javascript
// ? WRONG - User asks to fix one validation, you rewrite entire form system
// This introduces new bugs in working code
const validateForm = () => {
    // Completely new validation logic you thought was "better"
    // but breaks existing functionality
}

// ? CORRECT - Fix only what's broken
const validateForm = () => {
    // ...existing working validation...
    // Only fix the specific validation issue mentioned
    // ...rest of existing working validation...
}
```

### ??? **CODE MODIFICATION SAFETY CHECKLIST:**

#### **Before Changing ANY Code:**
1. **? Is this code actually broken?** - Don't fix what isn't broken
2. **? Is this change directly related to the user's request?** - Stay focused on the prompt
3. **? Will this change break existing functionality?** - Test dependencies
4. **? Can I make a smaller, more targeted change?** - Prefer minimal modifications
5. **? Am I preserving the existing API/interface?** - Don't break external calls

#### **During Code Changes:**
1. **? Comment what you're changing and why** - Leave breadcrumbs
2. **? Test the specific functionality you modified** - Verify your change works
3. **? Test related functionality** - Ensure you didn't break dependencies
4. **? Keep changes atomic** - One logical change at a time
5. **? Preserve existing code style and patterns** - Don't introduce inconsistencies

#### **After Code Changes:**
1. **? Verify original issue is fixed** - Did you solve what was asked?
2. **? Verify no new issues introduced** - Test related functionality
3. **? Check console for new errors** - No new JavaScript errors
4. **? Test user workflow** - End-to-end functionality still works
5. **? Document what was changed** - Explain the modification

### ?? **PROTECTED CODE ZONES:**

#### **Never Modify Unless Specifically Asked:**
- **Working modal functions** - If cart modal works, don't "improve" it
- **Functional currency conversion** - If prices display correctly, don't touch
- **Working authentication** - If login/logout works, leave it alone
- **Stable item loading** - If items display properly, don't refactor
- **CSS styles that look correct** - Don't "enhance" working designs
- **Database integration that works** - Don't "optimize" working queries

#### **High-Risk Changes to Avoid:**
- **Renaming functions** - Breaks HTML onclick references
- **Changing function parameters** - Breaks all existing calls
- **Reordering code execution** - May break initialization sequences
- **Modifying CSS selectors** - Can break styling across the site
- **Changing data structures** - May break dependent functions
- **Altering API endpoints** - Breaks backend integration

### ? **EMERGENCY SITUATIONS WHERE CHANGES ARE ALLOWED:**

#### **Override Protection Only When:**
1. **Security vulnerability** - Fix immediately, but document changes
2. **Complete system failure** - Only if existing code prevents basic functionality
3. **User explicitly requests refactoring** - "Please rewrite the cart system"
4. **Code is causing the specific issue** - But still make minimal changes

#### **Even in Emergencies:**
1. **Document what you're changing** - Explain why it's necessary
2. **Make incremental changes** - Don't rewrite everything at once
3. **Test each change** - Verify fixes don't create new problems
4. **Preserve working parts** - Save what's functional

### ?? **GOOD EXAMPLES OF TARGETED FIXES:**

#### **Example 1: User Reports "Cart Count Not Updating"**
```javascript
// ? CORRECT - Only fix the specific issue
function addToCart(itemId) {
    // ...existing working code for finding item...
    // ...existing working code for adding to cart...
    
    updateCartCount(); // ? Only add this missing line
    
    // ...existing working code for notifications...
}

// ? WRONG - Don't rewrite entire function
// Don't change cart data structure, modal display, price formatting, etc.
```

#### **Example 2: User Reports "Login Button Not Working"**
```javascript
// ? CORRECT - Fix only the broken onclick reference
<button onclick="openLoginModal()">Login</button>  // ? Fix only this reference

// Don't modify:
// - The entire login form HTML
// - Working registration functionality  
// - Existing authentication logic
// - Modal styling that displays correctly
```

#### **Example 3: User Reports "Items Not Displaying"**
```javascript
// ? CORRECT - Fix only the display issue
function displayItems() {
    // ...existing working code...
    
    // Only fix the specific filtering bug:
    const filteredItems = currentFilter === 'all' ? items : items.filter(item => item.game === currentFilter);
    
    // ...rest of existing working code...
}

// Don't modify:
// - Currency conversion (if working)
// - Item data structure (if correct)
// - CSS styling (if items look right)
// - Rarity system (if colors are correct)
```

### ?? **DOCUMENTATION FOR CHANGES:**

#### **Always Include Change Explanation:**
```javascript
// CHANGED: Fixed cart count not updating after adding items
// REASON: Missing updateCartCount() call in addToCart function  
// IMPACT: Only affects cart badge display, no other functionality changed
function addToCart(itemId) {
    // ...existing code...
    updateCartCount(); // ? Added this line only
    // ...existing code...
}
```

#### **What NOT to Document:**
```javascript
// ? DON'T: "Improved the entire cart system for better performance"
// ? DON'T: "Refactored authentication for cleaner code"  
// ? DON'T: "Updated all functions to modern JavaScript"
// ? DON'T: "Enhanced UI components for better UX"
```

### ?? **FORBIDDEN MODIFICATIONS:**

#### **Never Do These Unless Explicitly Asked:**
- ? **Rewriting working functions** - "This could be cleaner"
- ? **Changing CSS that looks correct** - "This could be more modern"  
- ? **Optimizing functional code** - "This could be more efficient"
- ? **Adding features not requested** - "This would be a nice addition"
- ? **Updating working libraries** - "We should use the latest version"
- ? **Restructuring working files** - "The code organization could be better"

#### **Danger Phrases That Lead to Breaking Changes:**
- ?? "While we're here, let's also improve..."
- ?? "This would be a good opportunity to refactor..."
- ?? "We should update this to be more modern..."
- ?? "Let me clean up this code as well..."
- ?? "This function could be written better..."

### ? **SAFE MODIFICATION PHRASES:**

#### **Use These Approaches:**
- ? "I'll fix only the specific issue you mentioned"
- ? "This change targets only the broken functionality"  
- ? "I'm preserving all existing working code"
- ? "This minimal change addresses your exact request"
- ? "Only modifying what's necessary to solve the problem"

### ?? **BEFORE EVERY CHANGE - ASK YOURSELF:**

1. **Is this code actually broken?** If no, don't touch it
2. **Did the user specifically ask for this change?** If no, don't make it
3. **Will this change break something that currently works?** If yes, find another approach
4. **Can I solve the problem with a smaller change?** Always prefer minimal modifications
5. **Am I fixing the problem or just making the code "prettier"?** Only fix problems

### ?? **REMEMBER: WORKING CODE IS SACRED**

The TRIOGEL e-commerce site has complex, interconnected functionality. Every working piece of code represents tested, functional behavior that users and the business depend on. Changing working code unnecessarily:

- ? **Introduces new bugs** - Working code becomes broken code
- ? **Wastes time** - Time spent fixing new bugs instead of real problems  
- ? **Breaks user experience** - Features that worked stop working
- ? **Creates maintenance burden** - More code to test and debug
- ? **Violates user trust** - They asked for one fix, you broke something else

**The best code change is the smallest code change that solves the exact problem requested.**