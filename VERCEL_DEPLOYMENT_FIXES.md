# Vercel Deployment Fixes

## Issues and Solutions

### 1. Missing TailwindCSS Module

**Issue:**

```
Error: Cannot find module 'tailwindcss'
```

**Solution:**
Moved TailwindCSS from devDependencies to regular dependencies in package.json:

```json
"dependencies": {
  "tailwindcss": "^3.4.0"
}
```

### 2. Missing @next/bundle-analyzer Module

**Issue:**

```
Error: Cannot find module '@next/bundle-analyzer'
```

**Solution:**
Moved @next/bundle-analyzer from devDependencies to regular dependencies in package.json:

```json
"dependencies": {
  "@next/bundle-analyzer": "^15.2.2"
}
```

### 3. Missing null-loader Module

**Issue:**

```
Module not found: Can't resolve 'null-loader'
```

**Solution:**
Moved null-loader from devDependencies to regular dependencies in package.json:

```json
"dependencies": {
  "null-loader": "^4.0.1"
}
```

### 4. npm install --include=dev Not Working as Expected

**Issue:**
The `--include=dev` flag wasn't properly installing devDependencies in the Vercel environment.

**Solution:**
Updated build-vercel.js to use `--production=false` instead, which is more widely supported:

```javascript
// Ensure all dependencies are installed, including devDependencies
console.log('Ensuring all dependencies are installed...');
execSync('npm install --production=false', { stdio: 'inherit' });
```

### 5. Firebase Auth Import Issues

**Issue:**

```
Module not found: Can't resolve '@firebase/auth'
```

**Solution:**
Reverted to using 'firebase/auth' imports instead of '@firebase/auth':

In FirebaseAuthContext.tsx:

```typescript
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  Auth,
} from 'firebase/auth';
```

In firebase.ts:

```typescript
import { getAuth, connectAuthEmulator } from 'firebase/auth';
```

## Summary of Changes

1. Moved key build dependencies from devDependencies to regular dependencies
2. Updated npm install command in build-vercel.js to ensure all dependencies are installed
3. Reverted Firebase auth imports to use 'firebase/auth' instead of '@firebase/auth'

These changes ensure that all necessary modules are available during the Vercel build process, resolving the deployment errors.
