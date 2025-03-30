// Simple server component that renders the client component
import LoginClient from './LoginClient';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function Page() {
  return <LoginClient />;
}
