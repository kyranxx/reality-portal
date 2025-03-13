// This is a server component that doesn't use client hooks
export const dynamic = 'force-dynamic';

// Use the app directory's automatic static optimization instead of edge runtime
// which can cause issues with authentication during server-side rendering
// export const runtime = 'edge';

import ProfileClient from './ProfileClient';

export default function ProfilePage() {
  return <ProfileClient />;
}
