'use client';

import React from 'react';
import SectionTitle from '@/components/SectionTitle';

export default function OchranaOsobnychUdajovClient() {
  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle title="Ochrana osobných údajov" subtitle="Informácie o spracovaní vašich osobných údajov" />
      
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 my-8">
        <div className="prose prose-blue max-w-none">
          <h2>Zásady ochrany osobných údajov</h2>
          <p>
            Spoločnosť Reality Portal, s.r.o. so sídlom Hlavná 123, 811 01 Bratislava, IČO: 12345678, 
            zapísaná v Obchodnom registri Okresného súdu Bratislava I (ďalej len "prevádzkovateľ" alebo "my") 
            ako prevádzkovateľ webovej stránky reality-portal.sk berie ochranu vašich osobných údajov vážne.
          </p>
          
          <h3>1. Aké údaje zbierame</h3>
          <p>
            Pri používaní našich služieb môžeme zbierať nasledovné osobné údaje:
          </p>
          <ul>
            <li>Identifikačné údaje (meno, priezvisko)</li>
            <li>Kontaktné údaje (email, telefónne číslo, adresa)</li>
            <li>Informácie o nehnuteľnostiach, ktoré ste zverejnili alebo o ktoré ste prejavili záujem</li>
            <li>Údaje o vašej aktivite na našej stránke</li>
            <li>Technické údaje (IP adresa, typ prehliadača, zariadenia)</li>
          </ul>
          
          <h3>2. Prečo údaje spracúvame</h3>
          <p>
            Vaše osobné údaje spracúvame na nasledovné účely:
          </p>
          <ul>
            <li>Poskytovanie našich služieb a plnenie zmluvy</li>
            <li>Komunikácia s vami a odpovedanie na vaše otázky</li>
            <li>Zlepšovanie našich služieb a zabezpečenie funkčnosti stránky</li>
            <li>Zasielanie marketingových informácií (ak ste nám na to dali súhlas)</li>
            <li>Plnenie zákonných povinností</li>
          </ul>
          
          <h3>3. Právny základ spracovania</h3>
          <p>
            Vaše osobné údaje spracúvame na základe nasledovných právnych základov:
          </p>
          <ul>
            <li>Plnenie zmluvy alebo predzmluvné vzťahy</li>
            <li>Oprávnený záujem</li>
            <li>Váš súhlas (napr. pre zasielanie marketingových informácií)</li>
            <li>Plnenie zákonných povinností</li>
          </ul>
          
          <h3>4. Ako dlho údaje uchovávame</h3>
          <p>
            Vaše osobné údaje uchovávame len po dobu nevyhnutnú na splnenie účelu, na ktorý boli získané:
          </p>
          <ul>
            <li>Údaje súvisiace s používateľským účtom: po dobu trvania vášho účtu</li>
            <li>Údaje o nehnuteľnostiach: po dobu, kým sú aktívne zverejnené</li>
            <li>Komunikácia: 3 roky od poslednej komunikácie</li>
            <li>Fakturačné údaje: 10 rokov (zákonná povinnosť)</li>
          </ul>
          
          <h3>5. Zdieľanie údajov s tretími stranami</h3>
          <p>
            Vaše osobné údaje môžeme zdieľať s:
          </p>
          <ul>
            <li>Poskytovateľmi IT služieb a hostingu</li>
            <li>Profesionálnymi poradcami (právnici, účtovníci)</li>
            <li>Štátnymi orgánmi, ak to vyžaduje zákon</li>
          </ul>
          
          <h3>6. Vaše práva</h3>
          <p>
            Podľa platných predpisov o ochrane osobných údajov máte nasledujúce práva:
          </p>
          <ul>
            <li>Právo na prístup k údajom</li>
            <li>Právo na opravu nesprávnych údajov</li>
            <li>Právo na vymazanie údajov</li>
            <li>Právo na obmedzenie spracovania</li>
            <li>Právo na prenosnosť údajov</li>
            <li>Právo namietať proti spracovaniu</li>
            <li>Právo odvolať súhlas (ak je spracovanie založené na súhlase)</li>
          </ul>
          
          <h3>7. Cookies</h3>
          <p>
            Naša stránka používa cookies a podobné technológie na zabezpečenie funkčnosti stránky, 
            analýzu návštevnosti a personalizáciu obsahu. Viac informácií nájdete v našich zásadách používania cookies.
          </p>
          
          <h3>8. Kontaktné údaje</h3>
          <p>
            Ak máte akékoľvek otázky týkajúce sa spracovania vašich osobných údajov, môžete nás kontaktovať na:
          </p>
          <ul>
            <li>Email: gdpr@reality-portal.sk</li>
            <li>Adresa: Reality Portal, s.r.o., Hlavná 123, 811 01 Bratislava</li>
          </ul>
          
          <h3>9. Aktualizácie zásad ochrany osobných údajov</h3>
          <p>
            Tieto zásady ochrany osobných údajov môžeme z času na čas aktualizovať. Aktuálna verzia bude vždy dostupná na tejto stránke.
            Posledná aktualizácia: 29. marec 2025
          </p>
        </div>
      </div>
    </div>
  );
}
