'use client';

import React from 'react';
import SectionTitle from '@/components/SectionTitle';

export default function KontaktClient() {
  return (
    <div className="container mx-auto px-4 py-8">
      <SectionTitle title="Kontakt" subtitle="Spojte sa s nami" />
      
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 my-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Kontaktné údaje</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-800">Adresa:</h3>
                <p className="text-gray-700">
                  Reality Portal, s.r.o.<br />
                  Hlavná 123<br />
                  811 01 Bratislava
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800">Telefón:</h3>
                <p className="text-gray-700">+421 902 123 456</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800">Email:</h3>
                <p className="text-gray-700">info@reality-portal.sk</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800">Otváracie hodiny:</h3>
                <p className="text-gray-700">
                  Pondelok - Piatok: 9:00 - 17:00<br />
                  Sobota: 10:00 - 14:00<br />
                  Nedeľa: Zatvorené
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Napíšte nám</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Meno a priezvisko</label>
                <input 
                  type="text" 
                  id="name" 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  placeholder="Vaše meno"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  placeholder="Váš email"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Správa</label>
                <textarea 
                  id="message" 
                  rows={4} 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  placeholder="Vaša správa"
                ></textarea>
              </div>
              
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
              >
                Odoslať správu
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Kde nás nájdete</h2>
          <div className="w-full h-80 bg-gray-200 rounded-md flex items-center justify-center">
            <p className="text-gray-500">Mapa sa načítava...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
