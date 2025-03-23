/**
 * STATIC CLIENT COMPONENTS EXPORT
 * 
 * This file provides explicit exports of all client components to avoid dynamic import issues in production.
 * No dynamic imports or path aliases are used here to ensure compatibility with all build environments.
 */

// Import client components
import HomeClientComponent from './HomeClient';
import DashboardClientComponent from './dashboard/DashboardClient';
import ProfileClientComponent from './dashboard/profile/ProfileClient';
import AdminClientComponent from './admin/AdminClient';

// Re-export them directly
export const HomeClient = HomeClientComponent;
export const DashboardClient = DashboardClientComponent;
export const ProfileClient = ProfileClientComponent;
export const AdminClient = AdminClientComponent;

// Map of all available client components for static resolution
export const CLIENT_COMPONENTS = {
  'HomeClient': HomeClientComponent,
  'DashboardClient': DashboardClientComponent,
  'ProfileClient': ProfileClientComponent,
  'AdminClient': AdminClientComponent,
};

// Type for client component keys
export type ClientComponentKey = keyof typeof CLIENT_COMPONENTS;
