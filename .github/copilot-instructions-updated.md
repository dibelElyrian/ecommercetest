# GitHub Copilot Instructions for TRIOGEL E-commerce

## Project Overview
TRIOGEL: Premium gaming items marketplace (Mobile Legends & Roblox). Modern responsive e-commerce site.

**Tech Stack**: HTML5, CSS3, Vanilla JS, Netlify Functions, GCash/PayPal payments

**Project Type**: Static HTML website (no local build system required)

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
- **No Local Build Required**: This is a static HTML project with **no build system in Visual Studio/local development** environment
- **No npm/yarn Locally**: Project uses vanilla HTML/CSS/JS without Node.js dependencies for development
- **Direct File Serving**: Files are served directly by web server during development (Live Server, file:// protocol)
- **Netlify Build Configuration**: `netlify.toml` exists **only for deployment configuration**, not for local development
- **Local Development**: Simply open `index.html` in browser - no build commands needed
- **Testing Method**: Open index.html directly in browser or use VS Code Live Server extension
- **Error Checking**: Validate through browser console and HTML/CSS validators

### Development Workflow
1. **Edit Files Directly**: Modify HTML, CSS, JS files directly in Visual Studio - **no build step required**
2. **Browser Testing**: Open index.html in browser to test changes (instant preview)
3. **Console Validation**: Check browser developer tools for errors
4. **Live Server**: Use VS Code Live Server extension for auto-refresh during development
5. **Netlify Deploy**: Push to Git repository ? Netlify handles deployment via `netlify.toml` configuration

### Error Validation Methods (Use Instead of Build)
```javascript
// Browser console validation - no build tools needed
console.log('? TRIOGEL loaded successfully!');

// Manual error checks in browser
if (typeof items === 'undefined') {
    console.error('? Items array not loaded');
}

// DOM validation - runs in browser
document.addEventListener('DOMContentLoaded', function() {
    const requiredElements = ['itemsGrid', 'cartCount', 'currencySelector'];
    requiredElements.forEach(id => {
        if (!document.getElementById(id)) {
            console.error(`? Missing element: ${id}`);
        }
    });
});
```

## Critical Guidelines (NON-NEGOTIABLE)

1. **NO LOCAL BUILD SYSTEM**: This is a static HTML project in Visual Studio - **never attempt npm install, build commands, or add package.json locally**
2. **netlify.toml is DEPLOYMENT ONLY**: The toml file configures Netlify's servers, not your local development
3. **Direct Development**: Edit HTML/CSS/JS files directly and open in browser - that's it!
4. **CODE INTEGRITY FIRST**: Always check for truncated code after every edit
5. **ITEMS LOADING MANDATORY CHECK**: After every change, run validateItemsSystem() to ensure items display
6. **NEVER regenerate entire files** - Always use targeted edits
7. **Browser-based testing**: All validation happens in browser console, not build tools

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

**Remember**: This is a **zero-build** local development project. Everything happens directly in the browser!