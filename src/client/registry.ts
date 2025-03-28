'use client';

// Import all client components
import DashboardClient from '../app/dashboard/DashboardClient';
import ProfileClient from '../app/dashboard/profile/ProfileClient';
import AdminClient from '../app/admin/AdminClient';
import HomeClient from '../app/HomeClient';

/**
 * Registry of all available client components
 * This approach ensures type safety and prevents accidentally loading server components
 */
export const clientComponentRegistry = {
  // Dashboard components
  DashboardClient: DashboardClient,
  ProfileClient: ProfileClient,
  // Admin components
  AdminClient: AdminClient,
  // Home page component
  HomeClient: HomeClient,
} as const;

// Create a type from the registry keys for type safety
export type ClientComponentKey = keyof typeof clientComponentRegistry;
