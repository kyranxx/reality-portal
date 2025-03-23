'use client';

// Export the client component registry and types
export { clientComponentRegistry, type ClientComponentKey } from './registry';

// Export the ClientComponentLoader component
export { default as ClientComponentLoader } from './ClientComponentLoader';

/**
 * This index file provides a clean export interface for client components.
 * It allows importing from '@/client' instead of individual files.
 * 
 * Example usage:
 * ```
 * // Server component
 * import { ClientComponentLoader } from '@/client';
 * 
 * export default function Page() {
 *   return <ClientComponentLoader componentKey="DashboardClient" />;
 * }
 * ```
 */
