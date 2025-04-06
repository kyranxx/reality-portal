# Firebase Connection Fixes

This document outlines issues with Firebase connections and their solutions.

## Issues Identified

1. **Realtime Database URL Region Issue**

   - Error: `FIREBASE WARNING: Please change your database URL to https://realitny-portal-default-rtdb.europe-west1.firebasedatabase.app`
   - The Firebase Realtime Database was created in Europe West region, but the code was using the default URL without region

2. **Firestore Permissions Issue**
   - Error: `Missing or insufficient permissions`
   - Firestore security rules were set to deny all access (`allow read, write: if false`)

## Solutions Implemented

### 1. Database URL Fix

Updated the Firebase configuration in `src/utils/firebase/config.ts` to include the correct regional URL:

```typescript
export const firebaseConfig = {
  // Other config properties...
  databaseURL:
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
    'https://realitny-portal-default-rtdb.europe-west1.firebasedatabase.app',
};
```

Added the environment variable to `.env.example` for future reference:

```
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your-project-id-default-rtdb.europe-west1.firebasedatabase.app
```

### 2. Firestore Security Rules

Updated the Firestore security rules in Firebase Console to:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

This allows:

- Anyone to read data (no authentication required)
- Only authenticated users to write data

### 3. Testing Firebase Connections

Added a test script (`scripts/test-firebase-connection.js`) to verify both Firestore and Realtime Database connections.

To run the test:

```
node scripts/test-firebase-connection.js
```

## Future Considerations

1. **Environment Variables**: Ensure `.env.local` includes the correct regional URL for the Realtime Database:

   ```
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://realitny-portal-default-rtdb.europe-west1.firebasedatabase.app
   ```

2. **Security Rules**: The current rules allow public reading of all data. For production, consider more restrictive rules based on your security requirements.

3. **Monitoring**: Consider implementing better error handling and monitoring for Firebase connection issues.
