'use client';

import { useApp } from '@/contexts/AppContext';
import SectionTitle from '@/components/SectionTitle';

export default function TermsPage() {
  const { t } = useApp();
  
  return (
    <div className="container mx-auto px-4 py-16">
      <SectionTitle title={t('footer.terms')} subtitle="" />
      
      <div className="bg-white rounded-xl shadow-sm p-8 md:p-10 max-w-4xl mx-auto">
        <div className="prose max-w-none">
          <h2>Podmienky používania Reality Portálu</h2>
          
          <p>Posledná aktualizácia: 22. marca 2025</p>
          
          <p>Vitajte na Reality Portáli. Tieto podmienky používania upravujú vaše používanie našej webovej stránky, vrátane akýchkoľvek funkcií, služieb alebo obsahu, ktoré poskytujeme. Používaním našich služieb vyjadrujete svoj súhlas s týmito podmienkami.</p>
          
          <h3>1. Prijatie podmienok</h3>
          <p>Používaním Reality Portálu súhlasíte s dodržiavaním týchto podmienok používania. Ak nesúhlasíte s ktoroukoľvek časťou týchto podmienok, žiadame vás, aby ste našu platformu nepoužívali.</p>
          
          <h3>2. Zmeny podmienok</h3>
          <p>Vyhradzujeme si právo kedykoľvek upraviť alebo nahradiť tieto podmienky používania. Odporúčame vám pravidelne kontrolovať tieto podmienky, aby ste boli informovaní o zmenách.</p>
          
          <h3>3. Prístup k platforme</h3>
          <p>Zaväzujeme sa poskytovať našu platformu nepretržite, avšak nevylučujeme možnosť dočasného prerušenia z dôvodu údržby, aktualizácií alebo z iných dôvodov. Vyhradzujeme si právo kedykoľvek obmedziť, pozastaviť alebo ukončiť prístup používateľa k platforme.</p>
          
          <h3>4. Používateľské účty</h3>
          <p>Pri vytváraní používateľského účtu sa zaväzujete poskytovať presné, aktuálne a úplné informácie. Ste zodpovední za bezpečnosť vášho hesla a za všetky aktivity, ktoré sa uskutočnia pod vaším účtom.</p>
          
          <h3>5. Obsah platformy</h3>
          <p>Naša platforma umožňuje zdieľanie obsahu súvisiaceho s nehnuteľnosťami. Zaväzujete sa, že obsah, ktorý zdieľate, je presný, legálny a neporušuje práva tretích strán.</p>
          
          <h3>6. Zakázané činnosti</h3>
          <p>Pri používaní našej platformy sa zaväzujete, že nebudete:</p>
          <ul>
            <li>Porušovať akékoľvek zákony alebo predpisy</li>
            <li>Poskytovať nepravdivé alebo zavádzajúce informácie</li>
            <li>Narúšať alebo pokúšať sa narušiť bezpečnosť platformy</li>
            <li>Zbierať alebo zhromažďovať osobné údaje iných používateľov</li>
            <li>Používať platformu na odosielanie nevyžiadaných správ</li>
          </ul>
          
          <h3>7. Duševné vlastníctvo</h3>
          <p>Všetky práva duševného vlastníctva týkajúce sa platformy a jej obsahu (okrem používateľského obsahu) sú vlastníctvom Reality Portálu alebo jeho poskytovateľov licencií.</p>
          
          <h3>8. Obmedzenia zodpovednosti</h3>
          <p>Reality Portál nenesie zodpovednosť za akékoľvek priame, nepriame, náhodné, následné alebo špeciálne škody vyplývajúce z používania alebo nemožnosti používania našej platformy.</p>
          
          <h3>9. Rozhodné právo</h3>
          <p>Tieto podmienky používania sa riadia zákonmi Slovenskej republiky.</p>
          
          <h3>10. Kontakt</h3>
          <p>Ak máte akékoľvek otázky týkajúce sa týchto podmienok používania, kontaktujte nás na adrese info@realityportal.sk.</p>
        </div>
      </div>
    </div>
  );
}
