// This is a server component that doesn't use client hooks
export const dynamic = 'force-dynamic';

import ProfileClient from './ProfileClient';

export default function ProfilePage() {
  return <ProfileClient />;
}
