'use client';

import React from 'react';
import SectionTitle from '@/components/SectionTitle';

export default function CookiesClient() {
  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle title="Cookies" subtitle="Informácie o používaní cookies na našej stránke" />
      
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 my-8">
        <div className="prose prose-blue max-w-none">
          <h2>Zásady používania cookies</h2>
          <p>
            Reality Portal používa cookies a podobné technológie, aby zabezpečil správne fungovanie webovej stránky 
            a poskytol vám čo najlepší užívateľský zážitok.
          </p>
          
          <h3>1. Čo sú cookies</h3>
          <p>
            Cookies sú malé textové súbory, ktoré sa ukladajú vo vašom prehliadači pri návšteve webových stránok. 
            Tieto súbory pomáhajú webovým stránkam zapamätať si vaše nastavenia, preferencie a ďalšie informácie, 
            aby sa zlepšil váš užívateľský zážitok pri opätovnej návšteve stránky.
          </p>
          
          <h3>2. Aké cookies používame</h3>
          <p>
            Na našej webovej stránke používame nasledujúce typy cookies:
          </p>
          
          <h4>2.1 Nevyhnutné cookies</h4>
          <p>
            Tieto cookies sú potrebné pre základné fungovanie webovej stránky. Umožňujú vám pohybovať sa po stránke 
            a využívať jej základné funkcie. Tieto cookies nezbierajú informácie o vás, ktoré by mohli byť použité 
            na marketingové účely.
          </p>
          <ul>
            <li>Cookies pre prihlásenie a správu používateľského účtu</li>
            <li>Cookies pre zabezpečenie stránky</li>
            <li>Cookies pre uloženie kosíka alebo uložených vyhľadávaní nehnuteľností</li>
          </ul>
          
          <h4>2.2 Preferenčné cookies</h4>
          <p>
            Tieto cookies umožňujú webovej stránke zapamätať si vaše preferencie a nastavenia, ako napríklad jazyk 
            alebo región. Vďaka nim sa vám stránka zobrazuje v podobe, ktorú preferujete.
          </p>
          <ul>
            <li>Cookies pre nastavenie jazyka</li>
            <li>Cookies pre nastavenie lokality</li>
            <li>Cookies pre uloženie vašich filtrov a preferencií pri vyhľadávaní</li>
          </ul>
          
          <h4>2.3 Analytické cookies</h4>
          <p>
            Tieto cookies nám pomáhajú pochopiť, ako návštevníci používajú našu stránku. Zbierajú anonymné 
            štatistické údaje, ktoré nám umožňujú zlepšovať fungovanie a dizajn stránky.
          </p>
          <ul>
            <li>Google Analytics</li>
            <li>Hotjar</li>
            <li>Interné analytické nástroje</li>
          </ul>
          
          <h4>2.4 Marketingové cookies</h4>
          <p>
            Tieto cookies sa používajú na sledovanie návštevníkov na webových stránkach. Ich účelom je zobrazovať 
            reklamy, ktoré sú relevantné a zaujímavé pre jednotlivých používateľov.
          </p>
          <ul>
            <li>Facebook Pixel</li>
            <li>Google Ads</li>
          </ul>
          
          <h3>3. Správa cookies</h3>
          <p>
            Väčšina webových prehliadačov vám umožňuje spravovať vaše cookies prostredníctvom 
            nastavení prehliadača. Môžete:
          </p>
          <ul>
            <li>Zistiť, ktoré cookies sa používajú</li>
            <li>Zablokovať cookies</li>
            <li>Vymazať všetky cookies uložené vo vašom zariadení</li>
            <li>Používať režim prehliadania v súkromí</li>
          </ul>
          
          <p>
            Upozorňujeme, že zablokovanie alebo odstránenie cookies môže mať vplyv na používanie našej stránky 
            a niektoré funkcie nemusia pracovať správne.
          </p>
          
          <h3>4. Ako spravovať svoje preferencie</h3>
          <p>
            Svoje preferencie týkajúce sa cookies si môžete spravovať dvoma spôsobmi:
          </p>
          <ul>
            <li>Prostredníctvom nášho centra preferencií cookies, ktoré sa zobrazí pri prvej návšteve našej stránky</li>
            <li>Zmenou nastavení vášho webového prehliadača</li>
          </ul>
          
          <h3>5. Zmeny v zásadách používania cookies</h3>
          <p>
            Vyhradzujeme si právo kedykoľvek zmeniť tieto zásady používania cookies. Akékoľvek zmeny 
            budú zverejnené na tejto stránke.
          </p>
          
          <h3>6. Kontaktujte nás</h3>
          <p>
            Ak máte akékoľvek otázky týkajúce sa nášho používania cookies, neváhajte nás kontaktovať:
          </p>
          <ul>
            <li>Email: cookies@reality-portal.sk</li>
            <li>Telefón: +421 902 123 456</li>
          </ul>
          
          <p>
            Posledná aktualizácia: 29. marec 2025
          </p>
        </div>
      </div>
    </div>
  );
}
