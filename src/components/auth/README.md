# Authentication Components

This directory contains reusable authentication UI components built with React, TypeScript, and Tailwind CSS.

## Component Architecture

The components follow a server/client component pattern to properly respect Next.js App Router's server/client boundaries:

1. **Server Components**: Located in the root directory (`/src/components/auth/`), these components accept only serializable props and act as wrappers that delegate to client components.

2. **Client Components**: Located in the client directory (`/src/components/auth/client/`), these components are marked with `'use client'` directive and handle non-serializable functionality like event handlers.

This pattern ensures that non-serializable props like `onChange` and `onClick` handlers are never passed across the server/client boundary, which prevents TypeScript serialization warnings.

## Components Overview

### Server Components

- **FormInput**: Text input for forms (delegates to FormInputClient)
- **PasswordInput**: Password input with security features (delegates to PasswordInputClient)
- **AuthButton**: Styled button for forms (delegates to AuthButtonClient)
- **SocialAuthButton**: Provider-specific buttons (delegates to SocialAuthButtonClient)
- **ProtectedRouteWrapper**: Route guard for authentication state

### Client Components

- **FormInputClient**: Handles input events and rendering
- **PasswordInputClient**: Handles password visibility, strength meter, and events
- **AuthButtonClient**: Handles button click events and loading states
- **SocialAuthButtonClient**: Handles social authentication provider events

## Usage Example

```tsx
// In a server component or page
import { FormInput } from '@/components/auth/FormInput';
import { useState } from 'react';

('use client');

export default function LoginForm() {
  const [email, setEmail] = useState('');

  return (
    <form>
      <FormInput
        id="email"
        type="email"
        label="Email Address"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      {/* Other form elements */}
    </form>
  );
}
```

## Benefits of this Architecture

1. **Proper Server/Client Boundaries**: Clear separation between server and client components
2. **No TypeScript Warnings**: Function props never cross serialization boundaries
3. **Simplified Prop Types**: Server components only need serializable props
4. **Maintainability**: Clear pattern that can be applied consistently
5. **Performance**: Enables proper code-splitting and reduced client JavaScript
