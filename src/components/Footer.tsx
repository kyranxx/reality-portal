import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-100 py-16 mt-20">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center space-x-3 mb-5">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                  <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                  <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Reality Portal</h2>
            </div>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Váš spoľahlivý partner pri hľadaní nehnuteľností na Slovensku. Jednoduché vyhľadávanie, overení predajcovia a kompletný servis.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm4.957 7.571h-1.65c-.186 0-.4.2-.4.429v1.2h2.05l-.306 2.143h-1.744V19h-2.143v-5.657H11.1v-2.143h1.664v-1.386c0-1.8 1.064-2.814 2.786-2.814h1.407v2.571z" />
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-5 text-lg">Navigácia</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-500 hover:text-primary transition-colors duration-300 inline-block">
                  Domov
                </Link>
              </li>
              <li>
                <Link href="/nehnutelnosti" className="text-gray-500 hover:text-primary transition-colors duration-300 inline-block">
                  Nehnuteľnosti
                </Link>
              </li>
              <li>
                <Link href="/o-nas" className="text-gray-500 hover:text-primary transition-colors duration-300 inline-block">
                  O nás
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-gray-500 hover:text-primary transition-colors duration-300 inline-block">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-5 text-lg">Kategórie</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/nehnutelnosti/byty" className="text-gray-500 hover:text-primary transition-colors duration-300 inline-block">
                  Byty
                </Link>
              </li>
              <li>
                <Link href="/nehnutelnosti/domy" className="text-gray-500 hover:text-primary transition-colors duration-300 inline-block">
                  Domy
                </Link>
              </li>
              <li>
                <Link href="/nehnutelnosti/pozemky" className="text-gray-500 hover:text-primary transition-colors duration-300 inline-block">
                  Pozemky
                </Link>
              </li>
              <li>
                <Link href="/nehnutelnosti/komercne" className="text-gray-500 hover:text-primary transition-colors duration-300 inline-block">
                  Komerčné priestory
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-5 text-lg">Kontakt</h3>
            <ul className="space-y-4">
              <li className="text-gray-500 flex items-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <span>Hlavná 123, 831 01 Bratislava</span>
              </li>
              <li className="text-gray-500 flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <span>+421 900 123 456</span>
              </li>
              <li className="text-gray-500 flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <span>info@realityportal.sk</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Reality Portal. Všetky práva vyhradené.
          </p>
          <div className="flex flex-wrap gap-6 mt-4 md:mt-0">
            <Link href="/podmienky-pouzitia" className="text-gray-400 hover:text-primary transition-colors duration-300 text-sm">
              Podmienky použitia
            </Link>
            <Link href="/ochrana-osobnych-udajov" className="text-gray-400 hover:text-primary transition-colors duration-300 text-sm">
              Ochrana osobných údajov
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-primary transition-colors duration-300 text-sm">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
