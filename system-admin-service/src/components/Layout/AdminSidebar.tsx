import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import {
  LayoutDashboard,
  Server,
  Cpu,
  Users,
  FileCheck2,
  BarChart3,
  Sliders,
  User,
  HelpCircle,
  X,
  Eye,
  ShieldAlert,
  LogOut,
} from 'lucide-react';
import { useTranslation } from '../../i18n';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: t('admin.dashboard') },
    { to: '/admin/applications', icon: FileCheck2, label: 'Applications Review' },
    { to: '/admin/system', icon: Server, label: t('admin.systemMonitor') },
    { to: '/admin/ai', icon: Cpu, label: t('admin.aiPerformance') },
    { to: '/admin/users', icon: Users, label: t('admin.userManagement') },
    { to: '/admin/audit', icon: FileCheck2, label: t('admin.auditLog') },
    { to: '/admin/reports', icon: BarChart3, label: t('admin.reports') },
    { to: '/admin/settings', icon: Sliders, label: t('admin.settings') },
    { to: '/admin/profile', icon: User, label: t('admin.profile') },
    { to: '/admin/help', icon: HelpCircle, label: t('admin.help') },
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
        className={`fixed lg:sticky top-0 lg:top-16 z-50 lg:z-20 h-screen lg:h-[calc(100vh-4rem)] w-64 shrink-0 bg-slate-900 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between lg:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Navigation Menu
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clean Menu Header */}
        <div className="px-4 py-3 border-b border-slate-800/60 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400/90">
            System Modules
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            v3.2
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-white" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Clean Footer Status */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              11 Services Active
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              SHA-256 OK
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
