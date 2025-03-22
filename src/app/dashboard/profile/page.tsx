'use client';

// Using ProfileClient directly without the unnecessary wrapper
import ProfileClient from './ProfileClient';
import NoSSR from '@/components/NoSSR';

// Only force dynamic rendering where absolutely necessary
export const dynamic = 'force-dynamic';

export default function ProfilePage() {
  return (
    <NoSSR>
      <ProfileClient />
    </NoSSR>
  );
}
