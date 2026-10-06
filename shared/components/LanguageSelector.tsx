import React from 'react';
import { SUPPORTED_LANGUAGES } from '../constants/languages';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
  className = '',
}) => {
  return (
    <div className={`relative inline-flex items-center gap-2 ${className}`}>
      <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
      <select
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 text-sm rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all cursor-pointer shadow-sm hover:border-emerald-500"
      >
        {Object.values(SUPPORTED_LANGUAGES).map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName} ({lang.name})
          </option>
        ))}
      </select>
    </div>
  );
};
