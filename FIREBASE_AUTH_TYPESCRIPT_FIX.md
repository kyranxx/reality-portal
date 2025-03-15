# Firebase Auth and TypeScript Fix

## Issues

The Vercel deployment was failing with two main issues:

1. Firebase auth import errors:

```
Attempted import error: 'createUserWithEmailAndPassword' is not exported from 'firebase/auth'
```

2. TypeScript type definitions missing:

```
It looks like you're trying to use TypeScript but do not have the required package(s) installed.
Please install @types/react
```

## Solutions

### 1. Firebase Auth Imports

We implemented a dual approach to fix the Firebase auth import issues:

1. Added `@firebase/auth` as a direct dependency in package.json:

```json
"dependencies": {
  "@firebase/auth": "^1.5.1",
  "firebase": "^10.7.0",
}
```

2. Updated imports in FirebaseAuthContext.tsx and firebase.ts to use '@firebase/auth' for auth functions:

```typescript
import { User, onAuthStateChanged, Auth } from 'firebase/auth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from '@firebase/auth';
```

3. Modified build-vercel.js to explicitly install @firebase/auth during the build process:

```javascript
// Ensure correct Firebase version and auth package are installed
console.log('Ensuring correct Firebase version and auth package...');
execSync('npm install firebase@10.7.0 @firebase/auth --save', { stdio: 'inherit' });
```

### 2. TypeScript Type Definitions

Moved TypeScript type definitions from devDependencies to regular dependencies in package.json:

```json
"dependencies": {
  "@types/node": "^20.11.0",
  "@types/react": "^18.2.0",
  "@types/react-dom": "^18.2.0",
}
```

This ensures that the type definitions are available during the Vercel build process, even if devDependencies are skipped.

## Why This Fix Works

1. By explicitly installing `@firebase/auth` and using its imports, we ensure that the auth functions are available regardless of the Firebase version being used.

2. Moving TypeScript type definitions to regular dependencies ensures they're installed during the Vercel build process.

3. The explicit installation in build-vercel.js provides an additional layer of protection, ensuring that the required packages are available during the build.

## Verification

After implementing these changes, the Vercel build should complete successfully without the Firebase auth import errors or TypeScript type definition errors.
