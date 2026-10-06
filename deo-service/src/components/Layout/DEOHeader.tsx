import React from 'react';
import { Menu, Eye } from 'lucide-react';
import { LanguageSelector } from '../LanguageSelector';
import { NotificationBell } from '../NotificationBell';
import { useAuth } from '../../hooks/useAuth';
import { useDEOApplications } from '../../hooks/useDEOApplications';
import { useTranslation } from '../../i18n';

interface DEOHeaderProps {
  onOpenSidebar: () => void;
}

export const DEOHeader: React.FC<DEOHeaderProps> = ({ onOpenSidebar }) => {
  const { user } = useAuth();
  const { data } = useDEOApplications();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>{t('deo.dashboard')}</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                <Eye className="w-3 h-3" />
                {user?.office ? t(user.office) : t('Tahsildar Office')}
              </span>
              {import.meta.env.VITE_DEMO_MODE !== 'false' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {t('DEMO / SIMULATED')}
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {t('deo.pendingApplications')}: <span className="font-bold text-amber-400 font-mono">{data?.pending || 0}</span>
              {' • '}
              {t('deo.apiFailures')}: <span className="font-bold text-rose-400 font-mono">{data?.apiFailures || 0}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSelector />
          <NotificationBell />
          
          {/* DEO Officer User Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-amber-600/20">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-white leading-tight">{user?.name || 'Suresh G. Patil'}</p>
              <p className="text-[10px] text-amber-400/90 font-medium leading-tight">
                {user?.designation ? t(user.designation) : t('Patwari (Maker)')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
