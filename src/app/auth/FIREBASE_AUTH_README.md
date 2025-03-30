# Firebase Authentication Configuration

This document provides information about setting up Firebase Authentication in the Reality Portal application.

## Required Environment Variables

The following environment variables need to be set for authentication to work properly:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Setting Up Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. In the Firebase console, navigate to "Authentication" and enable the following providers:
   - Email/Password
   - Google (if you want to support Google sign-in)
4. Make sure to set up the allowed domains in the "Settings" > "Authorized domains" section
5. Set up your project's `.env.local` file with the configuration values from your Firebase project settings

## Testing Authentication

During development, you might encounter an "API key not valid" error if proper Firebase credentials are not configured. This is expected behavior when using placeholder values.

For local development, you can enable Firebase emulators by setting:

```
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
```

in your `.env.local` file.

## Firebase Authentication Features

The authentication system provides the following features:

1. User login with email/password
2. User registration
3. Password reset via email
4. Social authentication (Google)
5. Protected routes with automatic redirects
6. Session persistence

## Component Structure

- `FirebaseAuthContext.tsx` - Provides authentication state and methods
- `firebase-service.ts` - Service layer for Firebase operations with error handling
- Auth components in `/src/components/auth/` provide the UI for the authentication system
- Auth pages in `/src/app/auth/` implement the different authentication flows
