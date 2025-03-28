/**
 * Translation Fixes
 *
 * This utility ensures consistent translations between languages and
 * provides fallbacks for missing translations.
 */

import { Language } from '@/contexts/AppContext';

// Import all language files
import enCommon from '../../public/locales/en/common.json';
import skCommon from '../../public/locales/sk/common.json';
import csCommon from '../../public/locales/cs/common.json';
import huCommon from '../../public/locales/hu/common.json';

// Define the translation records
const translations: Record<Language, Record<string, any>> = {
  en: enCommon,
  sk: skCommon,
  cs: csCommon,
  hu: huCommon,
};

// Fix inconsistent keys between languages
const translationFixes: Record<Language, Record<string, string>> = {
  sk: {
    'nav.signIn': 'Prihlásiť sa / Registrovať', // Updated to match English "Sign In / Register"
    // Add more fixes as needed
  },
  cs: {
    // Czech fixes if needed
  },
  hu: {
    // Hungarian fixes if needed
  },
  en: {
    // English fixes if needed
  },
};

/**
 * Enhanced translation function with fallbacks and fixes
 * @param language Current language
 * @param key Translation key
 * @param fallback Optional fallback text
 * @returns Translated text
 */
export function getTranslation(language: Language, key: string, fallback?: string): string {
  // Check for fixed translations first
  if (translationFixes[language] && translationFixes[language][key]) {
    return translationFixes[language][key];
  }

  // Try to get from current language
  const translation = getNestedValue(translations[language], key);

  // If not found in current language
  if (translation === key) {
    // Try English as fallback
    if (language !== 'en') {
      const enTranslation = getNestedValue(translations.en, key);
      if (enTranslation !== key) {
        return enTranslation;
      }
    }
    // Return provided fallback or key itself
    return fallback || key;
  }

  return translation;
}

/**
 * Get a nested translation value using dot notation
 * @param obj Object to traverse
 * @param path Dot-notation path (e.g., 'nav.home')
 * @returns Found value or path if not found
 */
function getNestedValue(obj: any, path: string): string {
  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current === undefined || current === null) {
      return path; // Return path if we can't traverse further
    }
    current = current[key];
  }

  return current !== undefined && current !== null ? current : path;
}

/**
 * Validate translations for consistency across languages
 * This can be run during build time to detect missing or inconsistent translations
 */
export function validateTranslations(): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  // Get all unique keys from English translations (our source of truth)
  const englishKeys = getAllKeys(translations.en);

  // Check each language against English
  for (const lang of ['sk', 'cs', 'hu'] as Language[]) {
    const langKeys = getAllKeys(translations[lang]);

    // Find missing keys
    const missingKeys = englishKeys.filter(key => !langKeys.includes(key));
    if (missingKeys.length > 0) {
      issues.push(`Language ${lang} is missing keys: ${missingKeys.join(', ')}`);
    }

    // Find extra keys not in English
    const extraKeys = langKeys.filter(key => !englishKeys.includes(key));
    if (extraKeys.length > 0) {
      issues.push(`Language ${lang} has extra keys not in English: ${extraKeys.join(', ')}`);
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Get all translation keys from an object using recursion
 * @param obj Object to extract keys from
 * @param prefix Current key prefix
 * @returns Array of all keys in dot notation
 */
function getAllKeys(obj: any, prefix = ''): string[] {
  let keys: string[] = [];

  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = [...keys, ...getAllKeys(obj[key], prefix ? `${prefix}.${key}` : key)];
    } else {
      keys.push(prefix ? `${prefix}.${key}` : key);
    }
  }

  return keys;
}
