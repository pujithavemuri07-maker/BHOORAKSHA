import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../i18n';
import { LanguageSelector } from '../LanguageSelector';
import { NotificationBell } from '../NotificationBell';
import { Landmark, Eye, UserCheck, Menu, X, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

import { getRegionalConfig } from '@shared/i18n';

interface RevenueHeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const RevenueHeader: React.FC<RevenueHeaderProps> = ({
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const { user, logout } = useAuth();
  const { t, currentLanguage } = useTranslation();
  const regionalConfig = getRegionalConfig(currentLanguage);

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Toggle Navigation"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-600/25 ring-1 ring-white/10">
            <Eye className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-white">
              BHOORAKSHA
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Revenue Admin
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <LanguageSelector />
        <NotificationBell />

        {user && (
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/50 text-xs">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs">
              {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="font-semibold text-white truncate max-w-[150px]">
                {user.name}
              </p>
              <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">
                {user.designation}
              </p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            logout();
            toast.success('Logged out successfully');
          }}
          title={t('common.logout') || 'Sign Out'}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-xs font-semibold transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t('common.logout') || 'Sign Out'}</span>
        </button>
      </div>
    </header>
  );
};
