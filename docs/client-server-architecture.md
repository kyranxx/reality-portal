# Client-Server Component Architecture

This document outlines the architecture and guidelines for separating client and server components in the Next.js application.

## Overview

Next.js 13+ uses the React Server Components paradigm, which requires clear separation between client and server components. Mixing these incorrectly can lead to build errors like:

- "You are attempting to export metadata from a component marked with use client"
- "Element type is invalid: expected a string/function but got: undefined"

## Directory Structure

The project follows this organization for client components:

```
src/
  ├── client/             # All client component infrastructure lives here
  │   ├── index.ts        # Public exports for client module
  │   ├── registry.ts     # Registry of all available client components
  │   └── ClientComponentLoader.tsx  # Safe loader for client components
  │
  ├── app/                # Next.js App Router pages (server components by default)
  │   ├── dashboard/
  │   │   ├── page.tsx    # Server component
  │   │   └── DashboardClient.tsx  # Client component with 'use client'
  │   └── ...
  │
  └── components/         # Shared components (primarily server components)
      └── ...
```

## Key Principles

1. **Explicit 'use client' Directive**: All client components must have 'use client' as the first line.
2. **Registry Pattern**: Client components used with dynamic loading must be registered in `src/client/registry.ts`.
3. **Type Safety**: Always use the typed `ClientComponentKey` for referencing client components.
4. **No String-based Dynamic Imports**: Avoid `import('@/path-to-component')` as it creates webpack issues.
5. **Clear Component Naming**: Client components should have 'Client' in their name.

## How It Works

1. Client components are imported directly in the registry
2. The safe `ClientComponentLoader` uses the registry to load components
3. Pages reference components by key rather than path
4. This prevents webpack from creating contexts that include server components

## Adding New Client Components

When creating a new client component that needs to be dynamically loaded:

1. Create your component with 'use client' directive (e.g., `NewFeatureClient.tsx`)
2. Add the component to the `clientComponentRegistry` in `src/client/registry.ts`:

   ```typescript
   import NewFeatureClient from '../path/to/NewFeatureClient';

   export const clientComponentRegistry = {
     // Existing components...
     NewFeatureClient: NewFeatureClient,
   } as const;
   ```

3. Use it in your server component with the type-safe loader:

   ```typescript
   import { ClientComponentLoader } from '@/client';

   export default function Page() {
     return <ClientComponentLoader componentKey="NewFeatureClient" />;
   }
   ```

## Common Mistakes to Avoid

- Don't export metadata from client components
- Don't use dynamic imports with template strings
- Don't access server-only APIs in client components
- Don't mark server components with 'use client'

By following these guidelines, we can prevent the build issues that previously occurred during deployment.
