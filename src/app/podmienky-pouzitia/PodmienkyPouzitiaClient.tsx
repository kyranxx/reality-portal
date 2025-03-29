'use client';

import React from 'react';
import SectionTitle from '@/components/SectionTitle';

export default function PodmienkyPouzitiaClient() {
  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle title="Podmienky použitia" subtitle="Oboznámte sa s pravidlami používania našich služieb" />
      
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 my-8">
        <div className="prose prose-blue max-w-none">
          <h2>Všeobecné podmienky používania služby Reality Portal</h2>
          <p>
            Tieto všeobecné podmienky používania upravujú práva a povinnosti používateľov webovej stránky 
            a služieb poskytovaných spoločnosťou Reality Portal, s.r.o.
          </p>
          
          <h3>1. Vymedzenie pojmov</h3>
          <ul>
            <li><strong>Prevádzkovateľ:</strong> Reality Portal, s.r.o., so sídlom Hlavná 123, 811 01 Bratislava, IČO: 12345678</li>
            <li><strong>Služba:</strong> webová stránka reality-portal.sk a všetky funkcie, ktoré poskytuje</li>
            <li><strong>Používateľ:</strong> fyzická alebo právnická osoba, ktorá používa Službu</li>
            <li><strong>Inzerát:</strong> ponuka nehnuteľnosti zverejnená prostredníctvom Služby</li>
          </ul>
          
          <h3>2. Registrácia a používateľský účet</h3>
          <p>
            Pre využívanie niektorých funkcií Služby je potrebná registrácia. Používateľ sa zaväzuje:
          </p>
          <ul>
            <li>Poskytnúť pravdivé a úplné informácie pri registrácii</li>
            <li>Aktualizovať svoje údaje v prípade zmeny</li>
            <li>Chrániť svoje prihlasovacie údaje pred zneužitím</li>
            <li>Neprevádzať svoj používateľský účet na tretie osoby</li>
          </ul>
          
          <h3>3. Pravidlá pre zverejňovanie inzerátov</h3>
          <p>
            Pri zverejňovaní inzerátov je používateľ povinný:
          </p>
          <ul>
            <li>Uvádzať pravdivé a nezavádzajúce informácie o nehnuteľnosti</li>
            <li>Zverejňovať len inzeráty, ktoré sa týkajú nehnuteľností</li>
            <li>Nezverejňovať rovnakú nehnuteľnosť viackrát</li>
            <li>Nezverejňovať obsah, ktorý je v rozpore s právnymi predpismi SR alebo dobrými mravmi</li>
            <li>Používať len vlastné fotografie alebo fotografie, ku ktorým má súhlas na použitie</li>
          </ul>
          
          <h3>4. Práva a povinnosti prevádzkovateľa</h3>
          <p>
            Prevádzkovateľ je oprávnený:
          </p>
          <ul>
            <li>Kedykoľvek zmeniť, obmedziť alebo ukončiť poskytovanie Služby</li>
            <li>Odstrániť inzeráty, ktoré porušujú tieto podmienky</li>
            <li>Zablokovať alebo zrušiť používateľský účet, ktorý porušuje tieto podmienky</li>
            <li>Upraviť parametre a funkcionality Služby</li>
          </ul>
          
          <h3>5. Zodpovednosť za obsah</h3>
          <p>
            Prevádzkovateľ nezodpovedá za:
          </p>
          <ul>
            <li>Obsah inzerátov zadaných používateľmi</li>
            <li>Pravdivosť informácií v inzerátoch</li>
            <li>Porušenie práv tretích osôb obsahom inzerátu</li>
            <li>Škody spôsobené nedostupnosťou Služby</li>
          </ul>
          
          <h3>6. Platené služby</h3>
          <p>
            Prevádzkovateľ môže poskytovať niektoré služby za odplatu. V takom prípade:
          </p>
          <ul>
            <li>Informácie o cene a podmienkach využívania platených služieb budú zverejnené na Službe</li>
            <li>Platené služby sa poskytujú na základe samostatnej zmluvy</li>
            <li>Platby za služby sú nevratné, ak nie je uvedené inak</li>
          </ul>
          
          <h3>7. Ochrana osobných údajov</h3>
          <p>
            Informácie o spracovaní osobných údajov sú uvedené v samostatnom dokumente 
            "Zásady ochrany osobných údajov", ktorý je dostupný na Službe.
          </p>
          
          <h3>8. Ukončenie používania služby</h3>
          <p>
            Používateľ môže kedykoľvek ukončiť používanie Služby zrušením svojho používateľského účtu.
            Prevádzkovateľ môže ukončiť poskytovanie Služby používateľovi v prípade:
          </p>
          <ul>
            <li>Porušenia týchto podmienok používateľom</li>
            <li>Dlhodobej neaktivity používateľského účtu</li>
            <li>Ukončenia prevádzkovania Služby</li>
          </ul>
          
          <h3>9. Záverečné ustanovenia</h3>
          <p>
            Tieto podmienky nadobúdajú účinnosť dňom 29. marca 2025. Prevádzkovateľ si vyhradzuje právo
            tieto podmienky kedykoľvek zmeniť. Zmena podmienok bude oznámená na Službe a nadobúda účinnosť
            dňom jej zverejnenia, ak nie je uvedené inak.
          </p>
          
          <p>
            Používaním Služby používateľ vyjadruje súhlas s týmito podmienkami.
          </p>
        </div>
      </div>
    </div>
  );
}
