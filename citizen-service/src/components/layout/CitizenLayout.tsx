import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../i18n';
import {
  Home,
  LayoutDashboard,
  UploadCloud,
  FileText,
  User,
  Menu,
  X,
  LogOut,
  HelpCircle,
  Eye,
  Layers,
} from 'lucide-react';
import { LanguageSelector } from '../LanguageSelector';
import { NotificationBell } from '../NotificationBell';
import { ProfileDropdown } from '../ProfileDropdown';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

export const CitizenLayout: React.FC = () => {
  const { t, currentLanguage } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      label: t('navigation.dashboard', 'Citizen Dashboard'),
      icon: <Home className="w-5 h-5" />,
      href: '/citizen/dashboard',
    },
    {
      label: t('navigation.upload', 'Upload Document'),
      icon: <UploadCloud className="w-5 h-5" />,
      href: '/citizen/upload',
    },
    {
      label: t('navigation.applications', 'My Applications'),
      icon: <FileText className="w-5 h-5" />,
      href: '/citizen/applications',
    },
    {
      label: t('navigation.profile', 'Profile & KYC'),
      icon: <User className="w-5 h-5" />,
      href: '/citizen/profile',
    },
  ];

  const isActive = (href: string) => location.pathname === href || (href === '/citizen/dashboard' && location.pathname === '/citizen');

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    setTimeout(() => {
      window.location.href = '/';
    }, 400);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <Link to="/citizen/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base tracking-wide text-white">BHOORAKSHA</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  भूरक्षा
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">{t('Citizen Portal')}</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold tracking-wider uppercase text-slate-500">
            {t('Citizen Services')}
          </div>

          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all',
                  active
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                )}
              >
                <span className={cn(active ? 'text-white' : 'text-slate-400')}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-6 mt-6 border-t border-slate-800 space-y-1.5">
            <div className="px-3 pb-2 text-[10px] font-bold tracking-wider uppercase text-slate-500">
              {t('Assistance & Account')}
            </div>
            <Link
              to="/citizen/help"
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all',
                location.pathname === '/citizen/help'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              )}
            >
              <HelpCircle className="w-5 h-5 text-slate-400" />
              <span>{t('Help & FAQs')}</span>
            </Link>

            <a
              href="/"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
            >
              <Layers className="w-5 h-5 text-slate-400" />
              <span>{t('Main Landing Page')}</span>
            </a>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition-all text-left"
            >
              <LogOut className="w-5 h-5" />
              <span>{t('Log Out')}</span>
            </button>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-emerald-400">
                {import.meta.env.VITE_DEMO_MODE !== 'false'
                  ? t('Prototype Network Active')
                  : t('Govt Network Live')}
              </span>
            </div>
            <span className="font-mono text-[10px]">v2.0.0</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white truncate">
                  {t(getGreeting())}, {user?.name || t('Citizen')}!
                </h2>
                {import.meta.env.VITE_DEMO_MODE !== 'false' && (
                  <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-mono font-bold border border-amber-500/30 tracking-wider">
                    {t('DEMO / SIMULATED')}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {new Date().toLocaleDateString(currentLanguage === 'en' ? 'en-IN' : `${currentLanguage}-IN`, {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {import.meta.env.VITE_DEMO_MODE !== 'false' && (
              <span className="sm:hidden text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-mono font-bold border border-amber-500/30">
                {t('DEMO')}
              </span>
            )}
            <LanguageSelector />
            <NotificationBell />
            <ProfileDropdown user={user} onLogout={handleLogout} />
          </div>
        </header>

        {/* Dynamic Route Pages */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
