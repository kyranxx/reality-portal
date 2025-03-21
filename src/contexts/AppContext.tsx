'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { useAuth } from '@/utils/FirebaseAuthContext';

// Define available languages
export type Language = 'en' | 'cs' | 'hu';

// Define available themes
export type ThemeType = 'earthy' | 'professional' | 'playful';

// Define theme properties
export interface Theme {
  id: ThemeType;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    card: string;
    border: string;
  };
}

// Define the themes
export const themes: Record<ThemeType, Theme> = {
  earthy: {
    id: 'earthy',
    name: 'Earthy Calm',
    colors: {
      primary: '#8B7355',
      secondary: '#A67F5D',
      accent: '#D2B48C',
      background: '#F5F5DC',
      foreground: '#3A3226',
      card: '#FFFFFF',
      border: '#E8E4D8',
    },
  },
  professional: {
    id: 'professional',
    name: 'Professional Blue',
    colors: {
      primary: '#1E40AF',
      secondary: '#3B82F6',
      accent: '#60A5FA',
      background: '#F9FAFB',
      foreground: '#1F2937',
      card: '#FFFFFF',
      border: '#E5E7EB',
    },
  },
  playful: {
    id: 'playful',
    name: 'Playful Colorful',
    colors: {
      primary: '#8B5CF6',
      secondary: '#EC4899',
      accent: '#F59E0B',
      background: '#FFFFFF',
      foreground: '#4B5563',
      card: '#FFFFFF',
      border: '#F3F4F6',
    },
  },
};

// Define the context type
type AppContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: ThemeType) => void;
  isLoading: boolean;
  t: (key: string, fallback?: string) => string;
};

// Create the context with default values
const AppContext = createContext<AppContextType>({
  language: 'en',
  setLanguage: () => {},
  theme: themes.professional,
  setTheme: () => {},
  isLoading: true,
  t: (key: string, fallback?: string) => fallback || key,
});

// Hook to use the app context
export const useApp = () => useContext(AppContext);

// Import translations
import enCommon from '../../public/locales/en/common.json';
import csCommon from '../../public/locales/cs/common.json';
import huCommon from '../../public/locales/hu/common.json';

// Set up translations
const translations: Record<Language, Record<string, any>> = {
  en: enCommon,
  cs: csCommon,
  hu: huCommon,
};

// Get a nested translation value using a dot-notation path
const getNestedValue = (obj: any, path: string): string => {
  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current === undefined || current === null) {
      return path; // Return the path if we can't traverse further
    }
    current = current[key];
  }

  return current !== undefined && current !== null ? current : path;
};

// Provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [theme, setThemeState] = useState<Theme>(themes.professional);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  // Apply theme to document
  useEffect(() => {
    if (!isLoading && typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--color-primary', theme.colors.primary);
      document.documentElement.style.setProperty('--color-secondary', theme.colors.secondary);
      document.documentElement.style.setProperty('--color-accent', theme.colors.accent);
      document.documentElement.style.setProperty('--color-background', theme.colors.background);
      document.documentElement.style.setProperty('--color-foreground', theme.colors.foreground);
      document.documentElement.style.setProperty('--color-card', theme.colors.card);
      document.documentElement.style.setProperty('--color-border', theme.colors.border);
    }
  }, [theme, isLoading]);

  // Set the html lang attribute based on the current language
  useEffect(() => {
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.lang = language;
    }
  }, [language]);

  // Load language and theme preferences
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        // First check localStorage for all users
        let storedLanguage: Language | null = null;
        let storedTheme: ThemeType | null = null;
        
        if (typeof window !== 'undefined') {
          const localLang = localStorage.getItem('language') as Language;
          const localTheme = localStorage.getItem('theme') as ThemeType;
          
          if (localLang && ['en', 'cs', 'hu'].includes(localLang)) {
            storedLanguage = localLang;
            setLanguageState(localLang);
          }
          
          if (localTheme && themes[localTheme]) {
            storedTheme = localTheme;
            setThemeState(themes[localTheme]);
          }
        }
        
        // For authenticated users, try to get from Firestore
        if (user && db) {
          try {
            const userSettingsRef = doc(db, 'userSettings', user.uid);
            const userSettingsSnap = await getDoc(userSettingsRef);
            
            if (userSettingsSnap.exists()) {
              const data = userSettingsSnap.data();
              
              // Handle language preference
              if (data.language && ['en', 'cs', 'hu'].includes(data.language)) {
                setLanguageState(data.language);
                if (typeof window !== 'undefined') {
                  localStorage.setItem('language', data.language);
                }
              } else if (storedLanguage) {
                // If no valid Firestore language but localStorage exists, save to Firestore
                await setDoc(userSettingsRef, { language: storedLanguage }, { merge: true });
              }
              
              // Handle theme preference
              if (data.theme && typeof data.theme === 'string' && themes[data.theme as ThemeType]) {
                setThemeState(themes[data.theme as ThemeType]);
                if (typeof window !== 'undefined') {
                  localStorage.setItem('theme', data.theme);
                }
              } else if (storedTheme) {
                // If no valid Firestore theme but localStorage exists, save to Firestore
                await setDoc(userSettingsRef, { theme: storedTheme }, { merge: true });
              }
            } else if (storedLanguage || storedTheme) {
              // If no Firestore settings but localStorage exists, save to Firestore
              const dataToSave: any = {};
              if (storedLanguage) dataToSave.language = storedLanguage;
              if (storedTheme) dataToSave.theme = storedTheme;
              await setDoc(userSettingsRef, dataToSave, { merge: true });
            }
          } catch (error) {
            console.error('Error accessing Firestore:', error);
            // Continue with localStorage values if Firestore fails
          }
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  // Function to change language
  const setLanguage = async (lang: Language) => {
    try {
      setLanguageState(lang);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', lang);
      }
      
      // For authenticated users, save to Firestore
      if (user && db) {
        try {
          const userSettingsRef = doc(db, 'userSettings', user.uid);
          await setDoc(userSettingsRef, { language: lang }, { merge: true });
        } catch (error) {
          console.error('Error saving language to Firestore:', error);
          // Continue even if Firestore save fails
        }
      }
      
      // Refresh the page to apply language changes
      // This is a simple approach; for a more sophisticated solution without page reload,
      // you would need to update all components that depend on translations
      router.refresh();
    } catch (error) {
      console.error('Error setting language:', error);
    }
  };

  // Function to change theme
  const setTheme = async (themeType: ThemeType) => {
    try {
      setThemeState(themes[themeType]);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', themeType);
      }
      
      // For authenticated users, save to Firestore
      if (user && db) {
        try {
          const userSettingsRef = doc(db, 'userSettings', user.uid);
          await setDoc(userSettingsRef, { theme: themeType }, { merge: true });
        } catch (error) {
          console.error('Error saving theme to Firestore:', error);
          // Continue even if Firestore save fails
        }
      }
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  };

  // Translation function
  const t = (key: string, fallback?: string): string => {
    // Get the translation from the current language
    const translation = getNestedValue(translations[language], key);

    // If the translation is the same as the key, it means it wasn't found
    if (translation === key) {
      // Try to get the translation from English as a fallback
      if (language !== 'en') {
        const enTranslation = getNestedValue(translations.en, key);
        if (enTranslation !== key) {
          return enTranslation;
        }
      }
      // Return the provided fallback or the key itself
      return fallback || key;
    }

    return translation;
  };

  return (
    <AppContext.Provider value={{ language, setLanguage, theme, setTheme, isLoading, t }}>
      {children}
    </AppContext.Provider>
  );
};
