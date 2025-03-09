'use client';

import { useState } from 'react';

export default function PridatNehnutelnostPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    price: '',
    size: '',
    rooms: '',
    bathrooms: '',
    location: '',
    features: [] as string[],
  });

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleFeatureToggle = (feature: string) => {
    const features = [...formData.features];
    if (features.includes(feature)) {
      updateFormData('features', features.filter(f => f !== feature));
    } else {
      updateFormData('features', [...features, feature]);
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    alert('Inzerát bol úspešne pridaný!');
    // Reset form or redirect
  };

  return (
    <div className="container py-16">
      <h1 className="text-3xl font-bold mb-8">Pridať inzerát</h1>
      
      <div className="mb-8">
        <div className="flex items-center">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= stepNumber ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div 
                  className={`w-16 h-1 ${
                    step > stepNumber ? 'bg-primary' : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <div className="text-sm font-medium">Základné informácie</div>
          <div className="text-sm font-medium">Detaily a vybavenie</div>
          <div className="text-sm font-medium">Fotografie a kontakt</div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8 border border-gray-100">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Základné informácie</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Typ nehnuteľnosti</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['apartment', 'house', 'land', 'commercial'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`py-3 px-4 border rounded-md text-center ${
                      formData.type === type 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => updateFormData('type', type)}
                  >
                    {type === 'apartment' && 'Byt'}
                    {type === 'house' && 'Dom'}
                    {type === 'land' && 'Pozemok'}
                    {type === 'commercial' && 'Komerčné'}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Názov inzerátu</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Napr. 3-izbový byt, Bratislava - Staré Mesto"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Popis nehnuteľnosti</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Podrobný popis nehnuteľnosti..."
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Cena (€)</label>
                <input
                  type="number"
                  id="price"
                  value={formData.price}
                  onChange={(e) => updateFormData('price', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Napr. 150000"
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Lokalita</label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => updateFormData('location', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Napr. Bratislava - Staré Mesto"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                className="btn btn-primary"
              >
                Pokračovať
              </button>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Detaily a vybavenie</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">Plocha (m²)</label>
                <input
                  type="number"
                  id="size"
                  value={formData.size}
                  onChange={(e) => updateFormData('size', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Napr. 75"
                />
              </div>
              
              <div>
                <label htmlFor="rooms" className="block text-sm font-medium text-gray-700 mb-1">Počet izieb</label>
                <input
                  type="number"
                  id="rooms"
                  value={formData.rooms}
                  onChange={(e) => updateFormData('rooms', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Napr. 3"
                />
              </div>
              
              <div>
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">Počet kúpeľní</label>
                <input
                  type="number"
                  id="bathrooms"
                  value={formData.bathrooms}
                  onChange={(e) => updateFormData('bathrooms', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Napr. 1"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Vybavenie a vlastnosti</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  'Balkón', 'Terasa', 'Garáž', 'Parkovanie', 
                  'Výťah', 'Klimatizácia', 'Internet', 'Káblová TV',
                  'Umývačka', 'Práčka', 'Sušička', 'Chladnička',
                  'Pivnica', 'Komora', 'Bezbariérový prístup', 'Alarm'
                ].map((feature) => (
                  <div 
                    key={feature}
                    className={`py-2 px-3 border rounded-md cursor-pointer ${
                      formData.features.includes(feature) 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => handleFeatureToggle(feature)}
                  >
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-2"
                        checked={formData.features.includes(feature)}
                        onChange={() => {}}
                      />
                      <span>{feature}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="btn btn-outline"
              >
                Späť
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="btn btn-primary"
              >
                Pokračovať
              </button>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Fotografie a kontakt</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <p className="text-gray-700 mb-2">Pretiahnite sem fotografie alebo</p>
              <button type="button" className="btn btn-outline">Vyberte súbory</button>
              <p className="text-sm text-gray-500 mt-2">Maximálne 10 fotografií (JPG, PNG)</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">Kontaktná osoba</label>
                <input
                  type="text"
                  id="contactName"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Vaše meno"
                />
              </div>
              
              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">Telefónne číslo</label>
                <input
                  type="tel"
                  id="contactPhone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="+421 XXX XXX XXX"
                />
              </div>
              
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="contactEmail"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="vas@email.sk"
                />
              </div>
              
              <div>
                <label htmlFor="showContact" className="block text-sm font-medium text-gray-700 mb-1">Zobrazenie kontaktu</label>
                <select
                  id="showContact"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">Zobraziť všetky kontaktné údaje</option>
                  <option value="phone">Zobraziť iba telefón</option>
                  <option value="email">Zobraziť iba email</option>
                  <option value="form">Kontaktný formulár</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="btn btn-outline"
              >
                Späť
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                Pridať inzerát
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
