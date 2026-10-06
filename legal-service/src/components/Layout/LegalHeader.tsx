import { Menu, Scale, ShieldAlert } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { LanguageSelector } from '../LanguageSelector';
import { NotificationBell } from '../NotificationBell';
import { useAuthStore } from '../../store/authStore';
import { useLegalStore } from '../../store/legalStore';

interface LegalHeaderProps {
  onToggleSidebar?: () => void;
}

export const LegalHeader = ({ onToggleSidebar }: LegalHeaderProps) => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const applications = useLegalStore((s) => s.applications);

  const pending = applications.filter((a) => a.status === 'pending_legal_review').length;
  const highRisk = applications.filter(
    (a) => a.severity === 'high' || a.status === 'blocked_by_legal'
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
                <Scale className="w-4 h-4 text-indigo-400" />
                {t('legal.dashboard')}
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-slate-800 text-indigo-300 px-2 py-0.5 rounded-full border border-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                {t('Revenue Legal Wing')} • Bar ID: {user?.barCouncilId || 'TS/BAR/2008/4192'}
              </span>
              {import.meta.env.VITE_DEMO_MODE !== 'false' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {t('DEMO / SIMULATED')}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              {t('legal.headerSubtitle', 'Review land-title records, identify legal issues, and record statutory decisions.')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSelector />
          <NotificationBell />

          {/* User Badge */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
              {user?.name?.charAt(0) || 'L'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-slate-100 leading-none">
                {user?.name || 'Adv. Rajeshwari Sharma'}
              </div>
              <div className="text-[10px] text-indigo-400/90 mt-0.5">
                {user?.designation ? t(user.designation) : t('Senior Legal Advisor')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
