'use client';

import DashboardClient from './DashboardClient';
import NoSSR from '@/components/NoSSR';

export default function DashboardClientWrapper() {
  return (
    <NoSSR>
      <DashboardClient />
    </NoSSR>
  );
}
