'use client';

// Using DashboardClient directly without the unnecessary wrapper
import DashboardClient from './DashboardClient';
import NoSSR from '@/components/NoSSR';

// Only force dynamic rendering where absolutely necessary
export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <NoSSR>
      <DashboardClient />
    </NoSSR>
  );
}
