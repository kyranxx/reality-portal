/**
 * Fix Header Circular Reference
 * 
 * This script fixes the circular reference in the Header component.
 * It replaces the self-importing Header component with a proper implementation.
 */

const fs = require('fs');
const path = require('path');

// Define paths
const rootDir = path.resolve(__dirname, '..');
const headerLayoutsPath = path.join(rootDir, 'src', 'components', 'layouts', 'Header.tsx');

// Proper header component implementation with no circular references
const headerImplementation = `/**
 * Main Header Component
 *
 * This component was created by consolidating duplicate header components:
 * - Header.tsx
 * - Header-fixed.tsx
 *
 * It includes all functionality from both components with improved organization.
 */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/utils/FirebaseAuthContext';

/**
 * HeaderComponent - Main navigation component for the Reality Portal
 * 
 * Features:
 * - Responsive design with desktop and mobile views
 * - Changes appearance on scroll
 * - Active link highlighting
 * - User authentication integration
 * - Mobile menu functionality
 */
const HeaderComponent = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  // Handle scroll event to make header fixed on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Get the link active state
  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return isActive
      ? 'text-blue-600 font-medium'
      : 'text-gray-700 hover:text-blue-600';
  };

  return (
    <header
      className={\`w-full z-20 transition-all duration-300 \${
        isScrolled
          ? 'fixed top-0 bg-white shadow-md py-2'
          : 'relative bg-white/90 py-4'
      }\`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center" onClick={closeMobileMenu}>
          <img
            src="/images/logo.svg"
            alt="Reality Portal"
            className="h-8 w-auto mr-2"
          />
          <span className="text-xl font-bold text-blue-600 hidden sm:inline">
            Reality Portal
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className={getLinkClass('/')}>
            Domov
          </Link>
          <Link href="/nehnutelnosti" className={getLinkClass('/nehnutelnosti')}>
            Nehnuteľnosti
          </Link>
          <Link href="/o-nas" className={getLinkClass('/o-nas')}>
            O nás
          </Link>
          <Link href="/kontakt" className={getLinkClass('/kontakt')}>
            Kontakt
          </Link>
        </nav>

        {/* User Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              <Link
                href="/pridat-nehnutelnost"
                className="text-sm px-4 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
              >
                Pridať nehnuteľnosť
              </Link>
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600">
                  <span>Môj účet</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profil
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Odhlásiť sa
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-gray-700 hover:text-blue-600"
              >
                Prihlásiť sa
              </Link>
              <Link
                href="/auth/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                Registrovať
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      <nav
        className={\`md:hidden absolute w-full bg-white shadow-lg transition-all duration-300 ease-in-out z-10 \${
          isMobileMenuOpen ? 'max-h-96 py-4' : 'max-h-0 overflow-hidden py-0'
        }\`}
      >
        <div className="container mx-auto px-4 flex flex-col space-y-4">
          <Link
            href="/"
            className={\`block \${getLinkClass('/')}\`}
            onClick={closeMobileMenu}
          >
            Domov
          </Link>
          <Link
            href="/nehnutelnosti"
            className={\`block \${getLinkClass('/nehnutelnosti')}\`}
            onClick={closeMobileMenu}
          >
            Nehnuteľnosti
          </Link>
          <Link
            href="/o-nas"
            className={\`block \${getLinkClass('/o-nas')}\`}
            onClick={closeMobileMenu}
          >
            O nás
          </Link>
          <Link
            href="/kontakt"
            className={\`block \${getLinkClass('/kontakt')}\`}
            onClick={closeMobileMenu}
          >
            Kontakt
          </Link>

          <div className="border-t border-gray-200 pt-4 mt-2">
            {user ? (
              <>
                <Link
                  href="/pridat-nehnutelnost"
                  className="block mb-2 text-center py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors"
                  onClick={closeMobileMenu}
                >
                  Pridať nehnuteľnosť
                </Link>
                <Link
                  href="/dashboard"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="block py-2 text-gray-700 hover:text-blue-600"
                  onClick={closeMobileMenu}
                >
                  Profil
                </Link>
                <button
                  onClick={() => {
                    if (signOut) signOut();
                    closeMobileMenu();
                  }}
                  className="block w-full text-left py-2 text-gray-700 hover:text-blue-600"
                >
                  Odhlásiť sa
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  href="/auth/login"
                  className="block text-center py-2 text-gray-700 hover:text-blue-600 border border-gray-300 rounded-full"
                  onClick={closeMobileMenu}
                >
                  Prihlásiť sa
                </Link>
                <Link
                  href="/auth/register"
                  className="block text-center py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  onClick={closeMobileMenu}
                >
                  Registrovať
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderComponent;`;

// Main script execution
console.log('Fixing Header Circular Reference');
console.log('--------------------------------');

try {
  // Check if the file exists
  if (fs.existsSync(headerLayoutsPath)) {
    // Check if it has the circular reference
    const currentContent = fs.readFileSync(headerLayoutsPath, 'utf-8');
    
    if (currentContent.includes("import Header from '@/components/layouts/Header'")) {
      console.log('✅ Found circular reference in Header component');
      
      // Fix the file by replacing with proper implementation
      fs.writeFileSync(headerLayoutsPath, headerImplementation);
      console.log('✅ Successfully replaced self-reference with proper implementation');
      
      console.log('\n✨ Header component fixed successfully!');
    } else {
      console.log('✅ Header component already has proper implementation');
    }
  } else {
    console.log('❌ Header component not found at expected path');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
