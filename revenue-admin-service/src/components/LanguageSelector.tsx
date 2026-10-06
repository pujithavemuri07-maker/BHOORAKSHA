import { Globe } from 'lucide-react';
import { useTranslation, SUPPORTED_LANGUAGES_LIST } from '../i18n';

export const LanguageSelector = () => {
  const { currentLanguage, changeLanguage } = useTranslation();

  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700 text-slate-200 text-xs font-medium hover:border-slate-600 transition-colors shadow-sm">
        <Globe className="w-3.5 h-3.5 text-amber-400" />
        <select
          value={currentLanguage}
          onChange={(e) => changeLanguage(e.target.value)}
          aria-label="Select Official Language"
          className="bg-transparent text-slate-100 text-xs focus:outline-none cursor-pointer pr-1"
        >
          {SUPPORTED_LANGUAGES_LIST.map((lang) => (
            <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-100">
              {lang.nativeName} ({lang.name})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
