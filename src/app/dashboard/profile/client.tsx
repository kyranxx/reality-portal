'use client';

import ProfileClient from './ProfileClient';
import NoSSR from '@/components/NoSSR';

export default function ProfileClientWrapper() {
  return (
    <NoSSR>
      <ProfileClient />
    </NoSSR>
  );
}
