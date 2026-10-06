import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useTranslation, SUPPORTED_LANGUAGES, SUPPORTED_LANGUAGES_LIST } from '../i18n';
import { useAuthStore } from '../store/authStore';

export const LanguageSelector: React.FC = () => {
  const { t, currentLanguage, changeLanguage } = useTranslation();
  const { updateProfile } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangObj =
    SUPPORTED_LANGUAGES[currentLanguage] || SUPPORTED_LANGUAGES['en'] || { code: 'en', name: 'English', nativeName: 'English' };

  const handleSelect = (code: string) => {
    changeLanguage(code);
    updateProfile({ languagePreference: code });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors focus:outline-none"
      >
        <Globe className="w-4 h-4 text-emerald-500" />
        <span className="hidden sm:inline">{currentLangObj.nativeName}</span>
        <span className="sm:hidden font-mono uppercase">{currentLangObj.code}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-2 max-h-72 overflow-y-auto animate-fade-in">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
            {SUPPORTED_LANGUAGES_LIST.length} {t('Supported Interface Languages', 'Supported Interface Languages')}
          </div>
          {SUPPORTED_LANGUAGES_LIST.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-all text-left ${
                lang.code === currentLanguage
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">{lang.nativeName}</span>
                <span className="text-[10px] text-slate-400">({lang.name})</span>
              </div>
              {lang.code === currentLanguage && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
