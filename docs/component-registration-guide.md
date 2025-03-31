# Component Registration Guide

This document explains how to properly register client components in the Reality Portal project to prevent build errors.

## Component Registration System

The project uses a dual-registration system to ensure client components work correctly in all environments:

1. **\_components.tsx** - Contains the `CLIENT_COMPONENTS` registry that defines the type system and dynamic component loading
2. **\_client-loader.tsx** - Contains the `STATIC_COMPONENTS` registry for static resolution in production builds

## Common Errors

The most common error occurs when a component is added to `CLIENT_COMPONENTS` but not to `STATIC_COMPONENTS`, resulting in TypeScript errors like:

```
Property 'YourComponent' does not exist on type '{ ... }'.
```

## Tools for Preventing Registration Errors

### 1. Component Registration Check (Pre-build)

The build process automatically checks for component registration mismatches with:

```bash
npm run validate
```

This runs the `pre-build-component-check.js` script that validates all components are properly registered.

### 2. Component Registration Sync Tool

To manually check for missing component registrations:

```bash
npm run sync-components
```

This will:

- List all components in both registries
- Identify any components missing from `STATIC_COMPONENTS`
- Suggest the exact import statements and registration code to add

### 3. Adding a New Client Component

When adding a new client component:

1. Add the import and export to `_components.tsx`
2. Add the import and registration to `STATIC_COMPONENTS` in `_client-loader.tsx`
3. Run `npm run sync-components` to verify correct registration

## 'use client' Directive Guidelines

The 'use client' directive is required for components that use client-side features like:

- React hooks (useState, useEffect, etc.)
- Browser APIs (document, window, localStorage)
- Event handlers
- Client-side navigation hooks

### Directive Analysis Tool

To analyze components for proper 'use client' directive usage:

```bash
npm run analyze:directives
```

This will identify:

- Components correctly using the directive
- Components that need the directive but don't have it
- Components with unnecessary directives

### Special Cases

Some components require 'use client' by Next.js convention:

- `global-error.tsx`
- `error.tsx`

These may show up as warnings in validation but should keep their directives.

## Best Practices

1. Always run `npm run sync-components` after adding a new client component
2. Include component registration in code reviews
3. Run `npm run type-check` before committing changes to catch registration issues early
4. For significant UI changes, run a full `npm run build` locally before deploying
