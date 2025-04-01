'use client';

import Link from 'next/link';
import { useAuth } from '@/utils/FirebaseAuthContext';
import { useApp } from '@/contexts/AppContext';
import { useState, useEffect } from 'react';

// List of allowed admin emails
const ADMIN_EMAILS = ['admin@example.com', 'admin@realityportal.com'];

export default function Header() {
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase());

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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
      }`}
    >
      <div className="container py-5 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center">
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
            <h1 className="text-xl font-medium text-black">
              Reality Portal
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-12">
            <li>
              <Link
                href="/"
                className="text-gray-600 hover:text-black transition-colors"
              >
                {t('nav.home')}
              </Link>
            </li>
            <li>
              <Link
                href="/nehnutelnosti"
                className="text-gray-600 hover:text-black transition-colors"
              >
                {t('nav.properties')}
              </Link>
            </li>
            <li>
              <Link
                href="/o-nas"
                className="text-gray-600 hover:text-black transition-colors"
              >
                {t('nav.about')}
              </Link>
            </li>
            <li>
              <Link
                href="/kontakt"
                className="text-gray-600 hover:text-black transition-colors"
              >
                {t('nav.contact')}
              </Link>
            </li>
            <li>
              <Link
                href="/design-showcase"
                className="text-gray-600 hover:text-black transition-colors"
              >
                Design
              </Link>
            </li>
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
                {isAdmin && (
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
          className="md:hidden text-black p-1 rounded-full hover:bg-gray-100 transition-colors"
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
        <div className="md:hidden bg-white py-6 animate-fadeIn">
          <div className="container">
            <nav className="mb-8">
              <ul className="space-y-5">
                <li>
                  <Link
                    href="/"
                    className="block text-gray-600 hover:text-black transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.home')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nehnutelnosti"
                    className="block text-gray-600 hover:text-black transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.properties')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/o-nas"
                    className="block text-gray-600 hover:text-black transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.about')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kontakt"
                    className="block text-gray-600 hover:text-black transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.contact')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/design-showcase"
                    className="block text-gray-600 hover:text-black transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Design
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="flex flex-col space-y-4">
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
                  
                  {isAdmin && (
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
                    className="btn btn-outline w-full justify-center text-black"
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
}
