# Project Redundancies Analysis Results

## Recently Analyzed Files

### Debug Tools Redundancy

- **`src/utils/debug-tools.js`** and **`public/utils/debug-tools.js`**
  - Both files are identical, containing only re-exports from './debug'
  - Recommendation: Consolidate to one version (preferably in src/utils)

### Header Component Redundancy

- **`src/components/Header-fixed.tsx`** and **`src/components/Header.tsx`**
  - Both files are identical
  - Both are wrappers that re-export from '@/components/layouts/Header'
  - Both are marked as @deprecated
  - Recommendation: Remove both and update imports to use the canonical path

### AuthErrorBoundary Component Differences

- **`src/utils/AuthErrorBoundary.tsx`** and **`src/components/AuthErrorBoundary.tsx`**
  - These are different implementations with different features:
  - The utils version is simpler with basic error handling
  - The components version is more feature-rich with:
    - Firebase auth error detection
    - Development vs production modes
    - Redirect capability
    - Analytics tracking hooks
  - Recommendation: Consolidate to the more robust components version

### ESLint Configuration Redundancy

- **`.eslintrc.js`** and **`.eslintrc.json.bak`**
  - Nearly identical content with only format differences
  - Recommendation: Keep only the modern config and remove backups

## Next Steps

1. Implement test file cleanup (line-ending tests)
2. Consolidate ESLint configuration files
3. Address debug tools redundancy
4. Update component imports to use canonical paths
