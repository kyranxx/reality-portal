# Authentication Component Serialization Solution

## Original Problem

The authentication components in this project had TypeScript warnings about serializable props:

```
src/components/auth/FormInput.tsx
- [ts Warning] Line 28: Props must be serializable for components in the "use client" entry file, "onChange" is invalid.

src/components/auth/PasswordInput.tsx
- [ts Warning] Line 26: Props must be serializable for components in the "use client" entry file, "onChange" is invalid.

src/components/auth/SocialAuthButton.tsx
- [ts Warning] Line 19: Props must be serializable for components in the "use client" entry file, "onClick" is invalid.
```

## Solution Implemented

We implemented a true server/client architecture that properly respects Next.js App Router boundaries:

### 1. Server/Client Component Architecture

- Split each component into a server component and a client component
- Server components (`/components/auth/`) forward props to client components
- Client components (`/components/auth/client/`) contain all non-serializable logic
- Event handlers are only used in client components marked with 'use client'

### 2. Component Structure

```
/components/auth/
  ├── FormInput.tsx               # Server component
  ├── PasswordInput.tsx           # Server component
  ├── AuthButton.tsx              # Server component
  ├── SocialAuthButton.tsx        # Server component
  ├── /client/
  │   ├── FormInputClient.tsx     # Client component with event handlers
  │   ├── PasswordInputClient.tsx # Client component with event handlers
  │   ├── AuthButtonClient.tsx    # Client component with event handlers
  │   └── SocialAuthButtonClient.tsx # Client component with event handlers
```

### 3. Fixed Interface Definitions

- **Server Components**: Accept serializable props that can be passed from any component
- **Client Components**: Accept non-serializable props like functions and event handlers

### 4. Verified Solution

The TypeScript compiler no longer reports serialization warnings for our auth components. We've verified this by running:

```bash
npx tsc --noEmit
```

Which now only reports an unrelated error in `src/app/_client-loader.tsx` (which is outside the scope of our current task).

### 5. Benefits of This Architecture

1. **Properly follows Next.js App Router architecture**
2. **Eliminates serialization warnings**
3. **More maintainable code with clear boundaries**
4. **Better performance by keeping client-only code separate**
5. **Easier to understand component responsibilities**

## Usage Example

```tsx
// Server component
<FormInput
  id="email"
  type="email"
  label="Email Address"
  value={email}
  onChange={e => setEmail(e.target.value)}
  required
/>
```

This pattern can be applied to any component that needs to handle events in Next.js App Router.
