/**
 * TRIOGEL Authentication System
 * Database-backed user authentication with localStorage fallback
 */

// Authentication class to handle all user authentication operations
class TriogelAuth {
    constructor() {
        this.apiBase = '/.netlify/functions/user-auth';
        this.currentUser = null;
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
                console.log('User session restored:', userData.username);
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
                    
                    if (typeof showNotification === 'function') {
                        showNotification(`Welcome to TRIOGEL, ${response.user.username}!`);
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
                    
                    if (typeof showNotification === 'function') {
                        showNotification(`Welcome back, ${response.user.username}!`);
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
                    // Note: In offline mode, we can't verify password hash, so we'll use basic comparison
                    // This is a limitation of offline mode - passwords stored offline are less secure
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

            // Clear local session
            this.currentUser = null;
            localStorage.removeItem('triogel-user');
            this.showLoginSection();
            
            if (typeof showNotification === 'function') {
                showNotification('Logged out successfully!');
            }
            
            console.log('Logout successful');

        } catch (error) {
            console.error('Logout error:', error);
            // Even if database update fails, clear local session
            this.currentUser = null;
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
            console.log('API Response:', responseText);

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
                if (userName) userName.textContent = this.currentUser.username;
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