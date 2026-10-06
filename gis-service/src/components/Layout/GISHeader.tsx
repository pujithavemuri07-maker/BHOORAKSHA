import { Menu, MapPin, AlertTriangle, LogOut } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { LanguageSelector } from '../LanguageSelector';
import { NotificationBell } from '../NotificationBell';
import { useAuthStore } from '../../store/authStore';
import { useGISStore } from '../../store/gisStore';
import toast from 'react-hot-toast';

interface GISHeaderProps {
  onToggleSidebar?: () => void;
}

export const GISHeader = ({ onToggleSidebar }: GISHeaderProps) => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const applications = useGISStore((s) => s.applications);

  const pending = applications.filter((a) => a.status === 'pending_gis_review').length;
  const overlaps = applications.filter(
    (a) => a.trafficLight === 'red' || a.trafficLight === 'yellow'
  ).length;

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-teal-400" />
                {t('gis.dashboard')}
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-slate-800 text-teal-300 px-2 py-0.5 rounded-full border border-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                {t('Cadastral Survey Wing')} • {t('License')}: {user?.licenseNumber || 'SURV/TEL/2014/8821'}
              </span>
              {import.meta.env.VITE_DEMO_MODE !== 'false' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {t('DEMO / SIMULATED')}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              {t('gis.pendingGISReview')}: <span className="text-amber-400 font-semibold">{pending}</span> •{' '}
              {t('gis.overlapsDetected')}:{' '}
              <span className="text-red-400 font-semibold flex-inline items-center gap-1">
                <AlertTriangle className="w-3 h-3 inline pb-0.5" />
                {overlaps}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSelector />
          <NotificationBell />

          {/* User Badge */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-slate-950 font-bold text-xs shadow-md">
              {user?.name?.charAt(0) || 'G'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-slate-100 leading-none">
                {user?.name || 'S. Ramakrishna'}
              </div>
              <div className="text-[10px] text-teal-400/90 mt-0.5">
                {user?.designation ? t(user.designation) : t('Senior GIS Specialist')}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              toast.success('Logged out successfully');
            }}
            title={t('common.logout') || 'Sign Out'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t('common.logout') || 'Sign Out'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
