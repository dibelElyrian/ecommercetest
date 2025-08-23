/**
 * TRIOGEL Authentication System - SECURE VERSION
 * Server-side admin verification with client-side session management
 * NO ADMIN EMAILS EXPOSED TO CLIENT
 */

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
        const savedUser = localStorage.getItem('triogel-user');
        
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                this.currentUser = userData;
                
                // Validate session with database if online
                if (this.isOnline && userData.id) {
                    try {
                        await this.validateSession(userData.id);
                    } catch (error) {
                        console.warn('Session validation failed, using local data:', error);
                    }
                }
                
                this.showUserSection();
                
                // Check admin status and show controls if admin
                if (await this.isAdmin()) {
                    await this.showAdminControls();
                    console.log(`Admin user logged in: ${userData.username} (Level ${await this.getAdminLevel()})`);
                } else {
                    console.log('Regular user session restored:', userData.username);
                }
            } catch (error) {
                console.error('Error parsing saved user data:', error);
                localStorage.removeItem('triogel-user');
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
                adminButton.innerHTML = '?? Admin Panel';
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
                adminMenuItem.innerHTML = '?? Admin Panel';
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
                    this.currentUser = response.user;
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
                    
                    // Check admin status after login
                    if (await this.isAdmin()) {
                        await this.showAdminControls();
                        if (typeof showNotification === 'function') {
                            showNotification(`Welcome back, Admin ${response.user.username}! ??`);
                        }
                    } else {
                        if (typeof showNotification === 'function') {
                            showNotification(`Welcome back, ${response.user.username}!`);
                        }
                    }
                    
                    console.log('Database login successful');
                    return { success: true, user: response.user };
                } else {
                    throw new Error(response.message || 'Login failed');
                }
            } else {
                // Offline fallback - check localStorage
                const offlineUsers = JSON.parse(localStorage.getItem('triogel-offline-users') || '[]');
                const user = offlineUsers.find(u => u.email === loginData.email);
                
                if (user) {
                    this.currentUser = user;
                    this.saveUserSession(user);
                    this.showUserSection();
                    
                    if (typeof showNotification === 'function') {
                        showNotification(`Welcome back, ${user.username}! (Offline mode)`);
                    }
                    
                    console.log('Offline login successful');
                    return { success: true, user: user };
                } else {
                    throw new Error('Invalid email or password (offline mode)');
                }
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
            localStorage.removeItem('triogel-user');
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
            localStorage.removeItem('triogel-user');
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
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
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
            // Remove sensitive data before storing
            const { password_hash, ...safeUser } = user;
            localStorage.setItem('triogel-user', JSON.stringify(safeUser));
        } catch (error) {
            console.error('Error saving user session:', error);
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
}

// Create global authentication instance
window.TriogelAuth = new TriogelAuth();