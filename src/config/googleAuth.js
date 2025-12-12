// Google OAuth Configuration
// For demo purposes, we'll use a placeholder
export const GOOGLE_CLIENT_ID = "demo-client-id-placeholder";

// In production, you would:
// 1. Go to https://console.cloud.google.com/
// 2. Create a new project or select existing one
// 3. Enable Google+ API
// 4. Create OAuth 2.0 credentials
// 5. Add your domain to authorized origins
// 6. Copy the Client ID here

export const GOOGLE_SCOPE = "profile email";

export const GOOGLE_REDIRECT_URI = window.location.origin;

// Demo mode flag - Set to false to use real authentication
export const DEMO_MODE = false;
