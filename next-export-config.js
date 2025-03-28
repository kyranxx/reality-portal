/**
 * This file configures which pages should be skipped during static export.
 * It's used by the Next.js build process to determine which pages should not be pre-rendered.
 */

module.exports = {
  // Pages that should be skipped during static export
  // These pages use authentication and should only be rendered on the client
  skipPages: ['/dashboard', '/dashboard/profile', '/admin'],
};
