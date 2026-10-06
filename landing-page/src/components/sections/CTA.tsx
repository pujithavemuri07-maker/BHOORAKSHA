import React from 'react';
import { ArrowRight, Shield } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface CTAProps {
  onOpenPortals: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onOpenPortals }) => {
  const { t } = useTranslation();

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-emerald-900/60 via-slate-900/80 to-teal-900/60 border border-emerald-500/30 p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          {t('Ready to Modernize Land Protection?')}
        </h2>
        <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
          {t('Experience the complete platform across all 7 operational roles. Access Citizen document upload, Patwari transcription, and Collector analytics right now.')}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={onOpenPortals}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-8 py-4 rounded-2xl text-sm shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <span>{t('Explore All 7 Role Portals')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
