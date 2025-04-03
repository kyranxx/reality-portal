/**
 * Fix Header Component Redundancy
 * 
 * This script consolidates Header.tsx and Header-fixed.tsx into a single component
 * by creating a new unified Header component with the best features of both.
 */

const fs = require('fs');
const path = require('path');

// Define paths
const rootDir = path.resolve(__dirname, '..');
const headerPath = path.join(rootDir, 'src', 'components', 'Header.tsx');
const headerFixedPath = path.join(rootDir, 'src', 'components', 'Header-fixed.tsx');
const layoutsDir = path.join(rootDir, 'src', 'components', 'layouts');
const newHeaderPath = path.join(layoutsDir, 'Header.tsx');
const backupDir = path.join(rootDir, 'backups', 'components');

// Create directories if they don't exist
if (!fs.existsSync(layoutsDir)) {
  fs.mkdirSync(layoutsDir, { recursive: true });
}

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

console.log('Header Components Consolidation');
console.log('------------------------------');

// Check if header components exist
if (!fs.existsSync(headerPath)) {
  console.error(`❌ Header component not found at ${headerPath}`);
  process.exit(1);
}

if (!fs.existsSync(headerFixedPath)) {
  console.error(`❌ Header-fixed component not found at ${headerFixedPath}`);
  process.exit(1);
}

// Read both header files
try {
  const headerContent = fs.readFileSync(headerPath, 'utf8');
  const headerFixedContent = fs.readFileSync(headerFixedPath, 'utf8');

  console.log('✅ Both header files found. Creating a merged version...');

  // Create a consolidated header with improved architecture
  const consolidatedHeader = `'use client';

import Link from 'next/link';
import { useAuth } from '@/utils/FirebaseAuthContext';
import { useApp } from '@/contexts/AppContext';
import { useState, useEffect } from 'react';

// List of allowed admin emails
const ADMIN_EMAILS = ['admin@example.com', 'admin@realityportal.com'];

/**
 * Consolidated Header Component
 * 
 * This component merges the functionality of the original Header.tsx and Header-fixed.tsx
 * components, combining the admin features with improved styling and organization.
 */
export default function Header() {
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Admin functionality from original Header.tsx
  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  
  // Check the current route on client side to determine if we're in admin route
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAdminRoute(window.location.pathname.startsWith('/admin'));
    }
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setUserMenuOpen(false);
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header
      className={\`sticky top-0 z-50 transition-all duration-300 \${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
      }\`}
    >
      <div className="container py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center transition-all duration-300 group-hover:shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-white"
              >
                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
              Reality Portal
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li>
              <Link
                href="/"
                className="text-gray-700 hover:text-primary font-medium py-2 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300"
              >
                {t('nav.home')}
              </Link>
            </li>
            <li>
              <Link
                href="/nehnutelnosti"
                className="text-gray-700 hover:text-primary font-medium py-2 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300"
              >
                {t('nav.properties')}
              </Link>
            </li>
            <li>
              <Link
                href="/o-nas"
                className="text-gray-700 hover:text-primary font-medium py-2 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300"
              >
                {t('nav.about')}
              </Link>
            </li>
            <li>
              <Link
                href="/kontakt"
                className="text-gray-700 hover:text-primary font-medium py-2 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300"
              >
                {t('nav.contact')}
              </Link>
            </li>
            {/* Only show Design link in development environment */}
            {process.env.NODE_ENV === 'development' && (
              <li>
                <Link
                  href="/design-showcase"
                  className="text-gray-700 hover:text-primary font-medium py-2 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-300"
                >
                  Design
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex space-x-4">
          <Link href="/pridat-nehnutelnost" className="btn btn-outline">
            {t('nav.addProperty')}
          </Link>

          {user ? (
            <div className="relative">
              <div className="flex space-x-3">
                <Link href="/dashboard" className="btn btn-primary">
                  {t('nav.myAccount')}
                </Link>
                {/* Only show Admin button if user is admin AND we're in admin route */}
                {isAdmin && isAdminRoute && (
                  <Link href="/admin" className="btn btn-outline">
                    Admin
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <Link href="/auth/unified" className="btn btn-primary">
              {t('nav.signIn')}
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white py-4 border-t border-gray-100 animate-fadeIn">
          <div className="container">
            <nav className="mb-4">
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/"
                    className="block text-gray-700 hover:text-primary font-medium py-2 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.home')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nehnutelnosti"
                    className="block text-gray-700 hover:text-primary font-medium py-2 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.properties')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/o-nas"
                    className="block text-gray-700 hover:text-primary font-medium py-2 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.about')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kontakt"
                    className="block text-gray-700 hover:text-primary font-medium py-2 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.contact')}
                  </Link>
                </li>
                {process.env.NODE_ENV === 'development' && (
                  <li>
                    <Link
                      href="/design-showcase"
                      className="block text-gray-700 hover:text-primary font-medium py-2 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Design
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
            <div className="flex flex-col space-y-2">
              <Link
                href="/pridat-nehnutelnost"
                className="btn btn-outline w-full justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.addProperty')}
              </Link>

              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="btn btn-primary w-full justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.myAccount')}
                  </Link>
                  
                  {/* Admin button in mobile menu */}
                  {isAdmin && isAdminRoute && (
                    <Link
                      href="/admin"
                      className="btn btn-outline w-full justify-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  
                  <button
                    onClick={handleSignOut}
                    className="btn btn-outline w-full justify-center text-red-600 border-red-200 hover:bg-red-50 transition-colors"
                  >
                    {t('nav.signOut')}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/unified"
                    className="btn btn-primary w-full justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.signIn')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}`;

  // Make backups of current headers
  fs.copyFileSync(headerPath, path.join(backupDir, 'Header.tsx.bak'));
  fs.copyFileSync(headerFixedPath, path.join(backupDir, 'Header-fixed.tsx.bak'));
  console.log(`✅ Created backups in ${backupDir}`);

  // Write the new consolidated header
  fs.writeFileSync(newHeaderPath, consolidatedHeader);
  console.log(`✅ Created consolidated Header at ${newHeaderPath}`);

  // Create wrapper files to maintain compatibility
  const headerWrapper = `'use client';

/**
 * @deprecated Import from '@/components/layouts/Header' instead
 */

import Header from '@/components/layouts/Header';
export default Header;`;

  fs.writeFileSync(headerPath, headerWrapper);
  fs.writeFileSync(headerFixedPath, headerWrapper);
  console.log(`✅ Created compatibility wrappers for both header files.`);

  console.log('\n✨ Header components successfully consolidated!');
  console.log('\n⚠️ Consider updating imports in files that use these headers:');
  console.log('   from: import Header from \'@/components/Header\' or \'@/components/Header-fixed\'');
  console.log('   to:   import Header from \'@/components/layouts/Header\'');

} catch (error) {
  console.error(`❌ Error consolidating headers: ${error.message}`);
  process.exit(1);
}
