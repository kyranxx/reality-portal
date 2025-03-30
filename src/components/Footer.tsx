'use client';

import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';

export default function Footer() {
  const { t } = useApp();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">{t('footer.about')}</h2>
            <p className="text-gray-600 mb-4">
              {t('footer.aboutText')}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/nehnutelnosti" className="text-gray-600 hover:text-gray-900">
                  {t('nav.properties')}
                </Link>
              </li>
              <li>
                <Link href="/o-nas" className="text-gray-600 hover:text-gray-900">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-gray-600 hover:text-gray-900">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">{t('footer.legal')}</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/podmienky-pouzitia" className="text-gray-600 hover:text-gray-900">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link href="/ochrana-osobnych-udajov" className="text-gray-600 hover:text-gray-900">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-600 hover:text-gray-900">
                  {t('footer.cookies')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">{t('footer.contact')}</h2>
            <address className="not-italic text-gray-600">
              <p>Reality Portal, s.r.o.</p>
              <p>Hlavná 123</p>
              <p>851 01 Bratislava</p>
              <p className="mt-2">info@realityportal.sk</p>
              <p>+421 901 234 567</p>
            </address>
          </div>
        </div>

        <hr className="my-8 border-gray-200" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            &copy; {currentYear} Reality Portal. {t('footer.copyright')}
          </p>
          <div className="flex mt-4 md:mt-0 space-x-6">
            <Link href="/auth/admin-login" className="text-xs text-gray-400 hover:text-gray-600">
              Administrator Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
