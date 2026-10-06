import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from '../../i18n';
import { ShieldCheck, ArrowRight, ArrowLeft, Lock, UserCheck, Eye, Server } from 'lucide-react';
import toast from 'react-hot-toast';

const DEFAULT_ADMIN_USER = {
  id: 'usr-001',
  name: 'Sri V. Someshwar Rao, IAS',
  role: 'admin' as const,
  email: 'ccla.admin@telangana.gov.in',
  phone: '+91 94400 11223',
  designation: 'Chief Commissioner of Land Administration (CCLA)',
  office: 'CCLA Headquarters, Nampally, Hyderabad',
  district: 'Hyderabad HQ',
  jurisdiction: 'Statewide (All 33 Districts of Telangana)',
  employeeId: 'TG-IAS-2004-1002',
  token: 'mock-ccla-admin-jwt-token-9999-valid',
};

export const AdminLogin: React.FC = () => {
  const { t } = useTranslation();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('ccla.admin@telangana.gov.in');
  const [password, setPassword] = useState('Password@123');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickLogin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      login(DEFAULT_ADMIN_USER);
      toast.success(t('Welcome to System Admin Console, Sri V. Someshwar Rao!'));
      setIsSubmitting(false);
    }, 200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      login({
        ...DEFAULT_ADMIN_USER,
        email: email || DEFAULT_ADMIN_USER.email,
      });
      toast.success(t('Official authenticated successfully!'));
      setIsSubmitting(false);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/30">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">BHOORAKSHA</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  SYSTEM ADMIN
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Chief Commissioner of Land Administration & Observability
              </p>
            </div>
          </div>

          <a
            href={typeof window !== 'undefined' && window.location.port && window.location.port !== '8080' ? `${window.location.protocol}//${window.location.hostname}:8080/` : '/'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 text-xs text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('Main Landing Page')}</span>
          </a>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="max-w-md w-full mx-auto px-4 py-8 z-10 flex-1 flex flex-col justify-center">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-1.5">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
              <Server className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide">
              {t('Official System Admin Login')}
            </h1>
            <p className="text-xs text-slate-400">
              {t('Chief Commissioner of Land Administration • State Portal')}
            </p>
          </div>

          {/* Officer Profile Badge */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-sm">
              SR
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                <span>Sri V. Someshwar Rao, IAS</span>
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 inline shrink-0" />
              </div>
              <div className="text-[11px] text-indigo-300/90 truncate">Chief Commissioner of Land Admin (CCLA)</div>
              <div className="text-[10px] text-slate-400 font-mono">Statewide (All 33 Districts)</div>
            </div>
          </div>

          {/* Quick One-Click Access Button */}
          <button
            type="button"
            onClick={handleQuickLogin}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
          >
            <UserCheck className="w-4 h-4" />
            <span>{isSubmitting ? t('Authenticating...') : t('1-Click Quick Access as CCLA Admin')}</span>
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800" />
            <span className="flex-shrink mx-3 text-[11px] text-slate-500 uppercase tracking-widest">{t('Or Sign In')}</span>
            <div className="flex-grow border-t border-slate-800" />
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                {t('Administrator Official Email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                {t('Password')}
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Default demo password: <code className="text-indigo-400">Password@123</code></p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition disabled:opacity-50"
            >
              <span>{t('Sign In to System Admin Console')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-slate-800 text-center text-xs text-slate-500">
        Bhooraksha Land Administration • State Control Plane & Observability
      </footer>
    </div>
  );
};

export default AdminLogin;
