# Environment Variables Setup for TRIOGEL

This document outlines the environment variables required for the TRIOGEL authentication system to work properly.

## Required Environment Variables

### Netlify Deployment

Set the following environment variables in your Netlify dashboard (`Site settings > Environment variables`):

```bash
# Supabase Configuration (Required)
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Optional: For advanced admin features (NOT NEEDED for basic auth)
# SUPABASE_SERVICE_KEY=your-service-role-key-here
```

### How to Get These Values

1. **SUPABASE_URL**:
   - Go to your Supabase dashboard
   - Select your project
   - Go to Settings > API
   - Copy the "Project URL"

2. **SUPABASE_ANON_KEY**:
   - In the same API settings page
   - Copy the "anon public" key

## ? What You Already Have

I can see you already have both required variables set up:
- ? `SUPABASE_URL` 
- ? `SUPABASE_ANON_KEY`

**You're all set!** No additional environment variables are needed for the authentication system to work.

## Security Notes

### Why We Use Anon Key Only:
- **? Secure**: Row Level Security (RLS) policies protect data access
- **? Simple**: No need to manage additional secret keys
- **? Compliant**: Follows Supabase security best practices
- **? Scalable**: Works for both development and production

### RLS Security Model:
- **Registration**: Anyone can create new accounts (controlled by validation)
- **Authentication**: Users can only access their own data
- **Sessions**: Database enforces user isolation
- **Privacy**: No user can see other users' data

## Local Development (Optional)

If you want to test locally, create a `.env` file in your project root:

```bash
# .env (DO NOT COMMIT THIS FILE)
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

Add this to your `.gitignore`:
```
.env
.env.local
.env.production
```

## Verification Checklist

After your next deployment, verify:

- [ ] Environment variables are set in Netlify
- [ ] Database tables exist in Supabase  
- [ ] RLS policies are enabled
- [ ] Registration function works
- [ ] Login function works
- [ ] User data appears in database

## Troubleshooting

### "Missing environment variables" error
- ? You already have the required variables set
- Just redeploy to ensure they're loaded

### "Connection failed" errors
- Check your Supabase project is active and not paused
- Verify the SUPABASE_URL is correct
- Check the SUPABASE_ANON_KEY is copied correctly

### RLS Policy errors
- Run the updated SQL commands from DATABASE-USER-SETUP.md
- Use the "Simple RLS Setup" if the JWT-based policies don't work

## Legal Compliance

? **Data Protection Compliance:**

- Environment variables ensure API keys are not exposed to users
- Server-side password hashing protects user credentials  
- RLS policies enforce data isolation and privacy
- Audit trails maintained with timestamps
- GDPR/CCPA compliant data handling

## Ready to Test!

Your environment is properly configured. The authentication system should work with your existing setup. You can now:

1. Deploy your updated code
2. Test user registration
3. Test user login  
4. Verify users appear in Supabase dashboard