const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
const { Resend } = require('resend');

// Initialize Supabase client with anon key (RLS-compliant)
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);
const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICEROLE_KEY
);

// CORS headers
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const resend = new Resend(process.env.RESEND_MAILSENDER);

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
        const { action, userData, credentials, userId, sessionData, email, otp } = JSON.parse(event.body);
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
            case 'verify_otp':
                return await handleVerifyOtp(email, otp);
            case 'resend_otp':
                return await handleResendOtp(email);
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
// Helper to send OTP email using Resend
async function sendEmail(targetMails, code) {
    const result = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: ['delivered@resend.dev'],//change to targetMails when in production(need domain setup)
        subject: `Your Triogel Verification Code ${code}`,
        html: `<p>Your verification code is <b>${code}</b></p><p>This code will expire in 3 minutes.</p>`
    });

    if (result.error || result.statusCode >= 400) {
        console.error('Resend email API error:', result);
        // Extract the error message for frontend
        let errorMessage = 'Unknown error';
        if (result.error) {
            if (typeof result.error === 'string') {
                errorMessage = result.error;
            } else if (result.error.error) {
                errorMessage = result.error.error;
            } else {
                errorMessage = JSON.stringify(result.error);
            }
        }
        throw new Error(errorMessage);
    }
}
// OTP verification handler
async function handleVerifyOtp(email, otp) {
    try {
        const { data: user, error } = await supabase
            .from('triogel_users')
            .select('*')
            .eq('email', email)
            .eq('verification_code', otp)
            .eq('email_verified', false)
            .single();

        // Place your logs here:
        console.log('Current UTC:', new Date().toISOString());
        if (user) {
            console.log('OTP expiry UTC:', user.verification_expires_at);
        } else {
            console.log('No user found for OTP verification.');
        }

        if (error || !user || new Date(user.verification_expires_at) < new Date().toISOString()) {
            return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Invalid or expired code' }) };
        }

        await supabase
            .from('triogel_users')
            .update({
                email_verified: true,
                verification_code: null,
                verification_expires_at: null
            })
            .eq('id', user.id);

        return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: 'Email verified' }) };
    } catch (error) {
        return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: error.message }) };
    }
}
// Handler function for resending OTP
async function handleResendOtp(email) {
    try {
        // Check if user exists and is not verified
        const { data: user, error: fetchError } = await supabase
            .from('triogel_users')
            .select('*')
            .eq('email', email)
            .single();

        if (fetchError || !user) {
            return { statusCode: 404, headers, body: JSON.stringify({ success: false, message: 'User not found' }) };
        }
        if (user.email_verified) {
            return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Email already verified' }) };
        }

        const nowUtc = Date.now();
        const expiryUtc = user.verification_expires_at ? new Date(user.verification_expires_at).getTime() : 0;
        let secondsLeft = 0;
        if (expiryUtc > nowUtc) {
            // OTP still valid, do NOT send new OTP
            secondsLeft = Math.ceil((expiryUtc - nowUtc) / 1000);

            return {
                statusCode: 429,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: `Please wait ${secondsLeft} seconds before requesting a new OTP.`,
                    timeRemaining: secondsLeft
                })
            };
        }

        // Generate new OTP
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 3 * 60 * 1000).toISOString();

        // Update user record
        const { error: updateError } = await supabase
            .from('triogel_users')
            .update({
                verification_code: code,
                verification_expires_at: expiresAt
            })
            .eq('id', user.id);

        if (updateError) {
            return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Failed to update OTP' }) };
        }

        // Send OTP email
        await sendEmail(email, code);

        return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: 'OTP resent' }) };
    } catch (error) {
        return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: error.message }) };
    }
}
// Handle user registration
async function handleRegistration(userData) {
    try {
        const { username, email, password, favorite_game } = userData;
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 3 * 60 * 1000).toISOString(); // 3 min expiry

        // Create Supabase Auth user
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true
        });
        if (authError) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Supabase auth registration failed', message: authError.message }) };
        }

        // Send OTP email
        try {
            await sendEmail(email, code);
        } catch (emailError) {
            await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Email sending failed',
                    message: emailError.message || String(emailError)
                })
            };
        }

        // Check if user exists
        const { data: existingUsers } = await supabase.from('triogel_users').select('email').eq('email', email);
        if (existingUsers && existingUsers.length > 0) {
            await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'User already exists', message: 'An account with this email already exists' }) };
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user with OTP fields
        const { data: newUser, error: insertError } = await supabase
            .from('triogel_users')
            .insert([{
                username,
                email,
                password_hash: hashedPassword,
                favorite_game: favorite_game || 'ml',
                created_at: new Date().toISOString(),
                last_login: new Date().toISOString(),
                session_active: true,
                supabase_user_id: authUser.user.id,
                email_verified: false,
                verification_code: code,
                verification_expires_at: expiresAt
            }])
            .select()
            .single();

        if (insertError) {
            console.error('Supabase insert error:', insertError);
            await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
            throw new Error('Failed to create user account');
        }

        const { password_hash, verification_code, verification_expires_at, ...userResponse } = newUser;
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'User registered. Verification code sent to email.',
                user: userResponse
            })
        };
    } catch (error) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Registration failed', message: error.message }) };
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

        // Block login if email not verified
        if (!user.email_verified) {
            const nowUtc = Date.now(); // ms since epoch, UTC
            const expiryUtc = user.verification_expires_at ? new Date(user.verification_expires_at).getTime() : 0;
            let secondsLeft = 0;
            if (expiryUtc > nowUtc) {
                // OTP still valid, do NOT send new OTP
                secondsLeft = Math.ceil((expiryUtc - nowUtc) / 1000);
            } else {
                // OTP expired, generate/send new OTP
                const code = Math.floor(100000 + Math.random() * 900000).toString();
                const expiresAt = new Date(nowUtc + 3 * 60 * 1000).toISOString();
                await supabase
                    .from('triogel_users')
                    .update({
                        verification_code: code,
                        verification_expires_at: expiresAt
                    })
                    .eq('id', user.id);
                await sendEmail(user.email, code);
                secondsLeft = 180;
            }
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Email not verified',
                    message: 'Your email is not verified. Please verify your email to log in.',
                    email: user.email,
                    timeRemaining: secondsLeft
                })
            };
        }

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
        // Update session (works with RLS - user can update own record)
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
        // Get user profile (RLS allows SELECT on own record)
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