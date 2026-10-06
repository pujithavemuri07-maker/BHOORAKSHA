import React from 'react';
import { Eye, ChevronRight } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';

import { useTranslation } from '../i18n';

interface GlassNavbarProps {
  currentLang: string;
  onLanguageChange: (lang: string) => void;
  onSelectRoleModal: () => void;
}

export const GlassNavbar: React.FC<GlassNavbarProps> = ({
  currentLang,
  onLanguageChange,
  onSelectRoleModal,
}) => {
  const { t } = useTranslation();
  const isDemoMode = import.meta.env.VITE_DEMO_MODE !== 'false';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Eye className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                {t('common.appName', 'Bhooraksha')}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                भूरक्षा
              </span>
              {isDemoMode && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-mono font-bold border border-amber-500/30 tracking-wider">
                  DEMO / SIMULATED
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">
              National Land Record AI Network
            </p>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-emerald-400 transition-colors">
            {t('Core Features')}
          </a>
          <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">
            {t('Workflow')}
          </a>
          <a href="#stats" className="hover:text-emerald-400 transition-colors">
            {t('Impact')}
          </a>
          <a href="#testimonials" className="hover:text-emerald-400 transition-colors">
            {t('Government Trust')}
          </a>
        </nav>

        {/* Right CTA & Language */}
        <div className="flex items-center gap-4">
          <LanguageSelector
            currentLanguage={currentLang}
            onLanguageChange={onLanguageChange}
          />
          <button
            onClick={onSelectRoleModal}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <span>{t('Role Portals')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
