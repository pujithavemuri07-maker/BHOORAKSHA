import { useState, useEffect } from 'react';
import {
  translateKey,
  SUPPORTED_LANGUAGES,
  SUPPORTED_LANGUAGES_LIST,
} from '@shared/i18n';
import { SYSTEM_ADMIN_TRANSLATIONS } from './locales';

const getInitialLanguage = (): string => {
  try {
    const saved = localStorage.getItem('bhooraksha_language') || localStorage.getItem('bhooraksha_lang');
    if (saved && (SUPPORTED_LANGUAGES as Record<string, any>)[saved]) {
      return saved;
    }
    const match = document.cookie.match(/(?:^|; )bhooraksha_language=([^;]*)/);
    if (match && match[1] && (SUPPORTED_LANGUAGES as Record<string, any>)[match[1]]) {
      return match[1];
    }
  } catch {}
  return 'en';
};

let globalLanguage = getInitialLanguage();
const listeners: Set<(lang: string) => void> = new Set();

export const setGlobalLanguage = (lang: string) => {
  globalLanguage = lang;
  try {
    localStorage.setItem('bhooraksha_language', lang);
    localStorage.setItem('bhooraksha_lang', lang);
  } catch {}
  listeners.forEach((fn) => fn(lang));
};

export const getGlobalLanguage = () => globalLanguage;

export const useTranslation = () => {
  const [lang, setLang] = useState<string>(globalLanguage);

  useEffect(() => {
    const handler = (newLang: string) => setLang(newLang);
    listeners.add(handler);

    const onGlobalChange = (e: any) => {
      const l = e?.detail?.lang;
      if (l && (SUPPORTED_LANGUAGES as Record<string, any>)[l]) {
        setGlobalLanguage(l);
      }
    };
    window.addEventListener('bhooraksha_language_change', onGlobalChange);

    return () => {
      listeners.delete(handler);
      window.removeEventListener('bhooraksha_language_change', onGlobalChange);
    };
  }, []);

  const changeLanguage = (newLang: string) => {
    setGlobalLanguage(newLang);
  };

  const t = (key: string): string => {
    // 1. Check local language dictionary
    const currentDict = SYSTEM_ADMIN_TRANSLATIONS[lang];
    if (currentDict && currentDict[key]) {
      return currentDict[key];
    }
    // 2. Check shared translateKey
    try {
      const val = translateKey(key, lang);
      if (val && val !== key) return val;
    } catch {
      // fallback
    }
    // 3. Fallback to English dictionary
    if (SYSTEM_ADMIN_TRANSLATIONS['en']?.[key]) {
      return SYSTEM_ADMIN_TRANSLATIONS['en'][key];
    }
    // 4. Prettify key
    const parts = key.split('.');
    return parts[parts.length - 1]
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  return {
    t,
    currentLanguage: lang,
    changeLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES_LIST,
    i18n: {
      language: lang,
      changeLanguage,
    },
  };
};

export { SUPPORTED_LANGUAGES, SUPPORTED_LANGUAGES_LIST };
