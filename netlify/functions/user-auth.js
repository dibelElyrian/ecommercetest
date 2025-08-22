const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');

// Initialize Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// CORS headers
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

exports.handler = async (event, context) => {
    // Handle CORS preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { action, userData, credentials, userId, sessionData } = JSON.parse(event.body);
        console.log('User auth action:', action);

        switch (action) {
            case 'register':
                return await handleRegistration(userData);
            case 'login':
                return await handleLogin(credentials);
            case 'update_session':
                return await handleSessionUpdate(userId, sessionData);
            case 'get_profile':
                return await handleGetProfile(userId);
            default:
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid action' })
                };
        }
    } catch (error) {
        console.error('User auth error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message 
            })
        };
    }
};

// Handle user registration
async function handleRegistration(userData) {
    try {
        const { username, email, password, favorite_game } = userData;

        // Check if user already exists
        const { data: existingUsers, error: checkError } = await supabase
            .from('triogel_users')
            .select('email')
            .eq('email', email);

        if (checkError) {
            console.error('Error checking existing user:', checkError);
            throw new Error('Database error during registration');
        }

        if (existingUsers && existingUsers.length > 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'User already exists',
                    message: 'An account with this email already exists' 
                })
            };
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert new user
        const { data: newUser, error: insertError } = await supabase
            .from('triogel_users')
            .insert([
                {
                    username: username,
                    email: email,
                    password_hash: hashedPassword,
                    favorite_game: favorite_game || 'ml',
                    created_at: new Date().toISOString(),
                    last_login: new Date().toISOString(),
                    session_active: true
                }
            ])
            .select()
            .single();

        if (insertError) {
            console.error('Error creating user:', insertError);
            throw new Error('Failed to create user account');
        }

        console.log('User registered successfully:', newUser.email);

        // Return user data without password
        const { password_hash, ...userResponse } = newUser;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'User registered successfully',
                user: userResponse
            })
        };

    } catch (error) {
        console.error('Registration error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Registration failed',
                message: error.message 
            })
        };
    }
}

// Handle user login
async function handleLogin(credentials) {
    try {
        const { email, password } = credentials;

        // Get user from database
        const { data: users, error: fetchError } = await supabase
            .from('triogel_users')
            .select('*')
            .eq('email', email);

        if (fetchError) {
            console.error('Error fetching user:', fetchError);
            throw new Error('Database error during login');
        }

        if (!users || users.length === 0) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ 
                    error: 'Invalid credentials',
                    message: 'Invalid email or password' 
                })
            };
        }

        const user = users[0];

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ 
                    error: 'Invalid credentials',
                    message: 'Invalid email or password' 
                })
            };
        }

        // Update last login
        const { error: updateError } = await supabase
            .from('triogel_users')
            .update({ 
                last_login: new Date().toISOString(),
                session_active: true 
            })
            .eq('id', user.id);

        if (updateError) {
            console.error('Error updating last login:', updateError);
        }

        console.log('User logged in successfully:', user.email);

        // Return user data without password
        const { password_hash, ...userResponse } = user;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Login successful',
                user: userResponse
            })
        };

    } catch (error) {
        console.error('Login error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Login failed',
                message: error.message 
            })
        };
    }
}

// Handle session update
async function handleSessionUpdate(userId, sessionData) {
    try {
        const { error } = await supabase
            .from('triogel_users')
            .update(sessionData)
            .eq('id', userId);

        if (error) {
            console.error('Error updating session:', error);
            throw new Error('Failed to update session');
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Session updated successfully'
            })
        };

    } catch (error) {
        console.error('Session update error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Session update failed',
                message: error.message 
            })
        };
    }
}

// Handle get user profile
async function handleGetProfile(userId) {
    try {
        const { data: user, error } = await supabase
            .from('triogel_users')
            .select('id, username, email, favorite_game, created_at, last_login')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching user profile:', error);
            throw new Error('Failed to fetch user profile');
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                user: user
            })
        };

    } catch (error) {
        console.error('Get profile error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Failed to get profile',
                message: error.message 
            })
        };
    }
}