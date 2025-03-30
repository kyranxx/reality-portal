// Simple server component that renders the client component
import UnifiedAuthClient from './UnifiedAuthClient';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function Page() {
  return <UnifiedAuthClient />;
}
