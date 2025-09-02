// TRIOGEL Authentication System - Production Version
const SESSION_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

class TriogelAuth {
    constructor() {
        this.apiBase = '/.netlify/functions/user-auth';
        this.adminAuthBase = '/.netlify/functions/admin-auth';
        this.currentUser = null;
        this.adminStatus = null;
        this.isOnline = navigator.onLine;
        
        // Listen for online/offline status
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.syncOfflineData();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
        
        // Initialize authentication state
        this.initializeAuth();
    }

    /**
     * Securely check if current user is an admin (server-side verification)
     */
    async isAdmin() {
        if (!this.currentUser || !this.currentUser.email) {
            return false;
        }

        // Use cached admin status if available and recent
        if (this.adminStatus && this.adminStatus.timestamp > Date.now() - (5 * 60 * 1000)) { // 5 minutes cache
            return this.adminStatus.isAdmin;
        }

        // Verify with server
        try {
            const response = await fetch(this.adminAuthBase, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'check_admin_status',
                    userEmail: this.currentUser.email,
                    sessionToken: this.currentUser.sessionToken || null
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    this.adminStatus = {
                        isAdmin: data.isAdmin,
                        adminLevel: data.adminLevel,
                        permissions: data.permissions,
                        timestamp: Date.now()
                    };
                    return data.isAdmin;
                }
            }
        } catch (error) {
            console.warn('Admin verification failed, using fallback');
        }

        // Fallback: No admin access if server verification fails
        return false;
    }

    /**
     * Get admin level (server-verified)
     */
    async getAdminLevel() {
        if (await this.isAdmin()) {
            return this.adminStatus?.adminLevel || 0;
        }
        return 0;
    }

    /**
     * Get admin permissions (server-verified)
     */
    async getAdminPermissions() {
        if (await this.isAdmin()) {
            return this.adminStatus?.permissions || {};
        }
        return {};
    }

    /**
     * Initialize authentication state on page load
     */
    async initializeAuth() {
        console.log('Initializing TRIOGEL authentication...');

        // Check for existing session
        const savedSession = localStorage.getItem('triogel-session');

        if (savedSession) {
            try {
                const sessionData = JSON.parse(savedSession);

                // --- SESSION EXPIRATION CHECK ---
                if (!sessionData.sessionTimestamp || Date.now() - sessionData.sessionTimestamp > SESSION_EXPIRATION_MS) {
                    console.log('Session expired, logging out...');
                    localStorage.removeItem('triogel-session');
                    this.currentUser = null;
                    this.showLoginSection();
                    this.showSessionTimeoutPopup('Your session has expired. Please log in again.');
                    return;
                }
                // --- END SESSION EXPIRATION CHECK ---

                // Fetch user profile from backend using session info
                let userProfile = null;
                if (this.isOnline && sessionData.id) {
                    try {
                        const response = await this.makeAuthRequest('get_profile', { userId: sessionData.id });
                        if (response.success) {
                            userProfile = response.user;
                            // If not verified, sign out and show verification
                            if (userProfile && userProfile.email_verified === false) {
                                await this.logout();
                                if (typeof showNotification === 'function') {
                                    showNotification('Your email is not verified. Please verify to continue.', 'error');
                                }
                                if (typeof showOtpModal === 'function') {
                                    showOtpModal(userProfile.email, response.timeRemaining);
                                }
                                return;
                            }
                        }
                    } catch (error) {
                        console.warn('Session validation failed, using minimal session data:', error);
                    }
                }

                // Fallback to minimal session if profile fetch fails
                this.currentUser = userProfile || { id: sessionData.id };

                this.showUserSection();

                // Check admin status and show controls if admin
                if (await this.isAdmin()) {
                    await this.showAdminControls();
                    if (userProfile && userProfile.username) {
                        console.log(`Admin user logged in: ${userProfile.username} (Level ${await this.getAdminLevel()})`);
                    }
                } else {
                    if (userProfile && userProfile.username) {
                        console.log('Regular user session restored:', userProfile.username);
                    }
                }
            } catch (error) {
                console.error('Error parsing saved session data:', error);
                localStorage.removeItem('triogel-session');
                this.showLoginSection();
            }
        } else {
            this.showLoginSection();
        }
    }

    /**
     * Show admin controls in the interface (after server verification)
     */
    async showAdminControls() {
        try {
            // Verify admin status first
            const isAdminUser = await this.isAdmin();
            if (!isAdminUser) {
                console.log('Access denied - not an admin');
                return;
            }

            const adminLevel = await this.getAdminLevel();
            
            // Add admin button to navigation if not exists
            const navControls = document.querySelector('.nav-controls');
            if (navControls && !document.getElementById('adminButton')) {
                const adminButton = document.createElement('button');
                adminButton.id = 'adminButton';
                adminButton.className = 'admin-btn';
                adminButton.innerHTML = '?Admin Panel';
                adminButton.onclick = () => window.openAdminPanel();
                
                // Insert before the cart button
                const cartButton = document.querySelector('.cart-button');
                if (cartButton) {
                    navControls.insertBefore(adminButton, cartButton);
                } else {
                    navControls.appendChild(adminButton);
                }
                
                console.log(`? Admin controls added (Level ${adminLevel})`);
            }
            
            // Add admin menu item to user dropdown
            const userDropdown = document.getElementById('userDropdown');
            if (userDropdown && !document.getElementById('adminMenuItem')) {
                const adminMenuItem = document.createElement('button');
                adminMenuItem.id = 'adminMenuItem';
                adminMenuItem.className = 'user-menu-item admin-menu-item';
                adminMenuItem.innerHTML = 'Admin Panel';
                adminMenuItem.onclick = () => {
                    window.closeUserDropdown();
                    window.openAdminPanel();
                };
                
                const userMenuItems = userDropdown.querySelector('.user-menu-items');
                if (userMenuItems) {
                    // Insert before logout button
                    const logoutButton = userMenuItems.querySelector('.logout');
                    if (logoutButton) {
                        userMenuItems.insertBefore(adminMenuItem, logoutButton);
                    } else {
                        userMenuItems.appendChild(adminMenuItem);
                    }
                }
            }
        } catch (error) {
            console.error('Error showing admin controls:', error);
        }
    }

    /**
     * Hide admin controls
     */
    hideAdminControls() {
        try {
            const adminButton = document.getElementById('adminButton');
            const adminMenuItem = document.getElementById('adminMenuItem');
            
            if (adminButton) adminButton.remove();
            if (adminMenuItem) adminMenuItem.remove();
            
            // Clear admin status cache
            this.adminStatus = null;
            
            console.log('?? Admin controls hidden');
        } catch (error) {
            console.error('Error hiding admin controls:', error);
        }
    }

    /**
     * Register a new user
     */
    async register(userData) {
        console.log('Attempting registration for:', userData.username);

        try {
            // Validate required fields
            if (!userData.username || !userData.email || !userData.password) {
                throw new Error('All fields are required');
            }

            if (userData.password !== userData.confirmPassword) {
                throw new Error('Passwords do not match');
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email)) {
                throw new Error('Please enter a valid email address');
            }

            // Password strength validation
            if (userData.password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }

            const registrationData = {
                username: userData.username,
                email: userData.email.toLowerCase(),
                password: userData.password,
                favorite_game: userData.favoriteGame || 'ml'
            };

            if (this.isOnline) {
                // Try database registration
                const response = await this.makeAuthRequest('register', { userData: registrationData });
                
                if (response.success) {
                    // Only set currentUser, do NOT save session yet
                    this.currentUser = response.user;
                    // If not verified, show OTP modal and do NOT save session
                    if (!response.user.email_verified) {
                        if (typeof showOtpModal === 'function') {
                            showOtpModal(response.user.email, response.timeRemaining);
                        }
                        // Optionally show notification
                        if (typeof showNotification === 'function') {
                            showNotification('Please verify your email to complete registration.', 'info');
                        }
                        return { success: true, user: response.user };
                    }
                    // If verified, save session and show user section
                    this.saveUserSession(response.user);
                    this.showUserSection();
                    
                    // Check admin status after registration
                    if (await this.isAdmin()) {
                        await this.showAdminControls();
                        if (typeof showNotification === 'function') {
                            showNotification(`Welcome, Admin ${response.user.username}! ??`);
                        }
                    } else {
                        if (typeof showNotification === 'function') {
                            showNotification(`Welcome to TRIOGEL, ${response.user.username}!`);
                        }
                    }
                    
                    console.log('Database registration successful');
                    return { success: true, user: response.user };
                } else {
                    throw new Error(response.message || 'Registration failed');
                }
            } else {
                // Offline fallback - save to localStorage
                const offlineUser = {
                    id: Date.now(), // Temporary ID for offline users
                    username: registrationData.username,
                    email: registrationData.email,
                    favorite_game: registrationData.favorite_game,
                    created_at: new Date().toISOString(),
                    offline: true // Mark as offline registration
                };

                // Store in offline queue for later sync
                this.storeOfflineRegistration(registrationData);
                
                this.currentUser = offlineUser;
                this.saveUserSession(offlineUser);
                this.showUserSection();
                
                if (typeof showNotification === 'function') {
                    showNotification(`Welcome, ${offlineUser.username}! (Offline mode - will sync when online)`);
                }
                
                console.log('Offline registration successful');
                return { success: true, user: offlineUser };
            }

        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    /**
     * Login user
     */
    async login(credentials) {
        console.log('Attempting login for:', credentials.email);

        try {
            // Validate required fields
            if (!credentials.email || !credentials.password) {
                throw new Error('Email and password are required');
            }

            const loginData = {
                email: credentials.email.toLowerCase(),
                password: credentials.password
            };

            if (this.isOnline) {
                // Try database login
                const response = await this.makeAuthRequest('login', { credentials: loginData });
                if (response.success) {
                    this.currentUser = response.user;
                    this.saveUserSession(response.user);
                    this.showUserSection();

                    // ... admin logic ...

                    console.log('Database login successful');
                    return { success: true, user: response.user };
                } else if (response.error === 'Email not verified') {
                    // Show verification modal
                    if (typeof showNotification === 'function') {
                        showNotification(response.message, 'error');
                    }
                    if (typeof showOtpModal === 'function') {
                        showOtpModal(response.email, response.timeRemaining);
                    }
                    
                    const error = new Error(response.message);
                    error.timeRemaining = response.timeRemaining;
                    throw error;
                } else {
                    throw new Error(response.message || 'Login failed');
                }
            } else {
                // ... offline logic ...
            }

        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    /**
     * Logout user
     */
    async logout() {
        console.log('Logging out user...');

        try {
            if (this.currentUser && this.isOnline && !this.currentUser.offline) {
                // Update session in database
                await this.makeAuthRequest('update_session', {
                    userId: this.currentUser.id,
                    sessionData: {
                        session_active: false,
                        last_logout: new Date().toISOString()
                    }
                });
            }

            // Hide admin controls
            this.hideAdminControls();

            // Clear local session
            this.currentUser = null;
            this.adminStatus = null;
            localStorage.removeItem('triogel-session');
            this.showLoginSection();

            if (typeof showNotification === 'function') {
                showNotification('Logged out successfully!');
            }

            console.log('Logout successful');

        } catch (error) {
            console.error('Logout error:', error);
            // Even if database update fails, clear local session
            this.hideAdminControls();
            this.currentUser = null;
            this.adminStatus = null;
            localStorage.removeItem('triogel-session');
            this.showLoginSection();
        }
    }

    /**
     * Validate existing session with database
     */
    async validateSession(userId) {
        if (!this.isOnline) return;

        try {
            const response = await this.makeAuthRequest('get_profile', { userId });
            
            if (response.success) {
                // Update local user data with latest from database
                this.currentUser = { ...this.currentUser, ...response.user };
                this.saveUserSession(this.currentUser);
                
                // Update admin controls if needed
                if (await this.isAdmin()) {
                    await this.showAdminControls();
                } else {
                    this.hideAdminControls();
                }
                
                return true;
            } else {
                throw new Error('Session validation failed');
            }
        } catch (error) {
            console.error('Session validation error:', error);
            throw error;
        }
    }

    /**
     * Make authenticated request to API
     */
    async makeAuthRequest(action, data) {
        try {
            const response = await fetch(this.apiBase, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action,
                    ...data
                })
            });

            const responseText = await response.text();
            console.log('API Response Status:', response.status);

            if (!response.ok) {
                let errorData;
                try {
                    errorData = JSON.parse(responseText);
                } catch (e) {
                    errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
                }
                const error = new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
                // Attach all other properties from errorData to the error object
                Object.keys(errorData).forEach(key => {
                    if (key !== 'message') error[key] = errorData[key];
                });
                throw error;
            }

            let result;
            try {
                result = JSON.parse(responseText);
            } catch (e) {
                throw new Error('Invalid response format from server');
            }
            
            if (!result.success && result.error) {
                throw new Error(result.message || result.error);
            }

            return result;

        } catch (error) {
            console.error('API request error:', error);
            
            // Check if this is a network error
            if (error.message.includes('fetch') || error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
                console.warn('Network error detected, switching to offline mode');
                this.isOnline = false;
                throw new Error('Network error - please check your connection and try again');
            }
            
            throw error;
        }
    }

    /**
     * Save user session to localStorage
     */
    saveUserSession(user) {
        try {
            // Store only minimal session info
            const sessionData = {
                id: user.id,
                sessionToken: user.sessionToken,
                sessionTimestamp: Date.now()
            };
            localStorage.setItem('triogel-session', JSON.stringify(sessionData));
        } catch (error) {
            console.error('Error saving session:', error);
        }
    }

    /**
     * Store offline registration for later sync
     */
    storeOfflineRegistration(userData) {
        try {
            const offlineRegistrations = JSON.parse(localStorage.getItem('triogel-offline-registrations') || '[]');
            offlineRegistrations.push({
                ...userData,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('triogel-offline-registrations', JSON.stringify(offlineRegistrations));
        } catch (error) {
            console.error('Error storing offline registration:', error);
        }
    }

    /**
     * Sync offline data when coming back online
     */
    async syncOfflineData() {
        console.log('Syncing offline data...');

        try {
            // Sync offline registrations
            const offlineRegistrations = JSON.parse(localStorage.getItem('triogel-offline-registrations') || '[]');
            
            for (const registration of offlineRegistrations) {
                try {
                    await this.makeAuthRequest('register', { userData: registration });
                    console.log('Synced offline registration:', registration.email);
                } catch (error) {
                    console.warn('Failed to sync registration:', registration.email, error);
                }
            }

            if (offlineRegistrations.length > 0) {
                localStorage.removeItem('triogel-offline-registrations');
                if (typeof showNotification === 'function') {
                    showNotification('Offline data synced successfully!');
                }
            }

        } catch (error) {
            console.error('Error syncing offline data:', error);
        }
    }

    /**
     * Show login section in UI
     */
    showLoginSection() {
        try {
            const loginSection = document.getElementById('loginSection');
            const userSection = document.getElementById('userSection');
            
            if (loginSection) loginSection.style.display = 'flex';
            if (userSection) userSection.style.display = 'none';
            
            // Hide admin controls
            this.hideAdminControls();
        } catch (error) {
            console.error('Error showing login section:', error);
        }
    }

    /**
     * Show user section in UI
     */
    showUserSection() {
        try {
            if (!this.currentUser) {
                this.showLoginSection();
                return;
            }
            
            const loginSection = document.getElementById('loginSection');
            const userSection = document.getElementById('userSection');
            
            if (loginSection) loginSection.style.display = 'none';
            if (userSection) {
                userSection.style.display = 'block';
                const userName = userSection.querySelector('.user-name');
                if (userName) {
                    userName.textContent = this.currentUser.username;
                }
            }
        } catch (error) {
            console.error('Error showing user section:', error);
        }
    }

    /**
     * Get current user data
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Check if user is logged in
     */
    isLoggedIn() {
        return this.currentUser !== null;
    }

    showSessionTimeoutPopup(message) {
        // Remove any existing popup
        const existing = document.getElementById('sessionTimeoutPopup');
        if (existing) existing.remove();

        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'sessionTimeoutPopup';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(0,0,0,0.6)';
        overlay.style.zIndex = '9999';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';

        // Create modal box
        const modal = document.createElement('div');
        modal.style.background = '#222';
        modal.style.color = '#fff';
        modal.style.padding = '2rem';
        modal.style.borderRadius = '8px';
        modal.style.boxShadow = '0 2px 16px rgba(0,0,0,0.3)';
        modal.style.textAlign = 'center';
        modal.innerHTML = `
        <h2>Session Expired</h2>
        <p>${message}</p>
        <button id="sessionTimeoutCloseBtn" style="margin-top:1rem;padding:0.5rem 1.5rem;font-size:1rem;border:none;border-radius:4px;background:#e74c3c;color:#fff;cursor:pointer;">OK</button>
    `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        document.getElementById('sessionTimeoutCloseBtn').onclick = function () {
            overlay.remove();
        };
    }
}

// Create global authentication instance
window.TriogelAuth = new TriogelAuth();