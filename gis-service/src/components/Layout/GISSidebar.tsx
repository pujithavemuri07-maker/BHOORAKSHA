import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../../i18n';
import {
  LayoutDashboard,
  Layers,
  History,
  User,
  LogOut,
  MapPin,
  Eye,
  HelpCircle,
  ExternalLink,
  BookOpen,
  X,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useGISStore } from '../../store/gisStore';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

interface GISSidebarProps {
  onCloseMobile?: () => void;
}

export const GISSidebar = ({ onCloseMobile }: GISSidebarProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);
  const applications = useGISStore((s) => s.applications);

  const pendingCount = applications.filter((a) => a.status === 'pending_gis_review').length;

  const navItems = [
    {
      label: t('gis.dashboard'),
      icon: <LayoutDashboard className="w-5 h-5" />,
      href: '/gis/dashboard',
    },
    {
      label: t('gis.reviewQueue'),
      icon: <MapPin className="w-5 h-5" />,
      href: '/gis/review',
      badge: pendingCount,
    },
    {
      label: t('oldDocuments.legacyRecords', 'Legacy Records'),
      icon: <BookOpen className="w-5 h-5" />,
      href: '/gis/legacy-records',
      badge: 2,
    },
    {
      label: t('gis.history'),
      icon: <History className="w-5 h-5" />,
      href: '/gis/history',
    },
    {
      label: t('gis.profile'),
      icon: <User className="w-5 h-5" />,
      href: '/gis/profile',
    },
    {
      label: t('gis.help'),
      icon: <HelpCircle className="w-5 h-5" />,
      href: '/gis/help',
    },
  ];

  return (
    <aside className="w-64 h-full bg-slate-950 flex flex-col justify-between select-none">
      {/* Top Section */}
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-teal-500/20">
              <Eye className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide text-white">BHOORAKSHA</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-400 border border-teal-500/30">
                  भूरक्षा
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{t('GIS Review Portal')}</p>
            </div>
          </div>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const active = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onCloseMobile}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all',
                  active
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(active ? 'text-white' : 'text-slate-400')}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Portal Switcher & Logout Footer */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
          {t('Switch Portal')}
        </div>

        <div className="space-y-1 text-xs">
          <a
            href="/legal/review"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-900 transition-colors"
          >
            <span className="text-[11px]">{t('Legal Portal')}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="/verifier/review"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-900 transition-colors"
          >
            <span className="text-[11px]">{t('Verifier Portal')}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="/deo/"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-900 transition-colors"
          >
            <span className="text-[11px]">{t('DEO Portal')}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="/citizen/"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-400 hover:text-teal-400 hover:bg-slate-900 transition-colors"
          >
            <span className="text-[11px]">{t('Citizen Portal')}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <button
          onClick={() => {
            logout();
            toast.success('Logged out successfully');
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 border border-rose-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('common.logout')}</span>
        </button>
      </div>
    </aside>
  );
};
