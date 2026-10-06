import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, HelpCircle, ShieldCheck, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserType } from '../api/types';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from '../i18n';
import toast from 'react-hot-toast';

interface ProfileDropdownProps {
  user: UserType | null;
  onLogout: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, onLogout }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    onLogout();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all focus:outline-none"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight truncate max-w-[120px]">
            {user?.name || t('Citizen User')}
          </p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold leading-tight">
            {t('Verified Landowner')}
          </p>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-2 animate-fade-in divide-y divide-slate-100 dark:divide-slate-800">
          <div className="p-3">
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {user?.name || t('Citizen User')}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {user?.phone || user?.email}
            </p>
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3" />
              <span>{t('Citizen Verified ID')}</span>
            </div>
          </div>

          <div className="py-2 space-y-1">
            <Link
              to="/citizen/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>{t('My Profile & KYC')}</span>
            </Link>
            <Link
              to="/citizen/help"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>{t('Help, FAQs & Tutorials')}</span>
            </Link>
          </div>

          <div className="pt-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors font-semibold text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('Log Out')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
