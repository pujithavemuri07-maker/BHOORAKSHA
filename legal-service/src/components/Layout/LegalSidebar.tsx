import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../../i18n';
import {
  LayoutDashboard,
  Scale,
  History,
  User,
  HelpCircle,
  LogOut,
  ExternalLink,
  ShieldAlert,
  Eye,
  BookOpen,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useLegalStore } from '../../store/legalStore';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

interface LegalSidebarProps {
  onCloseMobile?: () => void;
}

export const LegalSidebar = ({ onCloseMobile }: LegalSidebarProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);
  const applications = useLegalStore((s) => s.applications);

  const pendingCount = applications.filter((a) => a.status === 'pending_legal_review').length;

  const navItems = [
    {
      label: t('legal.dashboard'),
      icon: <LayoutDashboard className="w-5 h-5" />,
      href: '/legal/dashboard',
    },
    {
      label: t('legal.queue'),
      icon: <Scale className="w-5 h-5" />,
      href: '/legal/review',
      badge: pendingCount,
    },
    {
      label: t('oldDocuments.legacyRecords', 'Legacy Records'),
      icon: <BookOpen className="w-5 h-5" />,
      href: '/legal/legacy-records',
      badge: 2,
    },
    {
      label: t('legal.history'),
      icon: <History className="w-5 h-5" />,
      href: '/legal/history',
    },
    {
      label: t('common.profile'),
      icon: <User className="w-5 h-5" />,
      href: '/legal/profile',
    },
  ];

  const isActive = (href: string) =>
    location.pathname === href ||
    (href !== '/legal/dashboard' && location.pathname.startsWith(href));

  return (
    <aside className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800/80">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-950">
          <Eye className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold tracking-tight text-white font-mono">
              BHOORAKSHA
            </h1>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-semibold px-1.5 py-0.5 rounded border border-indigo-500/30">
              विधिक
            </span>
          </div>
          <p className="text-[11px] text-indigo-400 font-medium">
            {t('Legal Officer / Advisor Portal')}
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {t('Statutory Scrutiny')}
        </div>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onCloseMobile}
              className={cn(
                'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all',
                active
                  ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
              )}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-[11px] font-bold font-mono',
                    active
                      ? 'bg-indigo-500 text-white'
                      : 'bg-slate-800 text-amber-400 border border-slate-700'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {t('Statutory Resources')}
        </div>
        <Link
          to="/legal/help"
          onClick={onCloseMobile}
          className={cn(
            'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all',
            location.pathname === '/legal/help'
              ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
          )}
        >
          <HelpCircle className="w-5 h-5" />
          <span>{t('common.help')}</span>
        </Link>
      </nav>

      {/* Footer info */}
      <div className="px-5 py-3.5 border-t border-slate-800/80 bg-slate-950/70 space-y-3">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">{t('common.online')}</span>
          </div>
          <span className="font-mono text-[10px]">Legal Officer v2.0.0</span>
        </div>

        <div className="space-y-1 text-xs">
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
            className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-900 transition-colors"
          >
            <span className="text-[11px]">{t('Citizen Portal')}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <button
          onClick={() => {
            logout();
            toast.success('Logged out successfully');
            setTimeout(() => {
              window.location.href = '/';
            }, 400);
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

