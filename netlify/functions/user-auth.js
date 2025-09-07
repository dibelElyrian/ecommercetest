const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
const { Resend } = require('resend');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

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

    let jwtToken = null;
    if (event.headers.cookie) {
        const cookies = cookie.parse(event.headers.cookie);
        jwtToken = cookies.jwt;
    }

    try {
        const { action, userData, credentials, userId, sessionData, email, otp, profileData } = JSON.parse(event.body);
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
            case 'send_password_reset':
                return await handlePasswordReset(email);
            case 'update_profile':
                return await handleUpdateProfile(userId, profileData, jwtToken);
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
        subject: `Your LilyBlock Online Shop Verification Code`,
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
        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', email)
            .eq('verification_code', otp)
            .eq('email_verified', false)
            .single();

        console.log('Current UTC:', new Date().toISOString());
        if (user) {
            console.log('OTP expiry UTC:', user.verification_expires_at);
        } else {
            console.log('No user found for OTP verification.');
        }

        if (error || !user || new Date(user.verification_expires_at) < new Date().toISOString()) {
            return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Invalid or expired code' }) };
        }

        // Mark email as verified

        await supabaseAdmin
            .from('users')
            .update({
                email_verified: true,
                verification_code: null,
                verification_expires_at: null,
                last_login: new Date().toISOString(),
                session_active: true
            })
            .eq('id', user.id);

        // Fetch updated user data
        const { data: updatedUser, error: fetchError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (fetchError || !updatedUser) {
            return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: 'Failed to fetch user after verification' }) };
        }

        // Remove sensitive fields
        const { password_hash, verification_code, verification_expires_at, ...userResponse } = updatedUser;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Email verified and user logged in',
                user: userResponse
            })
        };
    } catch (error) {
        return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: error.message }) };
    }
}
// Handler function for resending OTP
async function handleResendOtp(email) {
    try {
        // Check if user exists and is not verified
        const { data: user, error: fetchError } = await supabase
            .from('users')
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
            .from('users')
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
        const { data: existingUsers } = await supabase.from('users').select('email').eq('email', email);
        if (existingUsers && existingUsers.length > 0) {
            await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'User already exists', message: 'An account with this email already exists' }) };
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user with OTP fields
        const { data: newUser, error: insertError } = await supabase
            .from('users')
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
                user: userResponse,
                timeRemaining: 180
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
            .from('users')
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

        // Block login if email not verified
        if (!user.email_verified) {
            const nowUtc = Date.now();
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
                    .from('users')
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

        // Update last login
        const { error: updateError } = await supabase
            .from('users')
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

        const userJwt = jwt.sign(
            {
                sub: user.supabase_user_id,
                email: user.email,
                role: 'authenticated'
            },
            process.env.SUPABASE_JWT_SECRET,
            { expiresIn: '24h', issuer: 'supabase', audience: 'authenticated' }
        );
        return {
            statusCode: 200,
            headers: {
                ...headers,
                'Set-Cookie': cookie.serialize('jwt', userJwt, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'Strict',
                    path: '/',
                    maxAge: 60 * 60 * 24
                })
            },
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
            .from('users')
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
            .from('users')
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
// Helper to send password reset email using Resend
async function sendResetPasswordEmail(targetEmail, tempPassword) {
    const result = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: ['delivered@resend.dev'], // Use targetEmail in production
        subject: `LilyBlock Online Shop Temporary Password`,
        html: `<p>Your temporary password is: <b>${tempPassword}</b></p>
               <p>Use this password to log in. Please change your password immediately after logging in for security.</p>`
    });

    if (result.error || result.statusCode >= 400) {
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

// Secure random password generator
function generateTempPassword(length = 10) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// Password reset handler
async function handlePasswordReset(email) {
    if (!email) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ success: false, message: 'Email required' })
        };
    }

    // Find user by email
    const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (fetchError || !user) {
        return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ success: false, message: 'User not found' })
        };
    }

    // Generate and hash temporary password
    const tempPassword = generateTempPassword(10);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(tempPassword, saltRounds);

    // Update user password in database
    const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({
            password_hash: hashedPassword
        })
        .eq('id', user.id);

    if (updateError) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, message: 'Failed to update password' })
        };
    }

    // Send email with temporary password
    try {
        await sendResetPasswordEmail(email, tempPassword);
    } catch (emailError) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, message: 'Failed to send email: ' + emailError.message })
        };
    }

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Temporary password sent to your email' })
    };
}
// Update user profile handler
async function handleUpdateProfile(userId, profileData, jwtToken) {
    try {
        if (!userId || !profileData) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ success: false, message: 'Missing userId or profileData' })
            };
        }

        // Use JWT for RLS
        const supabaseUser = jwtToken
            ? createClient(
                process.env.SUPABASE_URL,
                process.env.SUPABASE_ANON_KEY,
                { global: { headers: { Authorization: `Bearer ${jwtToken}` } } }
            )
            : supabase;

        // Prepare update object
        const updateObj = {};
        if (profileData.username) updateObj.username = profileData.username;
        if (profileData.email) updateObj.email = profileData.email;
        if (profileData.favorite_game) updateObj.favorite_game = profileData.favorite_game;
        if (profileData.newPassword && profileData.newPassword.length >= 6) {
            const saltRounds = 10;
            updateObj.password_hash = await bcrypt.hash(profileData.newPassword, saltRounds);
        }

        // Update user record (RLS will enforce auth.uid()/auth.email())
        const { error } = await supabaseUser
            .from('users')
            .update(updateObj)
            .eq('id', userId);

        if (error) {
            // Log the error for debugging
            console.error('Supabase update error:', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ success: false, message: error.message || 'Failed to update profile' })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, message: 'Profile updated successfully' })
        };
    } catch (error) {
        console.error('Profile update error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, message: error.message })
        };
    }
}