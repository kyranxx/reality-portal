'use client';

import Link from 'next/link';
import { useAuth } from '@/utils/AuthContext';
import { useState } from 'react';

export default function Header() {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

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
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Reality Portal</h1>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li><Link href="/" className="text-gray-700 hover:text-primary font-medium">Domov</Link></li>
            <li><Link href="/nehnutelnosti" className="text-gray-700 hover:text-primary font-medium">Nehnuteľnosti</Link></li>
            <li><Link href="/o-nas" className="text-gray-700 hover:text-primary font-medium">O nás</Link></li>
            <li><Link href="/kontakt" className="text-gray-700 hover:text-primary font-medium">Kontakt</Link></li>
          </ul>
        </nav>
        
        {/* Desktop Buttons */}
        <div className="hidden md:flex space-x-4">
          <Link href="/pridat-nehnutelnost" className="btn btn-outline">
            Pridať inzerát
          </Link>
          
          {user ? (
            <div className="relative">
              <button 
                className="btn btn-primary flex items-center"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <span className="mr-2">Môj účet</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link 
                    href="/dashboard" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/dashboard/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Profil
                  </Link>
                  <Link 
                    href="/admin" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Admin
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Odhlásiť sa
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login" className="btn btn-primary">
              Prihlásiť sa
            </Link>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4">
          <div className="container">
            <nav className="mb-4">
              <ul className="space-y-4">
                <li><Link href="/" className="block text-gray-700 hover:text-primary font-medium" onClick={() => setMobileMenuOpen(false)}>Domov</Link></li>
                <li><Link href="/nehnutelnosti" className="block text-gray-700 hover:text-primary font-medium" onClick={() => setMobileMenuOpen(false)}>Nehnuteľnosti</Link></li>
                <li><Link href="/o-nas" className="block text-gray-700 hover:text-primary font-medium" onClick={() => setMobileMenuOpen(false)}>O nás</Link></li>
                <li><Link href="/kontakt" className="block text-gray-700 hover:text-primary font-medium" onClick={() => setMobileMenuOpen(false)}>Kontakt</Link></li>
              </ul>
            </nav>
            <div className="flex flex-col space-y-2">
              <Link href="/pridat-nehnutelnost" className="btn btn-outline w-full justify-center" onClick={() => setMobileMenuOpen(false)}>
                Pridať inzerát
              </Link>
              
              {user ? (
                <>
                  <Link href="/dashboard" className="btn btn-primary w-full justify-center" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link href="/dashboard/profile" className="btn btn-outline w-full justify-center" onClick={() => setMobileMenuOpen(false)}>
                    Profil
                  </Link>
                  <Link href="/admin" className="btn btn-outline w-full justify-center" onClick={() => setMobileMenuOpen(false)}>
                    Admin
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="btn btn-outline w-full justify-center text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Odhlásiť sa
                  </button>
                </>
              ) : (
                <Link href="/auth/login" className="btn btn-primary w-full justify-center" onClick={() => setMobileMenuOpen(false)}>
                  Prihlásiť sa
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
