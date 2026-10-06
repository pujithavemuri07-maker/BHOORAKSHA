import React from 'react';
import { ShieldCheck, Cpu, Map, FileCheck, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface HeroProps {
  onOpenPortals: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenPortals }) => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          {t('AI-Assisted Land Record Verification System')}
        </div>

        {/* Main headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
          {t('Protecting India’s Land Records with')}{' '}
          <span className="text-gradient">{t('Evidence-Based Review')}</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          {t('From multilingual deed OCR and cadastral boundary overlap detection to court encumbrance audits and instant revenue mutation sanctioning.')}
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onOpenPortals}
            className="flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-8 py-4 rounded-2xl text-base shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-1"
          >
            <span>{t('Launch Role Portals')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <a
            href="/citizen/"
            className="flex items-center gap-2 glass-card hover:bg-slate-800/60 text-white font-semibold px-6 py-4 rounded-2xl text-base transition-all border-slate-700"
          >
            <FileCheck className="w-5 h-5 text-emerald-400" />
            <span>{t('Citizen Portal')}</span>
          </a>
        </div>

        {/* Application Status Tracker */}
        <div className="mt-8 max-w-xl mx-auto">
          <div className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center border-emerald-500/20">
            <div className="flex-1 w-full">
              <input
                id="landing-app-tracker"
                type="text"
                placeholder={t('Track Application Status (e.g. REQ-2026-000123)')}
                className="w-full bg-slate-900/80 border border-slate-700 text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder-slate-500"
              />
            </div>
            <a
              href="/citizen/applications"
              className="shrink-0 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all"
            >
              <FileCheck className="w-4 h-4" />
              <span>{t('Track')}</span>
            </a>
          </div>
        </div>


        {/* Feature Highlights Badges */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-card p-4 rounded-xl flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{t('9 Verification Agents')}</div>
              <div className="text-[11px] text-slate-400">{t('Multi-Agent Analysis')}</div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-400">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{t('PostGIS Overlaps')}</div>
              <div className="text-[11px] text-slate-400">{t('GIS Spatial Validation')}</div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{t('Maker-Checker')}</div>
              <div className="text-[11px] text-slate-400">{t('Human-in-the-Loop')}</div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{t('18 Languages')}</div>
              <div className="text-[11px] text-slate-400">{t('18 Supported Interface Languages')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
