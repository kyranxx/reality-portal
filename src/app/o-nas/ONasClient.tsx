'use client';

import React from 'react';
import SectionTitle from '@/components/SectionTitle';

export default function ONasClient() {
  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle title="O nás" subtitle="Spoznajte našu realitnu kanceláriu" />
      
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 my-8">
        <h2 className="text-2xl font-semibold mb-4">Kto sme</h2>
        <p className="text-gray-700 mb-6">
          Sme moderná realitná kancelária s dlhoročnými skúsenosťami na slovenskom realitnom trhu. 
          Naša spoločnosť sa špecializuje na predaj a prenájom nehnuteľností všetkých druhov, 
          vrátane bytov, domov, komerčných priestorov a pozemkov.
        </p>
        
        <h2 className="text-2xl font-semibold mb-4">Naša vízia</h2>
        <p className="text-gray-700 mb-6">
          Našou víziou je poskytovať profesionálne služby v oblasti realít s dôrazom na spokojnosť 
          klientov a etický prístup k podnikaniu. Veríme, že každý si zaslúži mať miesto, 
          ktoré môže nazvať domovom, a našou úlohou je pomôcť vám toto miesto nájsť.
        </p>
        
        <h2 className="text-2xl font-semibold mb-4">Prečo si vybrať nás</h2>
        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
          <li>Skúsený tím realitných maklérov</li>
          <li>Široká ponuka nehnuteľností</li>
          <li>Transparentný prístup a férové podmienky</li>
          <li>Komplexné služby od začiatku až po podpis zmluvy</li>
          <li>Dlhoročné skúsenosti na slovenskom trhu</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mb-4">Náš tím</h2>
        <p className="text-gray-700 mb-6">
          Náš tím tvorí skupina odborníkov s bohatými skúsenosťami v oblasti realít.
          Každý člen nášho tímu je profesionál, ktorý je pripravený poskytnúť vám tie najlepšie služby
          a poradenstvo pri kúpe, predaji alebo prenájme nehnuteľnosti.
        </p>
      </div>
    </div>
  );
}
