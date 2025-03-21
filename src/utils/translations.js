'use client';

// Import translations
import enCommon from '../../public/locales/en/common.json';
import csCommon from '../../public/locales/cs/common.json';
import huCommon from '../../public/locales/hu/common.json';

// Set up translations
export const translations = {
  en: enCommon,
  cs: csCommon,
  hu: huCommon,
};

// Get a nested translation value using a dot-notation path
export const getTranslation = (language, key, fallback) => {
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

// Helper function to get a nested value using a dot-notation path
const getNestedValue = (obj, path) => {
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
