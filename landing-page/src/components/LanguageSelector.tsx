import React from 'react';
import { Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES_LIST } from '../i18n';

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
    <div className={`relative inline-flex items-center gap-1.5 ${className}`}>
      <Globe className="w-4 h-4 text-emerald-400" />
      <select
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="bg-slate-900/90 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all cursor-pointer shadow-sm hover:border-emerald-500"
      >
        {SUPPORTED_LANGUAGES_LIST.map((l) => (
          <option key={l.code} value={l.code} className="bg-slate-900 text-white">
            {l.nativeName} ({l.name})
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
