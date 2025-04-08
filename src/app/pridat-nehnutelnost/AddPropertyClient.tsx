'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/FirebaseAuthContext';
import { addProperty } from '@/utils/firebase/firestore';
import { uploadFile } from '@/utils/firebase/storage';

interface FormData {
  title: string;
  description: string;
  price: string;
  location: string;
  area: string;
  rooms: string;
  bathrooms: string;
  propertyType: string;
  images: File[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactVisibility: string;
  features: string[];
  landSize: string;
}

const initialFormData: FormData = {
  title: '',
  description: '',
  price: '',
  location: '',
  area: '',
  rooms: '',
  bathrooms: '',
  propertyType: 'apartment',
  images: [],
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  contactVisibility: 'public',
  features: [],
  landSize: '',
};

const propertyTypes = [
  { value: 'apartment', label: 'Byt' },
  { value: 'house', label: 'Dom' },
  { value: 'land', label: 'Pozemok' },
  { value: 'commercial', label: 'Komerčný priestor' },
];

const featureOptions = [
  { id: 'garage', label: 'Garáž' },
  { id: 'balcony', label: 'Balkón' },
  { id: 'garden', label: 'Záhrada' },
  { id: 'elevator', label: 'Výťah' },
  { id: 'parking', label: 'Parkovanie' },
  { id: 'furnished', label: 'Zariadený' },
  { id: 'airConditioning', label: 'Klimatizácia' },
  { id: 'newBuilding', label: 'Novostavba' },
];

export default function AddPropertyClient() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect to login if not authenticated
  if (!authLoading && !user) {
    router.push('/auth/login');
    return null;
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Názov je povinný';
    if (!formData.description.trim()) newErrors.description = 'Popis je povinný';
    if (!formData.price || isNaN(Number(formData.price))) newErrors.price = 'Zadajte platnú cenu';
    if (!formData.location.trim()) newErrors.location = 'Lokalita je povinná';
    if (!formData.area || isNaN(Number(formData.area))) newErrors.area = 'Zadajte platnú plochu';
    
    // Property type specific validations
    if (formData.propertyType === 'apartment' || formData.propertyType === 'house') {
      if (!formData.rooms || isNaN(Number(formData.rooms))) {
        newErrors.rooms = 'Zadajte platný počet izieb';
      }
      if (!formData.bathrooms || isNaN(Number(formData.bathrooms))) {
        newErrors.bathrooms = 'Zadajte platný počet kúpeľní';
      }
    }
    
    if (formData.propertyType === 'house' || formData.propertyType === 'land') {
      if (!formData.landSize || isNaN(Number(formData.landSize))) {
        newErrors.landSize = 'Zadajte platnú rozlohu pozemku';
      }
    }
    
    // Contact information validation
    if (!formData.contactName.trim()) newErrors.contactName = 'Meno je povinné';
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Telefón je povinný';
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Email je povinný';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Zadajte platný email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name as keyof FormData]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormData];
        return newErrors;
      });
    }
  };

  const handleFeatureToggle = (featureId: string) => {
    setFormData(prev => {
      const features = [...prev.features];
      if (features.includes(featureId)) {
        return { ...prev, features: features.filter(id => id !== featureId) };
      } else {
        return { ...prev, features: [...features, featureId] };
      }
    });
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (newFiles.length > 0) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...newFiles]
        }));
        
        // Generate preview URLs
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setImagePreviewUrls(prev => [...prev, ...newPreviews]);
      }
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => {
      const images = [...prev.images];
      images.splice(index, 1);
      return { ...prev, images };
    });
    
    setImagePreviewUrls(prev => {
      const urls = [...prev];
      URL.revokeObjectURL(urls[index]); // Clean up the URL
      urls.splice(index, 1);
      return urls;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo(0, 0); // Scroll to top to show errors
      return;
    }
    
    if (!user) {
      setSubmitError('Pre pridanie nehnuteľnosti sa musíte prihlásiť');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Upload images first and get their URLs
      const imageUrls: string[] = [];
      
      // Extract user ID safely
      let userId = '';
      if (user && typeof user === 'object') {
        if ('uid' in user) {
          userId = user.uid as string;
        } else if ('id' in user) {
          userId = (user as any).id as string;
        }
      } else if (typeof user === 'string') {
        userId = user;
      }
      
      if (!userId) {
        throw new Error('Unable to determine user ID');
      }
      
      if (formData.images.length > 0) {
        for (const image of formData.images) {
          const timestamp = Date.now();
          const fileName = `properties/${userId}/${timestamp}_${image.name}`;
          const url = await uploadFile(fileName, image);
          imageUrls.push(url);
        }
      }
      
      // Convert numeric fields
      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        location: formData.location,
        area: parseFloat(formData.area),
        rooms: formData.rooms ? parseInt(formData.rooms) : undefined,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
        propertyType: formData.propertyType as 'apartment' | 'house' | 'land' | 'commercial',
        userId: userId,
        images: imageUrls,
        landSize: formData.landSize ? parseFloat(formData.landSize) : undefined,
        features: formData.features,
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        contactVisibility: formData.contactVisibility,
        isNew: true, // Mark as new property
      };
      
      // Add property to database
      const propertyId = await addProperty(propertyData);
      
      // Redirect to success page or property detail
      router.push(`/dashboard?success=property-added`);
    } catch (error) {
      console.error('Error adding property:', error);
      setSubmitError('Nastala chyba pri pridávaní nehnuteľnosti. Skúste to prosím znova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">Pridať nehnuteľnosť</h1>
      
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
          {submitError}
        </div>
      )}
      
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-6">
          <p className="font-semibold">Opravte nasledujúce chyby:</p>
          <ul className="list-disc list-inside">
            {Object.values(errors).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">
            Základné informácie
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Názov*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`form-input block w-full rounded-md shadow-sm ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Napr. 3-izbový byt v centre Bratislavy"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>
            
            <div>
              <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
                Typ nehnuteľnosti*
              </label>
              <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="form-select block w-full rounded-md shadow-sm border-gray-300"
              >
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Cena*
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`form-input block w-full rounded-md shadow-sm pr-8 ${
                    errors.price ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Zadajte cenu"
                  min="0"
                  step="0.01"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500">€</span>
                </div>
              </div>
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Lokalita*
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`form-input block w-full rounded-md shadow-sm ${
                  errors.location ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Mesto, mestská časť, ulica..."
              />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>
            
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                Úžitková plocha* (m²)
              </label>
              <input
                type="number"
                id="area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                className={`form-input block w-full rounded-md shadow-sm ${
                  errors.area ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Plocha v m²"
                min="0"
              />
              {errors.area && <p className="mt-1 text-sm text-red-600">{errors.area}</p>}
            </div>
            
            {(formData.propertyType === 'house' || formData.propertyType === 'land') && (
              <div>
                <label htmlFor="landSize" className="block text-sm font-medium text-gray-700 mb-1">
                  Plocha pozemku (m²)
                </label>
                <input
                  type="number"
                  id="landSize"
                  name="landSize"
                  value={formData.landSize}
                  onChange={handleChange}
                  className={`form-input block w-full rounded-md shadow-sm ${
                    errors.landSize ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Plocha pozemku v m²"
                  min="0"
                />
                {errors.landSize && <p className="mt-1 text-sm text-red-600">{errors.landSize}</p>}
              </div>
            )}
            
            {(formData.propertyType === 'apartment' || formData.propertyType === 'house') && (
              <>
                <div>
                  <label htmlFor="rooms" className="block text-sm font-medium text-gray-700 mb-1">
                    Počet izieb
                  </label>
                  <input
                    type="number"
                    id="rooms"
                    name="rooms"
                    value={formData.rooms}
                    onChange={handleChange}
                    className={`form-input block w-full rounded-md shadow-sm ${
                      errors.rooms ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Počet izieb"
                    min="0"
                  />
                  {errors.rooms && <p className="mt-1 text-sm text-red-600">{errors.rooms}</p>}
                </div>
                
                <div>
                  <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                    Počet kúpeľní
                  </label>
                  <input
                    type="number"
                    id="bathrooms"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className={`form-input block w-full rounded-md shadow-sm ${
                      errors.bathrooms ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Počet kúpeľní"
                    min="0"
                  />
                  {errors.bathrooms && <p className="mt-1 text-sm text-red-600">{errors.bathrooms}</p>}
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">
            Popis nehnuteľnosti
          </h2>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Popis*
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className={`form-textarea block w-full rounded-md shadow-sm ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Detailný popis nehnuteľnosti..."
            ></textarea>
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">
            Vlastnosti a vybavenie
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {featureOptions.map(feature => (
              <div key={feature.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={feature.id}
                  checked={formData.features.includes(feature.id)}
                  onChange={() => handleFeatureToggle(feature.id)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded"
                />
                <label htmlFor={feature.id} className="ml-2 text-sm text-gray-700">
                  {feature.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">
            Fotografie
          </h2>
          
          <div className="mb-4">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-50 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors"
            >
              Pridať fotografie
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Môžete nahrať viac fotografií naraz. Prvá fotografia bude použitá ako hlavná.
            </p>
          </div>
          
          {imagePreviewUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imagePreviewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">
            Kontaktné údaje
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                Meno*
              </label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                className={`form-input block w-full rounded-md shadow-sm ${
                  errors.contactName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Vaše meno"
              />
              {errors.contactName && <p className="mt-1 text-sm text-red-600">{errors.contactName}</p>}
            </div>
            
            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefón*
              </label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className={`form-input block w-full rounded-md shadow-sm ${
                  errors.contactPhone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Telefónne číslo"
              />
              {errors.contactPhone && <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>}
            </div>
            
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Email*
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className={`form-input block w-full rounded-md shadow-sm ${
                  errors.contactEmail ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Váš email"
              />
              {errors.contactEmail && <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>}
            </div>
            
            <div>
              <label htmlFor="contactVisibility" className="block text-sm font-medium text-gray-700 mb-1">
                Zobrazenie kontaktu
              </label>
              <select
                id="contactVisibility"
                name="contactVisibility"
                value={formData.contactVisibility}
                onChange={handleChange}
                className="form-select block w-full rounded-md shadow-sm border-gray-300"
              >
                <option value="public">Verejné - zobraziť všetky kontakty</option>
                <option value="phone">Len telefón</option>
                <option value="email">Len email</option>
                <option value="private">Súkromné - používať kontaktný formulár</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Zrušiť
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Pridávam...' : 'Pridať nehnuteľnosť'}
          </button>
        </div>
      </form>
    </div>
  );
}
