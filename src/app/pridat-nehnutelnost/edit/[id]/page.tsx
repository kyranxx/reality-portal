'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../utils/FirebaseAuthContext';
import { getPropertyById, updateProperty } from '../../../../utils/firestore';
import NoSSR from '../../../../components/NoSSR';

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    propertyType: 'apartment' as 'apartment' | 'house' | 'land' | 'commercial',
    title: '',
    description: '',
    price: '',
    area: '',
    rooms: '',
    bathrooms: '',
    location: '',
    features: [] as string[],
    images: [] as string[],
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    contactVisibility: 'all',
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        if (!params.id) return;
        
        const propertyId = Array.isArray(params.id) ? params.id[0] : params.id;
        const propertyData = await getPropertyById(propertyId);
        
        if (!propertyData) {
          setError('Nehnuteľnosť nebola nájdená');
          setLoading(false);
          return;
        }
        
        // Check if the user is the owner of the property
        if (user && propertyData.userId !== user.uid) {
          setError('Nemáte oprávnenie upravovať túto nehnuteľnosť');
          setLoading(false);
          return;
        }
        
        setProperty(propertyData);
        
        // Populate form data
        setFormData({
          propertyType: propertyData.propertyType || 'apartment',
          title: propertyData.title || '',
          description: propertyData.description || '',
          price: propertyData.price?.toString() || '',
          area: propertyData.area?.toString() || '',
          rooms: propertyData.rooms?.toString() || '',
          bathrooms: propertyData.bathrooms?.toString() || '',
          location: propertyData.location || '',
          features: propertyData.features || [],
          images: propertyData.images || [],
          contactName: propertyData.contactName || '',
          contactPhone: propertyData.contactPhone || '',
          contactEmail: propertyData.contactEmail || '',
          contactVisibility: propertyData.contactVisibility || 'all',
        });
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Nastala chyba pri načítaní nehnuteľnosti');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProperty();
    } else {
      setLoading(false);
      setError('Pre úpravu inzerátu sa musíte prihlásiť');
    }
  }, [params.id, user]);

  const updateFormData = (field: string, value: any) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !property) {
      alert('Pre úpravu inzerátu sa musíte prihlásiť');
      router.push('/auth/login');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Convert string values to numbers
      const propertyData = {
        propertyType: formData.propertyType,
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        area: Number(formData.area),
        rooms: Number(formData.rooms),
        bathrooms: Number(formData.bathrooms),
        location: formData.location,
        features: formData.features,
        images: formData.images,
        contactName: formData.contactName || user.displayName || '',
        contactPhone: formData.contactPhone || '',
        contactEmail: formData.contactEmail || user.email || '',
        contactVisibility: formData.contactVisibility,
        // Keep the original userId and other fields
        userId: property.userId,
        isFeatured: property.isFeatured || false,
        isNew: property.isNew || false,
      };
      
      const propertyId = Array.isArray(params.id) ? params.id[0] : params.id;
      await updateProperty(propertyId, propertyData);
      
      alert('Inzerát bol úspešne aktualizovaný!');
      router.push(`/nehnutelnosti/${propertyId}`);
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Nastala chyba pri aktualizácii inzerátu. Skúste to znova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // In a real app, you would upload these to Firebase Storage
    // For now, we'll just create URLs for preview
    const fileUrls = Array.from(files).map(file => URL.createObjectURL(file));
    
    updateFormData('images', [...formData.images, ...fileUrls]);
  };
  
  // Remove an image
  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    updateFormData('images', newImages);
  };

  if (loading) {
    return (
      <div className="container py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
          <div className="h-64 bg-gray-200 rounded mb-8"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Chyba</h1>
        <p className="text-red-500 mb-6">{error}</p>
        <button 
          onClick={() => router.push('/nehnutelnosti')}
          className="btn btn-primary"
        >
          Späť na zoznam nehnuteľností
        </button>
      </div>
    );
  }

  return (
    <NoSSR>
      {!user ? (
        <div className="container py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Upraviť inzerát</h1>
          <p className="mb-6">Pre úpravu inzerátu sa musíte prihlásiť</p>
          <button 
            onClick={() => router.push('/auth/login')}
            className="btn btn-primary"
          >
            Prihlásiť sa
          </button>
        </div>
      ) : (
        <div className="container py-16">
          <h1 className="text-3xl font-bold mb-8">Upraviť inzerát</h1>
          
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
                          formData.propertyType === type 
                            ? 'border-primary bg-primary/5 text-primary' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={() => updateFormData('propertyType', type as 'apartment' | 'house' | 'land' | 'commercial')}
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
                    <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">Plocha (m²)</label>
                    <input
                      type="number"
                      id="area"
                      value={formData.area}
                      onChange={(e) => updateFormData('area', e.target.value)}
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Fotografie</label>
                  
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={image} 
                            alt={`Property image ${index + 1}`} 
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    </div>
                    <p className="text-gray-700 mb-2">Pretiahnite sem fotografie alebo</p>
                    <label className="btn btn-outline cursor-pointer">
                      Vyberte súbory
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">Maximálne 10 fotografií (JPG, PNG)</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">Kontaktná osoba</label>
                    <input
                      type="text"
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => updateFormData('contactName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={user.displayName || "Vaše meno"}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">Telefónne číslo</label>
                    <input
                      type="tel"
                      id="contactPhone"
                      value={formData.contactPhone}
                      onChange={(e) => updateFormData('contactPhone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="+421 XXX XXX XXX"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      id="contactEmail"
                      value={formData.contactEmail}
                      onChange={(e) => updateFormData('contactEmail', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={user.email || "vas@email.sk"}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="contactVisibility" className="block text-sm font-medium text-gray-700 mb-1">Zobrazenie kontaktu</label>
                    <select
                      id="contactVisibility"
                      value={formData.contactVisibility}
                      onChange={(e) => updateFormData('contactVisibility', e.target.value)}
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
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Ukladám...' : 'Uložiť zmeny'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </NoSSR>
  );
}
