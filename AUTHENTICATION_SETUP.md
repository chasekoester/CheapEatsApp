# Authentication Setup Guide

This guide will help you set up Google OAuth authentication for CheapEats, enabling users to sign in and save their favorite deals.

## Prerequisites

- Existing Google Cloud Project (from Google Sheets setup)
- Access to Google Cloud Console

## Step 1: Enable Google OAuth API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your existing project (the one used for Google Sheets)
3. Navigate to **APIs & Services** → **Library**
4. Search for "Google+ API" or "Google OAuth2 API" and enable it

## Step 2: Create OAuth 2.0 Credentials

1. In Google Cloud Console, go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. If prompted, configure the OAuth consent screen:
   - Choose **External** user type
   - Fill in required fields:
     - App name: "CheapEats"
     - User support email: Your email
     - App logo: Optional
     - Developer contact information: Your email
   - Add scopes: `email`, `profile`, `openid`
   - Add test users (your email addresses)

4. Create OAuth client ID:
   - Application type: **Web application**
   - Name: "CheapEats Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `https://your-app-name.netlify.app` (for production)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://your-app-name.netlify.app/api/auth/callback/google` (for production)

5. Click **Create** and copy the credentials:
   - Client ID
   - Client Secret

## Step 3: Generate NextAuth Secret

Run this command to generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

Or use an online generator to create a 32-character random string.

## Step 4: Update Environment Variables

Add these variables to your `.env.local` file (for development) or environment settings (for production):

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret_here
```

For production (Netlify), update the `NEXTAUTH_URL` to your deployed URL:
```env
NEXTAUTH_URL=https://your-app-name.netlify.app
```

## Step 5: OAuth Consent Screen (Important for Production)

For production deployment, you'll need to:

1. Complete the OAuth consent screen setup in Google Cloud Console
2. Add your production domain to authorized domains
3. Submit for verification if you plan to have more than 100 users

For development and testing, the app will work with unverified status for a limited number of test users.

## Step 6: Test Authentication

1. Start your development server: `npm run dev`
2. Navigate to your app
3. Click "Sign In with Google"
4. Complete the OAuth flow
5. Verify that:
   - User can sign in successfully
   - User profile is created
   - User can favorite deals
   - User can subscribe to newsletter

## Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch" error**
   - Ensure your redirect URIs in Google Cloud Console exactly match your app URLs
   - Check for trailing slashes and http vs https

2. **"This app isn't verified" warning**
   - Normal for development and testing
   - For production, complete OAuth consent screen verification

3. **NextAuth callback errors**
   - Verify NEXTAUTH_URL matches your current environment
   - Check that NEXTAUTH_SECRET is set and consistent

4. **Session not persisting**
   - Ensure cookies are enabled in your browser
   - Check that NEXTAUTH_URL and domains match

### Environment Variables Checklist:

- [ ] `GOOGLE_CLIENT_ID` - OAuth client ID from Google Cloud Console
- [ ] `GOOGLE_CLIENT_SECRET` - OAuth client secret from Google Cloud Console  
- [ ] `NEXTAUTH_URL` - Your app's base URL
- [ ] `NEXTAUTH_SECRET` - Random 32-character string

## Security Notes

- Never commit OAuth credentials to version control
- Use different OAuth clients for development and production
- Regularly rotate your NEXTAUTH_SECRET
- Keep your Google Cloud Console project secure

## Features Enabled by Authentication

Once authentication is set up, users can:

- ✅ Sign in with their Google account
- ✅ Save deals to their favorites
- ✅ View their profile with saved deals
- ✅ Subscribe to the newsletter with their account info
- ✅ Remove deals from favorites
- ✅ Manage newsletter subscription

The authentication system uses NextAuth.js with JWT strategy for optimal performance with static hosting on Netlify.
