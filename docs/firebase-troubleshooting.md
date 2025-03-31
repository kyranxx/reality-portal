# Firebase Troubleshooting Guide

## Summary of Issues

Based on our diagnostics and tests, we've identified several issues with the Firebase setup:

1. **Authentication Issues**: Anonymous authentication is failing with `auth/admin-restricted-operation` error
2. **Firestore Permissions**: Despite simplified rules, we're getting `permission-denied` errors
3. **Rules Deployment**: Unable to deploy updated rules via Firebase CLI

## Recommended Solutions

### 1. Firebase Console Settings

Since we can't deploy rules via CLI, please make these changes in Firebase Console:

1. **Update Firestore Rules**:

   - Go to [Firebase Console](https://console.firebase.google.com/) and open project `realitny-portal`
   - Navigate to Firestore Database → Rules
   - Replace the rules with our simplified test rules from `firebase.rules`
   - Click "Publish"

2. **Fix Authentication Settings**:

   - Go to Authentication → Sign-in method
   - Enable "Anonymous" authentication if you want to test with anonymous users
   - Alternatively, use Email/Password or other methods you've enabled

3. **Check Project Settings**:
   - Go to Project Settings → General
   - Verify the Project ID matches what's in `.env.local`
   - Check if the project is in good standing (no billing issues)

### 2. Code-Level Changes Already Made

We've already made several code improvements:

1. **Added better initialization checks** in `src/utils/firebase.ts`
2. **Enhanced error reporting** in `src/services/propertyService.ts`
3. **Added fallback mechanism** to sample data when Firebase fails
4. **Created diagnostic tools** like `scripts/firebase-connection-test.js`

### 3. Data Access Patterns

The errors suggest problems with how/when data is being accessed:

1. **Authentication/Firestore Race Condition**:

   - Ensure auth state is established before accessing Firestore data
   - Our FirebaseProvider.tsx improvements should help with this

2. **Collection Path Issues**:
   - Double-check all collection paths match exactly what's in Firestore
   - Current paths we're using: `properties`, `users`, `userSettings`, etc.

### 4. Quick Test After Changes

After making changes in Firebase Console:

1. Run the diagnostic script:

   ```
   node scripts/firebase-connection-test.js
   ```

2. Check browser console messages after loading the app to see if permission issues are resolved

## Common Firebase Errors and Solutions

| Error Code                        | Description                              | Solution                         |
| --------------------------------- | ---------------------------------------- | -------------------------------- |
| `permission-denied`               | Firestore security rules blocking access | Update rules in Firebase Console |
| `auth/admin-restricted-operation` | Anonymous auth disabled                  | Enable in Firebase Console       |
| `not-initialized`                 | Firestore accessed before initialization | Wait for `waitForFirebaseInit()` |
| `missing-credentials`             | No auth token for firebase operation     | Ensure auth state established    |

## Long-Term Recommendations

1. **Implement proper user authentication** instead of relying on anonymous auth
2. **Create separate test/production environments**
3. **Use Firebase Emulators** for local development
4. **Add comprehensive error boundaries** in UI components
