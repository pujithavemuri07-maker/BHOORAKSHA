import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../../i18n';
import { useAuth } from '../../hooks/useAuth';
import { useDEOApplications } from '../../hooks/useDEOApplications';
import {
  LayoutDashboard,
  ListChecks,
  FileSpreadsheet,
  History,
  User,
  LogOut,
  X,
  Eye,
  Layers,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

interface DEOSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DEOSidebar: React.FC<DEOSidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { logout } = useAuth();
  const { data } = useDEOApplications();

  const navItems = [
    {
      label: t('deo.dashboard'),
      icon: LayoutDashboard,
      href: '/deo/dashboard',
    },
    {
      label: t('deo.queue'),
      icon: ListChecks,
      href: '/deo/review',
      badge: data?.pending || 0,
      badgeColor: 'bg-amber-500',
    },
    {
      label: t('deo.manualEntry'),
      icon: FileSpreadsheet,
      href: '/deo/manual-entry',
      badge: data?.apiFailures || 0,
      badgeColor: 'bg-rose-500',
    },
    {
      label: t('oldDocuments.title', 'Old Documents'),
      icon: BookOpen,
      href: '/deo/old-documents',
      badge: 5,
      badgeColor: 'bg-amber-600',
    },
    {
      label: t('deo.history'),
      icon: History,
      href: '/deo/history',
    },
    {
      label: t('common.profile'),
      icon: User,
      href: '/deo/profile',
    },
  ];

  const isActive = (href: string) =>
    location.pathname === href || (href === '/deo/dashboard' && location.pathname === '/deo');

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    setTimeout(() => {
      window.location.href = '/';
    }, 400);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <Link to="/deo/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-600/30">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base tracking-wide text-white">BHOORAKSHA</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  भूरक्षा
                </span>
              </div>
              <p className="text-[11px] text-amber-500 font-medium">{t('Patwari / DEO Portal')}</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 pb-2">
            {t('Revenue Operations (Maker)')}
          </div>
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group',
                  active
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-colors',
                      active ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={cn(
                      'px-2 py-0.5 text-[10px] font-bold text-white rounded-full',
                      item.badgeColor || 'bg-slate-700'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-6 mt-6 border-t border-slate-800/80 space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 pb-1">
              {t('Support & Ecosystem')}
            </div>
            <Link
              to="/deo/help"
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all',
                location.pathname === '/deo/help'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
              )}
            >
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>{t('common.help')}</span>
            </Link>

            <a
              href="/"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 transition-all border border-transparent"
            >
              <Layers className="w-4 h-4 text-slate-500" />
              <span>{t('Main Landing Page')}</span>
            </a>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400/90 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('common.logout')}</span>
            </button>
          </div>
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t('common.online')}</span>
            </div>
            <span className="font-mono text-[10px] text-slate-500">DEO v2.0.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};
