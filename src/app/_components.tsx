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
import PropertyDetailClientComponent from './nehnutelnosti/[id]/PropertyDetailClient';
import ONasClientComponent from './o-nas/ONasClient';
import KontaktClientComponent from './kontakt/KontaktClient';
import NehnutelnostiClientComponent from './nehnutelnosti/NehnutelnostiClient';
import OchranaOsobnychUdajovClientComponent from './ochrana-osobnych-udajov/OchranaOsobnychUdajovClient';
import PodmienkyPouzitiaClientComponent from './podmienky-pouzitia/PodmienkyPouzitiaClient';
import CookiesClientComponent from './cookies/CookiesClient';

// Re-export them directly
export const HomeClient = HomeClientComponent;
export const DashboardClient = DashboardClientComponent;
export const ProfileClient = ProfileClientComponent;
export const AdminClient = AdminClientComponent;
export const PropertyDetailClient = PropertyDetailClientComponent;
export const ONasClient = ONasClientComponent;
export const KontaktClient = KontaktClientComponent;
export const NehnutelnostiClient = NehnutelnostiClientComponent;
export const OchranaOsobnychUdajovClient = OchranaOsobnychUdajovClientComponent;
export const PodmienkyPouzitiaClient = PodmienkyPouzitiaClientComponent;
export const CookiesClient = CookiesClientComponent;

// Map of all available client components for static resolution
export const CLIENT_COMPONENTS = {
  HomeClient: HomeClientComponent,
  DashboardClient: DashboardClientComponent,
  ProfileClient: ProfileClientComponent,
  AdminClient: AdminClientComponent,
  PropertyDetailClient: PropertyDetailClientComponent,
  ONasClient: ONasClientComponent,
  KontaktClient: KontaktClientComponent,
  NehnutelnostiClient: NehnutelnostiClientComponent,
  OchranaOsobnychUdajovClient: OchranaOsobnychUdajovClientComponent,
  PodmienkyPouzitiaClient: PodmienkyPouzitiaClientComponent,
  CookiesClient: CookiesClientComponent,
};

// Type for client component keys
export type ClientComponentKey = keyof typeof CLIENT_COMPONENTS;
