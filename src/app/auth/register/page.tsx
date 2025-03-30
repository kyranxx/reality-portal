// Simple server component that renders the client component
import RegisterClient from './RegisterClient';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function Page() {
  return <RegisterClient />;
}
