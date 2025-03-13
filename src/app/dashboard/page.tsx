// This is a server component that doesn't use client hooks
export const dynamic = 'force-dynamic';

import DashboardClient from './DashboardClient';

export default function DashboardPage() {
  return <DashboardClient />;
}
