# TRIOGEL User Authentication Database Setup

This document outlines the database setup required for the TRIOGEL user authentication system using Supabase.

## Database Tables

### 1. triogel_users

This table stores user account information and authentication data.

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS triogel_users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    favorite_game VARCHAR(20) DEFAULT 'ml',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_logout TIMESTAMP WITH TIME ZONE,
    session_active BOOLEAN DEFAULT FALSE,
    profile_data JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_triogel_users_email ON triogel_users(email);
CREATE INDEX IF NOT EXISTS idx_triogel_users_username ON triogel_users(username);
CREATE INDEX IF NOT EXISTS idx_triogel_users_session ON triogel_users(session_active);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_triogel_users_updated_at 
    BEFORE UPDATE ON triogel_users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

## Row Level Security (RLS)

Enable RLS and create policies for secure access:

```sql
-- Enable Row Level Security
ALTER TABLE triogel_users ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own data
CREATE POLICY "Users can view own profile" ON triogel_users
    FOR SELECT USING (auth.uid()::text = id::text);

-- Allow users to update their own data
CREATE POLICY "Users can update own profile" ON triogel_users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Allow registration (insert)
CREATE POLICY "Allow user registration" ON triogel_users
    FOR INSERT WITH CHECK (true);
```

## Required Supabase Configuration

### Environment Variables

Ensure these environment variables are set in your Netlify deployment:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### Required Supabase Extensions

Make sure these extensions are enabled in your Supabase project:

1. **pg_crypto** - For password hashing utilities
2. **uuid-ossp** - For UUID generation if needed

### Service Key (for server-side operations)

For the Netlify functions to work properly, you'll also need the service key:

```
SUPABASE_SERVICE_KEY=your-service-role-key
```

## Database Migration

To set up the database, run the following SQL commands in your Supabase SQL editor:

```sql
-- Execute all the CREATE TABLE and related commands above
```

## Testing the Setup

After running the SQL setup, test the authentication system:

1. **Registration Test**:
   - Try registering a new user through the website
   - Check if the user appears in the `triogel_users` table

2. **Login Test**:
   - Try logging in with the registered user
   - Verify the `last_login` field is updated

3. **Session Management**:
   - Check that `session_active` is updated on login/logout
   - Verify session persistence across browser refreshes

## Security Notes

1. **Password Hashing**: Passwords are hashed using bcrypt with 10 salt rounds
2. **No Plain Text**: Passwords are never stored in plain text
3. **Secure Sessions**: Sessions are managed securely with database verification
4. **Environment Variables**: All sensitive data uses environment variables

## Troubleshooting

### Common Issues

1. **"relation does not exist" error**:
   - Make sure you've run the CREATE TABLE commands in Supabase

2. **Permission denied errors**:
   - Check that RLS policies are set up correctly
   - Verify environment variables are set

3. **Password authentication fails**:
   - Ensure bcrypt is working correctly
   - Check password hash format in database

4. **Function not found**:
   - Verify Netlify function is deployed
   - Check function logs in Netlify dashboard

### Debug Steps

1. Check Supabase logs in the dashboard
2. Check Netlify function logs
3. Check browser console for JavaScript errors
4. Verify environment variables are accessible

## Migration from localStorage

For existing users stored in localStorage, you can create a migration script:

```sql
-- Example migration script (adjust based on your needs)
-- This would need to be run after exporting localStorage data
```

The system includes automatic fallback to localStorage if the database is unavailable, ensuring backward compatibility during the transition period.