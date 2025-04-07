/**
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
 * - Active link highlighting
 * - User authentication integration
 * - Mobile menu functionality
 */
const HeaderComponent = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  // Removed scroll event handler to make header non-sticky

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
      ? 'text-gray-900 font-medium'
      : 'text-gray-700 hover:text-gray-900';
  };

  return (
    <header className="w-full z-50 relative bg-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Text logo instead of SVG */}
        <Link href="/" className="flex items-center" onClick={closeMobileMenu}>
          <span className="text-2xl font-bold text-gray-900">Reality Portal</span>
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
                className="text-sm px-4 py-2 rounded-full border border-gray-800 text-gray-800 hover:bg-gray-100 transition-colors"
              >
                Pridať nehnuteľnosť
              </Link>
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900">
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
                className="text-gray-700 hover:text-gray-900"
              >
                Prihlásiť sa
              </Link>
              <Link
                href="/auth/register"
                className="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-900 transition-colors"
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
        className={`md:hidden absolute w-full bg-white shadow-lg transition-all duration-300 ease-in-out z-30 ${
          isMobileMenuOpen ? 'max-h-96 py-4' : 'max-h-0 overflow-hidden py-0'
        }`}
      >
        <div className="container mx-auto px-4 flex flex-col space-y-4">
          <Link
            href="/"
            className={`block ${getLinkClass('/')}`}
            onClick={closeMobileMenu}
          >
            Domov
          </Link>
          <Link
            href="/nehnutelnosti"
            className={`block ${getLinkClass('/nehnutelnosti')}`}
            onClick={closeMobileMenu}
          >
            Nehnuteľnosti
          </Link>
          <Link
            href="/o-nas"
            className={`block ${getLinkClass('/o-nas')}`}
            onClick={closeMobileMenu}
          >
            O nás
          </Link>
          <Link
            href="/kontakt"
            className={`block ${getLinkClass('/kontakt')}`}
            onClick={closeMobileMenu}
          >
            Kontakt
          </Link>

          <div className="border-t border-gray-200 pt-4 mt-2">
            {user ? (
              <>
                <Link
                  href="/pridat-nehnutelnost"
                  className="block mb-2 text-center py-2 rounded-full border border-gray-800 text-gray-800 hover:bg-gray-100 transition-colors"
                  onClick={closeMobileMenu}
                >
                  Pridať nehnuteľnosť
                </Link>
                <Link
                  href="/dashboard"
                  className="block py-2 text-gray-700 hover:text-gray-900"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="block py-2 text-gray-700 hover:text-gray-900"
                  onClick={closeMobileMenu}
                >
                  Profil
                </Link>
                <button
                  onClick={() => {
                    if (signOut) signOut();
                    closeMobileMenu();
                  }}
                  className="block w-full text-left py-2 text-gray-700 hover:text-gray-900"
                >
                  Odhlásiť sa
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  href="/auth/login"
                  className="block text-center py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-full"
                  onClick={closeMobileMenu}
                >
                  Prihlásiť sa
                </Link>
                <Link
                  href="/auth/register"
                  className="block text-center py-2 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors"
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

export default HeaderComponent;
