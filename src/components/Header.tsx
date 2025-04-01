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
      className={`sticky top-0 z-50 transition-all duration-[var(--transition-duration)] ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
      }`}
    >
      <div className="container py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 flex items-center justify-center">
              {/* Simple Ø Grok-like logo */}
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="14" r="12" stroke="black" strokeWidth="2" />
                <line x1="5" y1="14" x2="23" y2="14" stroke="black" strokeWidth="2" />
              </svg>
            </div>
            <h1 className="text-lg font-medium text-black">
              Reality Portal
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation - Simplified Grok-style */}
        <div className="hidden md:flex items-center gap-4">
          {/* Only show essential nav items */}
          <Link
            href="/nehnutelnosti"
            className="text-gray-800 hover:text-black font-medium"
          >
            {t('nav.properties')}
          </Link>
          
          {/* Notification bell */}
          <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </button>
          
          {/* Settings/menu button */}
          <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {/* User avatar or sign in */}
          {user ? (
            <Link href="/dashboard" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
              {user.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-medium">{user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}</span>
              )}
            </Link>
          ) : (
            <Link 
              href="/auth/unified" 
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 overflow-hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button - Keep clean and minimal */}
        <div className="md:hidden flex items-center gap-3">
          {user && (
            <Link href="/dashboard" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
              {user.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-medium">{user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}</span>
              )}
            </Link>
          )}
          
          <button
            className="text-black p-2 rounded-full hover:bg-gray-100 transition-colors"
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
                className="w-5 h-5"
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
                className="w-5 h-5"
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
      </div>

      {/* Mobile Menu - Simplified */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white py-4 border-t border-gray-100 animate-fadeIn">
          <div className="container">
            <nav className="mb-4">
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/"
                    className="block text-gray-800 hover:text-black font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.home')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nehnutelnosti"
                    className="block text-gray-800 hover:text-black font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.properties')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/o-nas"
                    className="block text-gray-800 hover:text-black font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.about')}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/kontakt"
                    className="block text-gray-800 hover:text-black font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.contact')}
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="flex flex-col space-y-3">
              {!user ? (
                <Link
                  href="/auth/unified"
                  className="btn btn-primary w-full justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.signIn')}
                </Link>
              ) : (
                <button
                  onClick={handleSignOut}
                  className="btn btn-outline w-full justify-center text-black border-gray-200"
                >
                  {t('nav.signOut')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
