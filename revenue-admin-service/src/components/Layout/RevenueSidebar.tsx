import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n';
import { useRevenueStore } from '../../store/revenueStore';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import {
  LayoutDashboard,
  ClipboardCheck,
  BarChart3,
  MapPin,
  History,
  User,
  HelpCircle,
  Eye,
  Sparkles,
  Layers,
  LogOut,
  ExternalLink,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/authStore';

interface RevenueSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const RevenueSidebar: React.FC<RevenueSidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const applications = useRevenueStore((s) => s.applications);
  const pendingCount = applications.filter((a) => a.status === 'pending').length;

  const handleLogout = () => {
    try {
      localStorage.removeItem('bhooraksha_user');
      localStorage.removeItem('bhooraksha_token');
      localStorage.removeItem('bhooraksha_role');
    } catch (e) {
      // ignore
    }
    logout();
    toast.success('Tehsildar logged out successfully');
    navigate('/login');
  };

  const navItems = [
    {
      to: '/revenue/dashboard',
      label: t('revenue.dashboard'),
      icon: LayoutDashboard,
    },
    {
      to: '/revenue/review',
      label: t('revenue.queue'),
      icon: ClipboardCheck,
      badge: pendingCount,
    },
    {
      to: '/revenue/legacy-records',
      label: t('oldDocuments.legacyRecords', 'Legacy Records'),
      icon: BookOpen,
      badge: 2,
    },
    {
      to: '/revenue/reports',
      label: t('revenue.reports'),
      icon: BarChart3,
    },
    {
      to: '/revenue/tehsils',
      label: t('revenue.tehsils'),
      icon: MapPin,
    },
    {
      to: '/revenue/history',
      label: t('revenue.history'),
      icon: History,
    },
    {
      to: '/revenue/profile',
      label: t('common.profile'),
      icon: User,
    },
    {
      to: '/revenue/help',
      label: t('common.help'),
      icon: HelpCircle,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          'fixed lg:sticky top-0 lg:top-16 z-50 lg:z-20 h-screen lg:h-[calc(100vh-4rem)] w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="p-4 space-y-6 overflow-y-auto flex-1">
          {/* Quick Authority Banner for mobile sidebar top */}
          <div className="lg:hidden pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <Eye className="w-5 h-5" />
              <span>Revenue Administration</span>
              <ShieldCheck className="w-5 h-5" />
              <span>{t('revenue.portalTitle')}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {t('revenue.officeTitle')}
            </p>
          </div>

          <div className="space-y-1">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-indigo-400/90 mb-2">
              {t('sidebar.statutoryConsole')}
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group',
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Clean Footer Note */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Registry Online
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              ISO 27001
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
