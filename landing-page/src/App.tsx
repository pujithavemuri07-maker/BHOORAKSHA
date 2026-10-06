import React, { useState } from 'react';
import { ThreeDBackground } from './components/ThreeDBackground';
import { GlassNavbar } from './components/GlassNavbar';
import { Hero } from './components/sections/Hero';
import { Stats } from './components/sections/Stats';
import { Features } from './components/sections/Features';
import { HowItWorks } from './components/sections/HowItWorks';
import { Testimonials } from './components/sections/Testimonials';
import { CTA } from './components/sections/CTA';
import { Footer } from './components/sections/Footer';
import { X, ExternalLink, Key, ArrowRight, Eye } from 'lucide-react';
import { ForgotPasswordModal } from '@shared/components/ForgotPasswordModal';
import { PORTAL_CONFIGS } from '@shared/constants/portalConfig';
import { useTranslation } from './i18n';

export const App: React.FC = () => {
  const { t, currentLanguage, changeLanguage } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
        setIsForgotPasswordOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* 3D Wireframe Terrain Canvas */}
      <ThreeDBackground />

      {/* Navigation Header */}
      <GlassNavbar
        currentLang={currentLanguage}
        onLanguageChange={changeLanguage}
        onSelectRoleModal={() => setIsModalOpen(true)}
      />

      {/* Landing Page Content Sections */}
      <main className="relative z-10">
        <Hero onOpenPortals={() => setIsModalOpen(true)} />
        <Stats />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA onOpenPortals={() => setIsModalOpen(true)} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Role Selection Modal */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative"
          >
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{t('Select Role Portal')}</h3>
                  <p className="text-xs text-slate-400">
                    {t('Direct access to the 7 dedicated role services in the Bhooraksha architecture')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {PORTAL_CONFIGS.map((portal) => (
                <a
                  key={portal.code}
                  href={portal.path}
                  onClick={() => {
                    try {
                      localStorage.removeItem(`bhooraksha_${portal.code}_logged_out`);
                    } catch (err) {
                      // ignore localStorage access errors
                    }
                  }}
                  className="glass-card p-5 rounded-2xl hover:border-emerald-500/40 hover:bg-slate-800/40 transition-all flex flex-col justify-between cursor-pointer group text-left block"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">{t(portal.name)}</span>
                      <span
                        className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${portal.badgeColor}`}
                      >
                        Port {portal.port}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-emerald-400 mb-2">
                      {t(portal.realWorld)}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{t(portal.desc)}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-mono">
                      /{portal.code}/
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                      <span>{t('Launch Portal')}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" />
                <span>
                  {t('Default development login for official roles:')} <code className="text-emerald-400">Password@123</code>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(true)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 transition"
              >
                {t('Forgot Password? (OTP Recovery)')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Flow Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </div>
  );
};
