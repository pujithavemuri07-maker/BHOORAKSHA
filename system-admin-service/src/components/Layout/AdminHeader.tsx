import React from 'react';
import { Menu, Eye, Activity, User, Bell, RefreshCw, LogOut } from 'lucide-react';
import { LanguageSelector } from '@shared/components/LanguageSelector';
import { useTranslation } from '../../i18n';
import { useAuthStore } from '../../store/authStore';
import { useAdminStore } from '../../store/adminStore';
import toast from 'react-hot-toast';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleSidebar,
}) => {
  const { t, currentLanguage, changeLanguage } = useTranslation();
  const { user, logout } = useAuthStore();
  const { metrics } = useAdminStore();

  return (
    <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-md sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Mobile Toggle & Clean Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-600/25 ring-1 ring-white/10">
              <Eye className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                BHOORAKSHA
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                System Admin
              </span>
            </div>
          </div>
        </div>

        {/* Right Controls: Telemetry, Language, User profile */}
        <div className="flex items-center gap-3">
          {/* System Uptime Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/50 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400 font-medium">{t('Telemetry')}:</span>
            <span className="text-emerald-400 font-semibold">{metrics.systemUptime}% Uptime</span>
          </div>

          <LanguageSelector
            currentLanguage={currentLanguage}
            onLanguageChange={changeLanguage}
          />

          {/* User Profile Tag */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/50 text-xs">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="font-semibold text-white truncate max-w-[140px]">
                {user?.name || 'CCLA Admin'}
              </div>
              <div className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">
                {t('State Administrator')}
              </div>
            </div>
          </div>

          {/* Logout Button */}
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
      </div>
    </header>
  );
};
