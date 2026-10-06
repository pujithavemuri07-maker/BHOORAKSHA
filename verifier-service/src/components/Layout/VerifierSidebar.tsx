import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n';
import toast from 'react-hot-toast';
import {
  LayoutDashboard,
  ListChecks,
  History,
  User,
  LogOut,
  ShieldCheck,
  ExternalLink,
  Eye,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useVerifierStore } from '../../store/verifierStore';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

interface VerifierSidebarProps {
  onCloseMobile?: () => void;
}

export const VerifierSidebar = ({ onCloseMobile }: VerifierSidebarProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const applications = useVerifierStore((s) => s.applications);

  const handleLogout = () => {
    try {
      localStorage.removeItem('bhooraksha_user');
      localStorage.removeItem('bhooraksha_token');
      localStorage.removeItem('bhooraksha_role');
    } catch (e) {
      // ignore
    }
    logout();
    toast.success('Verifier logged out successfully');
    navigate('/login');
  };

  const pendingCount = applications.filter((a) => a.status === 'pending_verification').length;

  const navItems = [
    {
      label: t('verifier.dashboard'),
      icon: <LayoutDashboard className="w-5 h-5" />,
      href: '/verifier/dashboard',
    },
    {
      label: t('verifier.queue'),
      icon: <ListChecks className="w-5 h-5" />,
      href: '/verifier/review',
      badge: pendingCount,
    },
    {
      label: t('oldDocuments.legacyRecords', 'Legacy Records'),
      icon: <BookOpen className="w-5 h-5" />,
      href: '/verifier/legacy-records',
      badge: 2,
    },
    {
      label: t('verifier.history'),
      icon: <History className="w-5 h-5" />,
      href: '/verifier/history',
    },
    {
      label: t('common.profile'),
      icon: <User className="w-5 h-5" />,
      href: '/verifier/profile',
    },
  ];

  const isActive = (href: string) =>
    location.pathname === href || (href !== '/verifier/dashboard' && location.pathname.startsWith(href));

  return (
    <aside className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800/80">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-950">
          <Eye className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold tracking-tight text-white font-mono">
              BHOORAKSHA
            </h1>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-1.5 py-0.5 rounded border border-emerald-500/30">
              भूरक्षा
            </span>
          </div>
          <p className="text-[11px] text-emerald-400/90 font-medium">
            {t('Verifier / Girdawar Portal')}
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {t('Revenue Verification (Checker)')}
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
                  ? 'bg-emerald-600/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
              )}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500 text-slate-950 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-6 mt-4 border-t border-slate-800/80 space-y-1.5">
          <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {t('Support & Ecosystem')}
          </div>
          <Link
            to="/verifier/help"
            onClick={onCloseMobile}
            className={cn(
              'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all',
              location.pathname === '/verifier/help'
                ? 'bg-emerald-600/15 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
            )}
          >
            <HelpCircle className="w-4 h-4" />
            <span>{t('common.help')}</span>
          </Link>
          <a
            href={typeof window !== 'undefined' && window.location.port && window.location.port !== '8080' ? `${window.location.protocol}//${window.location.hostname}:8080/` : '/'}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 transition-all"
          >
            <span className="flex items-center gap-3">
              <ExternalLink className="w-4 h-4" />
              {t('Main Landing Page')}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Bhooraksha</span>
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('common.logout')}</span>
          </button>
        </div>
      </nav>

      {/* Footer info */}
      <div className="px-5 py-3.5 border-t border-slate-800/80 bg-slate-950/70">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">{t('common.online')}</span>
          </div>
          <span className="font-mono text-[10px]">Verifier v2.0.0</span>
        </div>
      </div>
    </aside>
  );
};
