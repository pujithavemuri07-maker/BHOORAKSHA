import { useState, useEffect } from 'react';
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  SUPPORTED_LANGUAGES_LIST,
  isRTLLanguage,
} from '../constants/languages';
import { DOMAIN_LOCALES } from './domainLocales';
import { PHRASE_DICTIONARY } from './phraseDictionary';

// Static imports for all 18 locales
import en from './locales/en/translation.json';
import hi from './locales/hi/translation.json';
import bn from './locales/bn/translation.json';
import ta from './locales/ta/translation.json';
import te from './locales/te/translation.json';
import mr from './locales/mr/translation.json';
import gu from './locales/gu/translation.json';
import kn from './locales/kn/translation.json';
import ml from './locales/ml/translation.json';
import or from './locales/or/translation.json';
import pa from './locales/pa/translation.json';
import as from './locales/as/translation.json';
import ur from './locales/ur/translation.json';
import sa from './locales/sa/translation.json';
import kok from './locales/kok/translation.json';
import mai from './locales/mai/translation.json';
import ks from './locales/ks/translation.json';
import ne from './locales/ne/translation.json';

export const TRANSLATION_MAP: Record<string, any> = {
  en,
  hi,
  bn,
  ta,
  te,
  mr,
  gu,
  kn,
  ml,
  or,
  pa,
  as,
  ur,
  sa,
  kok,
  mai,
  ks,
  ne,
};

const STORAGE_KEY = 'bhooraksha_language';

export const getCookieLanguage = (): string | null => {
  try {
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(?:^|; )bhooraksha_language=([^;]*)/);
      if (match && match[1] && SUPPORTED_LANGUAGES[match[1]]) {
        return match[1];
      }
    }
  } catch (e) {
    // Ignore cookie errors
  }
  return null;
};

export const setCookieLanguage = (lang: string): void => {
  try {
    if (typeof document !== 'undefined') {
      document.cookie = `bhooraksha_language=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    }
  } catch (e) {
    // Ignore cookie errors
  }
};

export const applyLanguageDom = (lang: string): void => {
  if (typeof document === 'undefined') return;
  try {
    const isRtl = isRTLLanguage(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('data-direction', isRtl ? 'rtl' : 'ltr');
    if (document.body) {
      document.body.dir = isRtl ? 'rtl' : 'ltr';
    }
  } catch (e) {
    // Ignore DOM attribute errors
  }
};

export const getSavedLanguage = (): string => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED_LANGUAGES[saved]) {
        return saved;
      }
    }
  } catch (e) {
    // Ignore storage errors
  }
  const cookieLang = getCookieLanguage();
  if (cookieLang) return cookieLang;
  return DEFAULT_LANGUAGE;
};

let currentGlobalLanguage = getSavedLanguage();
const globalListeners: Set<(lang: string) => void> = new Set();

// Initial DOM sync
if (typeof document !== 'undefined') {
  applyLanguageDom(currentGlobalLanguage);
}

// Cross-microfrontend BroadcastChannel
let i18nChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    i18nChannel = new BroadcastChannel('bhooraksha_i18n');
    i18nChannel.onmessage = (event) => {
      if (event.data?.type === 'LANGUAGE_CHANGE' && event.data?.lang && SUPPORTED_LANGUAGES[event.data.lang]) {
        if (currentGlobalLanguage !== event.data.lang) {
          currentGlobalLanguage = event.data.lang;
          applyLanguageDom(event.data.lang);
          globalListeners.forEach((fn) => fn(event.data.lang));
        }
      }
    };
  }
} catch (e) {
  // BroadcastChannel unavailable
}

export const getGlobalLanguage = (): string => currentGlobalLanguage;

export const setGlobalLanguage = (lang: string): void => {
  const validLang = SUPPORTED_LANGUAGES[lang] ? lang : DEFAULT_LANGUAGE;
  currentGlobalLanguage = validLang;
  setCookieLanguage(validLang);
  applyLanguageDom(validLang);

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, validLang);
      window.dispatchEvent(new CustomEvent('bhooraksha_language_change', { detail: { lang: validLang } }));
    }
    if (i18nChannel) {
      i18nChannel.postMessage({ type: 'LANGUAGE_CHANGE', lang: validLang });
    }
  } catch (e) {
    // Ignore storage errors
  }

  globalListeners.forEach((fn) => fn(validLang));
};

if (typeof window !== 'undefined') {
  const syncLanguageFromStorageOrCookie = () => {
    const latestLang = getCookieLanguage() || getSavedLanguage();
    if (latestLang && latestLang !== currentGlobalLanguage && SUPPORTED_LANGUAGES[latestLang]) {
      currentGlobalLanguage = latestLang;
      applyLanguageDom(latestLang);
      globalListeners.forEach((fn) => fn(latestLang));
    }
  };

  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && e.newValue && SUPPORTED_LANGUAGES[e.newValue]) {
      currentGlobalLanguage = e.newValue;
      setCookieLanguage(e.newValue);
      applyLanguageDom(e.newValue);
      globalListeners.forEach((fn) => fn(e.newValue));
    }
  });

  window.addEventListener('bhooraksha_language_change', (e: any) => {
    if (e.detail?.lang && SUPPORTED_LANGUAGES[e.detail.lang]) {
      currentGlobalLanguage = e.detail.lang;
      setCookieLanguage(e.detail.lang);
      applyLanguageDom(e.detail.lang);
      globalListeners.forEach((fn) => fn(e.detail.lang));
    }
  });

  window.addEventListener('focus', syncLanguageFromStorageOrCookie);
  window.addEventListener('visibilitychange', syncLanguageFromStorageOrCookie);
}

export const getTranslation = (lang: string = DEFAULT_LANGUAGE) => {
  return TRANSLATION_MAP[lang] || TRANSLATION_MAP[DEFAULT_LANGUAGE];
};

const normalizePhrase = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^\w\s']/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const NORMALIZED_PHRASE_DICT: Record<string, Record<string, string>> = {};

const getNormalizedPhrase = (lang: string, candidate: string | undefined): string | null => {
  if (!candidate || lang === 'en') return null;
  if (!NORMALIZED_PHRASE_DICT[lang] && PHRASE_DICTIONARY[lang]) {
    const normMap: Record<string, string> = {};
    for (const [k, v] of Object.entries(PHRASE_DICTIONARY[lang])) {
      normMap[normalizePhrase(k)] = v;
    }
    NORMALIZED_PHRASE_DICT[lang] = normMap;
  }
  const normCandidate = normalizePhrase(candidate);
  return NORMALIZED_PHRASE_DICT[lang]?.[normCandidate] || null;
};

const KEY_ALIASES: Record<string, string> = {
  'navigation.dashboard': 'nav.dashboard',
  'navigation.upload': 'upload.title',
  'navigation.applications': 'metrics.totalApplications',
  'navigation.profile': 'nav.profile',
  'navigation.help': 'help',
  'nav.features': 'Core Features',
  'nav.workflow': 'Workflow',
  'nav.stats': 'Impact',
  'nav.testimonials': 'Government Trust',
  'nav.portals': 'Role Portals',
};

const getNestedValue = (obj: any, path: string): string | null => {
  if (!obj || !path) return null;
  const parts = path.split('.');
  let current: any = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return null;
    }
  }
  return typeof current === 'string' ? current : null;
};

export type TranslationParams = Record<string, string | number>;

export const interpolate = (text: string, params?: TranslationParams): string => {
  if (!text || !params) return text;
  return text
    .replace(/\{(\w+)\}/g, (match, key) => (key in params ? String(params[key]) : match))
    .replace(/\{\{(\w+)\}\}/g, (match, key) => (key in params ? String(params[key]) : match));
};

export const translateKey = (
  keyPath: string,
  lang: string = DEFAULT_LANGUAGE,
  localLocales?: Record<string, string>,
  fallbackOrParams?: string | TranslationParams,
  maybeParams?: TranslationParams
): string => {
  if (!keyPath) return '';
  const fallback = typeof fallbackOrParams === 'string' ? fallbackOrParams : undefined;
  const params =
    typeof fallbackOrParams === 'object' && fallbackOrParams !== null
      ? fallbackOrParams
      : maybeParams;

  // 1. Direct TRANSLATION_MAP[lang] lookup
  const exactTranslation = getNestedValue(TRANSLATION_MAP[lang], keyPath);
  if (exactTranslation) {
    return interpolate(exactTranslation, params);
  }

  // 2. Alias lookup in TRANSLATION_MAP[lang]
  const aliasKey = KEY_ALIASES[keyPath];
  if (aliasKey) {
    const aliasTranslation = getNestedValue(TRANSLATION_MAP[lang], aliasKey);
    if (aliasTranslation) return interpolate(aliasTranslation, params);
  }

  // 3. DOMAIN_LOCALES[lang]
  if (DOMAIN_LOCALES[lang]?.[keyPath]) {
    return interpolate(DOMAIN_LOCALES[lang][keyPath], params);
  }

  // If English, return best available English string
  if (lang === 'en') {
    if (fallback) return interpolate(fallback, params);
    if (localLocales?.[keyPath]) return interpolate(localLocales[keyPath], params);
    const enVal = getNestedValue(TRANSLATION_MAP['en'], keyPath);
    if (enVal) return interpolate(enVal, params);
    if (PHRASE_DICTIONARY['en']?.[keyPath]) return interpolate(PHRASE_DICTIONARY['en'][keyPath], params);
    if (keyPath.includes(' ') || (!keyPath.includes('.') && /^[A-Z]/.test(keyPath))) {
      return interpolate(keyPath, params);
    }
    const lastPart = keyPath.split('.').pop() || keyPath;
    const formatted = lastPart.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()).trim();
    return interpolate(formatted, params);
  }

  // 4. Direct PHRASE_DICTIONARY[lang] exact match
  const dict = PHRASE_DICTIONARY[lang] || {};
  if (dict[keyPath]) return interpolate(dict[keyPath], params);
  if (fallback && dict[fallback]) return interpolate(dict[fallback], params);
  if (localLocales?.[keyPath] && dict[localLocales[keyPath]]) return interpolate(dict[localLocales[keyPath]], params);

  // 5. Check if English TRANSLATION_MAP has an English phrase that maps in PHRASE_DICTIONARY[lang]
  const enVal = getNestedValue(TRANSLATION_MAP['en'], keyPath);
  if (enVal && dict[enVal]) return interpolate(dict[enVal], params);

  // 6. Normalized phrase matching (fuzzy / case-space insensitive)
  const normMatch =
    getNormalizedPhrase(lang, keyPath) ||
    getNormalizedPhrase(lang, fallback) ||
    getNormalizedPhrase(lang, localLocales?.[keyPath]) ||
    getNormalizedPhrase(lang, enVal);
  if (normMatch) return interpolate(normMatch, params);

  // 7. Formatted key last part normalized match
  const lastPart = keyPath.split('.').pop() || keyPath;
  const formattedKey = lastPart.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  const formattedNormMatch = getNormalizedPhrase(lang, formattedKey);
  if (formattedNormMatch) return interpolate(formattedNormMatch, params);

  // 8. Fallbacks
  if (fallback) return interpolate(fallback, params);
  if (localLocales?.[keyPath]) return interpolate(localLocales[keyPath], params);
  if (enVal) return interpolate(enVal, params);
  return interpolate(formattedKey, params);
};

export const useTranslation = (localLocales?: Record<string, string>) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>(getGlobalLanguage());

  useEffect(() => {
    const handleUpdate = (lang: string) => {
      setCurrentLanguage(lang);
      applyLanguageDom(lang);
    };
    globalListeners.add(handleUpdate);
    // Ensure DOM is in sync on mount
    applyLanguageDom(currentLanguage);
    return () => {
      globalListeners.delete(handleUpdate);
    };
  }, [currentLanguage]);

  const changeLanguage = (lang: string) => {
    setGlobalLanguage(lang);
  };

  const t = (
    key: string,
    fallbackOrParams?: string | TranslationParams,
    params?: TranslationParams
  ): string => {
    return translateKey(key, currentLanguage, localLocales, fallbackOrParams, params);
  };

  return {
    t,
    currentLanguage,
    changeLanguage,
    isRTL: isRTLLanguage(currentLanguage),
    supportedLanguages: SUPPORTED_LANGUAGES,
    supportedLanguagesList: SUPPORTED_LANGUAGES_LIST,
    i18n: {
      language: currentLanguage,
      changeLanguage,
    },
  };
};

export const formatDate = (
  date: Date | string | number,
  lang: string = getGlobalLanguage(),
  options?: Intl.DateTimeFormatOptions
): string => {
  try {
    const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    const defaultOptions: Intl.DateTimeFormatOptions = options || {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
    return new Intl.DateTimeFormat(lang === 'ur' ? 'ur-PK' : lang, defaultOptions).format(d);
  } catch {
    return String(date);
  }
};

export const formatNumber = (
  value: number,
  lang: string = getGlobalLanguage(),
  options?: Intl.NumberFormatOptions
): string => {
  try {
    return new Intl.NumberFormat(lang === 'ur' ? 'ur-PK' : lang, options).format(value);
  } catch {
    return String(value);
  }
};

export const formatCurrency = (
  value: number,
  lang: string = getGlobalLanguage(),
  currency: string = 'INR'
): string => {
  try {
    return new Intl.NumberFormat(lang === 'ur' ? 'ur-PK' : lang, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `₹${value}`;
  }
};
