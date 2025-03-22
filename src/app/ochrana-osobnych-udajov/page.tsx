'use client';

import { useApp } from '@/contexts/AppContext';
import SectionTitle from '@/components/SectionTitle';

export default function PrivacyPolicyPage() {
  const { t } = useApp();
  
  return (
    <div className="container mx-auto px-4 py-16">
      <SectionTitle title={t('footer.privacy')} subtitle="" />
      
      <div className="bg-white rounded-xl shadow-sm p-8 md:p-10 max-w-4xl mx-auto">
        <div className="prose max-w-none">
          <h2>Zásady ochrany osobných údajov</h2>
          
          <p>Posledná aktualizácia: 22. marca 2025</p>
          
          <p>Reality Portál rešpektuje vaše súkromie a zaväzuje sa chrániť vaše osobné údaje. Tieto zásady ochrany osobných údajov vysvetľujú, ako zhromažďujeme, používame, zdieľame a chránime vaše osobné údaje pri návšteve a používaní našej webovej stránky.</p>
          
          <h3>Kto sme</h3>
          <p>Reality Portál je webová platforma poskytujúca služby v oblasti realitného trhu na Slovensku. Sme prevádzkovateľom osobných údajov, ktoré zhromažďujeme.</p>
          
          <h3>Aké osobné údaje zhromažďujeme</h3>
          <p>V závislosti od vašej interakcie s našou webovou stránkou môžeme zhromažďovať nasledujúce typy osobných údajov:</p>
          <ul>
            <li><strong>Identifikačné údaje</strong>: meno, priezvisko, užívateľské meno</li>
            <li><strong>Kontaktné údaje</strong>: e-mailová adresa, telefónne číslo, adresa</li>
            <li><strong>Technické údaje</strong>: IP adresa, typ a verzia prehliadača, časové pásmo a lokalita, typy a verzie prehliadačových pluginov, operačný systém a platforma</li>
            <li><strong>Údaje o profile</strong>: vaše užívateľské meno a heslo, vaše preferencie, spätná väzba a odpovede na prieskumy</li>
            <li><strong>Údaje o používaní</strong>: informácie o tom, ako používate našu webovú stránku, produkty a služby</li>
            <li><strong>Marketingové a komunikačné údaje</strong>: vaše preferencie pri prijímaní marketingových materiálov od nás</li>
          </ul>
          
          <h3>Ako zhromažďujeme vaše osobné údaje</h3>
          <p>Vaše osobné údaje zhromažďujeme rôznymi spôsobmi, vrátane:</p>
          <ul>
            <li>Priamej interakcie: keď vyplníte formulár, vytvoríte účet, zverejníte nehnuteľnosť, komunikujete s nami e-mailom alebo inak</li>
            <li>Automatizovaných technológií: pri návšteve našej webovej stránky môžeme automaticky zhromažďovať technické údaje o vašom zariadení, prehliadačových akciách a vzoroch. Tieto údaje zhromažďujeme pomocou cookies a podobných technológií</li>
          </ul>
          
          <h3>Ako používame vaše osobné údaje</h3>
          <p>Vaše osobné údaje používame len na účely, pre ktoré sme ich zhromaždili, vrátane nasledujúcich:</p>
          <ul>
            <li>Registrácia a správa vášho účtu</li>
            <li>Poskytovanie a správa služieb súvisiacich s nehnuteľnosťami</li>
            <li>Komunikácia s vami</li>
            <li>Zlepšovanie našej webovej stránky a služieb</li>
            <li>Odporúčanie nehnuteľností, ktoré by vás mohli zaujímať</li>
            <li>Dodržiavanie zákonných povinností</li>
          </ul>
          
          <h3>Zdieľanie vašich osobných údajov</h3>
          <p>Vaše osobné údaje zdieľame len v súlade s príslušnými zákonmi. Môžeme zdieľať vaše osobné údaje s:</p>
          <ul>
            <li>Poskytovateľmi služieb, ktorí poskytujú IT a systémové administračné služby</li>
            <li>Profesionálnymi poradcami, vrátane právnikov, bankárov, audítorov a poisťovateľov</li>
            <li>Daňovými úradmi, regulačnými a inými úradmi</li>
            <li>Inými užívateľmi, keď pridáte nehnuteľnosť alebo kontaktujete majiteľa nehnuteľnosti</li>
          </ul>
          
          <h3>Bezpečnosť údajov</h3>
          <p>Zaviedli sme vhodné bezpečnostné opatrenia, aby sme zabránili náhodnému strate, použitiu alebo prístupu k vašim osobným údajom neoprávneným spôsobom, ich zmene alebo zverejneniu. Okrem toho obmedzujeme prístup k vašim osobným údajom tým zamestnancom, dodávateľom a ďalším tretím stranám, ktorí ich potrebujú poznať z obchodných dôvodov. Budú spracovávať vaše osobné údaje len na základe našich pokynov a sú viazaní povinnosťou mlčanlivosti.</p>
          
          <h3>Uchovávanie údajov</h3>
          <p>Vaše osobné údaje uchovávame len tak dlho, ako je potrebné na splnenie účelov, pre ktoré sme ich zhromaždili, vrátane splnenia zákonných, účtovných alebo vykazovacích požiadaviek.</p>
          
          <h3>Vaše zákonné práva</h3>
          <p>Podľa GDPR a ďalších platných zákonov o ochrane údajov máte nasledujúce práva:</p>
          <ul>
            <li>Právo na prístup k vašim osobným údajom</li>
            <li>Právo na opravu vašich osobných údajov</li>
            <li>Právo na vymazanie vašich osobných údajov</li>
            <li>Právo namietať proti spracovaniu vašich osobných údajov</li>
            <li>Právo na obmedzenie spracovania vašich osobných údajov</li>
            <li>Právo na prenosnosť údajov</li>
            <li>Právo kedykoľvek odvolať súhlas, ak sa spoliehame na súhlas na spracovanie vašich osobných údajov</li>
          </ul>
          
          <h3>Zmeny týchto zásad ochrany osobných údajov</h3>
          <p>Vyhradzujeme si právo kedykoľvek aktualizovať tieto zásady ochrany osobných údajov. Aktualizovanú verziu zverejníme na našej webovej stránke. Odporúčame vám pravidelne kontrolovať túto stránku, aby ste boli informovaní o akýchkoľvek zmenách.</p>
          
          <h3>Kontakt</h3>
          <p>Ak máte akékoľvek otázky týkajúce sa týchto zásad ochrany osobných údajov alebo o tom, ako spracovávame vaše osobné údaje, kontaktujte nás na adrese privacy@realityportal.sk.</p>
        </div>
      </div>
    </div>
  );
}
