# Google OAuth Configuration Instructions

## Issue: Random String Instead of "SukuSuku.ai"

Currently, the Google OAuth consent screen shows a random string (like "c1ba9609-94a3-4895-8d7d-a2f5a0c196c7-00-1q7j60lf4r7la.riker.replit.dev") instead of "SukuSuku.ai".

## Root Cause

Google displays the domain name or project ID for **unverified apps** to prevent phishing attempts. Only verified apps show their custom app name.

## Solution Steps

### 1. Access Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one if needed)
3. Navigate to **APIs & Services** → **OAuth consent screen**

### 2. Configure OAuth Consent Screen
1. Click **"Edit App"**
2. In **App Information** section:
   - **App name**: Enter "SukuSuku.ai"
   - **User support email**: Enter your support email
   - **App logo**: Upload SukuSuku.ai logo (optional but recommended)
3. In **Developer contact information**:
   - Add your email address

### 3. Configure Authorized Domains
1. Add your domain to **Authorized domains**:
   - Add your Replit domain (e.g., `your-repl-name.replit.app`)
   - Add any custom domains you use

### 4. Submit for Verification
1. Complete all required fields in the OAuth consent screen
2. Click **"Submit for verification"**
3. Wait for Google's approval (can take a few days to weeks)

## Temporary Workaround

While waiting for verification, the consent screen will continue to show the domain name. This is expected behavior and doesn't affect functionality.

## Important Notes

- **Verification is required** for custom app names to display
- **Domain ownership verification** through Google Search Console may be needed
- **Clear branding** that represents your actual business is essential
- The app will function normally during the verification process

## Current Status

✅ OAuth functionality is working correctly
⚠️ Verification pending to show "SukuSuku.ai" instead of domain name

## Next Steps

1. Follow the configuration steps above
2. Submit for verification
3. Once approved, users will see "SukuSuku.ai" on the consent screen