'use client';

import { useApp } from '@/contexts/AppContext';
import SectionTitle from '@/components/SectionTitle';

export default function CookiesPage() {
  const { t } = useApp();
  
  return (
    <div className="container mx-auto px-4 py-16">
      <SectionTitle title={t('footer.cookies')} subtitle="" />
      
      <div className="bg-white rounded-xl shadow-sm p-8 md:p-10 max-w-4xl mx-auto">
        <div className="prose max-w-none">
          <h2>Zásady používania cookies</h2>
          
          <p>Posledná aktualizácia: 22. marca 2025</p>
          
          <p>Táto stránka vysvetľuje, ako Reality Portál používa cookies a podobné technológie na zlepšenie vašej užívateľskej skúsenosti. Používaním našej webovej stránky súhlasíte s používaním cookies v súlade s týmito zásadami.</p>
          
          <h3>Čo sú cookies?</h3>
          <p>Cookies sú malé textové súbory, ktoré sa ukladajú vo vašom prehliadači pri návšteve webových stránok. Tieto súbory umožňujú webovej stránke zapamätať si vaše akcie a preferencie (ako sú prihlasovacie údaje, jazyk, veľkosť písma a iné nastavenia zobrazenia) počas určitého časového obdobia, aby ste ich nemuseli opakovane zadávať pri každej návšteve webovej stránky alebo pri prechádzaní z jednej stránky na druhú.</p>
          
          <h3>Aké typy cookies používame?</h3>
          
          <h4>Nevyhnutné cookies</h4>
          <p>Tieto cookies sú potrebné pre správne fungovanie našej webovej stránky. Umožňujú vám pohybovať sa po našej stránke a využívať jej funkcie, ako je prístup do zabezpečených oblastí. Bez týchto cookies by niektoré služby, ktoré požadujete, nemohli byť poskytnuté.</p>
          
          <h4>Analytické cookies</h4>
          <p>Tieto cookies zhromažďujú informácie o tom, ako používatelia využívajú našu webovú stránku, napríklad ktoré stránky navštevujú najčastejšie a či dostávajú z webových stránok chybové hlásenia. Tieto cookies nezbierajú informácie, ktoré identifikujú návštevníka. Všetky informácie, ktoré tieto cookies zhromažďujú, sú agregované a teda anonymné. Používajú sa len na zlepšenie fungovania webovej stránky.</p>
          
          <h4>Funkčné cookies</h4>
          <p>Tieto cookies umožňujú webovej stránke zapamätať si vaše voľby (ako je vaše užívateľské meno, jazyk alebo región, v ktorom sa nachádzate) a poskytovať vylepšené, osobnejšie funkcie. Tieto cookies môžu byť použité aj na zapamätanie zmien, ktoré ste urobili v textovej veľkosti, fontoch a ďalších častiach webových stránok, ktoré si môžete prispôsobiť.</p>
          
          <h4>Marketingové cookies</h4>
          <p>Tieto cookies sa používajú na sledovanie návštevníkov na webových stránkach. Zámerom je zobrazovať reklamy, ktoré sú relevantné a pútavé pre jednotlivých užívateľov, a tým hodnotnejšie pre vydavateľov a inzerentov tretích strán.</p>
          
          <h3>Ako dlho zostávajú cookies v mojom zariadení?</h3>
          <p>Cookies môžu zostať vo vašom zariadení rôzne dlhú dobu, v závislosti od typu cookies:</p>
          <ul>
            <li><strong>Relačné cookies</strong> - tieto cookies sú dočasné a zostávajú vo vašom zariadení, kým neopustíte našu webovú stránku.</li>
            <li><strong>Trvalé cookies</strong> - tieto cookies zostávajú vo vašom zariadení, kým nevypršia alebo ich nevymažete.</li>
          </ul>
          
          <h3>Ako môžem kontrolovať cookies?</h3>
          <p>Väčšina webových prehliadačov umožňuje určitú kontrolu nad väčšinou cookies prostredníctvom nastavení prehliadača. Môžete nastaviť svoj prehliadač tak, aby blokoval cookies, alebo aby vás informoval vždy, keď je cookie ponúknutá. Môžete tiež vymazať cookies, ktoré už boli uložené vo vašom zariadení.</p>
          
          <p>Pre informácie o tom, ako spravovať a vymazať cookies, navštívte webovú stránku všeobecného prehliadača, ktorý používate:</p>
          <ul>
            <li><a href="https://support.google.com/chrome/answer/95647" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
            <li><a href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
            <li><a href="https://support.apple.com/en-us/HT201265" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Safari</a></li>
          </ul>
          
          <p>Upozorňujeme, že blokovanie všetkých cookies bude mať negatívny vplyv na použiteľnosť mnohých webových stránok a môže spôsobiť, že niektoré funkcie našej webovej stránky nebudú správne fungovať.</p>
          
          <h3>Zmeny týchto zásad používania cookies</h3>
          <p>Vyhradzujeme si právo kedykoľvek zmeniť tieto zásady používania cookies. Akékoľvek zmeny budú zverejnené na tejto stránke. Odporúčame vám pravidelne kontrolovať túto stránku, aby ste boli informovaní o akýchkoľvek zmenách.</p>
          
          <h3>Kontakt</h3>
          <p>Ak máte akékoľvek otázky týkajúce sa našich zásad používania cookies, kontaktujte nás na adrese privacy@realityportal.sk.</p>
        </div>
      </div>
    </div>
  );
}
