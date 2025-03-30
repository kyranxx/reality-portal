// Simple server component that renders the client component
import ResetPasswordClient from './ResetPasswordClient';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function Page() {
  return <ResetPasswordClient />;
}
