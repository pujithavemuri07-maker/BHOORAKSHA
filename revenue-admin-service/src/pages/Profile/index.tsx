import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../i18n';
import {
  User,
  Eye,
  Building,
  Mail,
  Phone,
  Key,
  BadgeCheck,
  Calendar,
  Lock,
  Landmark,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user) return null;

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-white tracking-tight">
            {t('common.profile')}
          </h1>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Statutory Executive Credential
          </span>
        </div>
        <p className="text-sm text-slate-400 mt-1">
          Authenticated Revenue Magistrate Identity &amp; Digital Signature Authority.
        </p>
      </div>

      {/* Main Identity Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-800 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/20 ring-4 ring-white/10">
            {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <BadgeCheck className="w-3.5 h-3.5" />
                Executive Magistrate
              </span>
            </div>
            <p className="text-sm text-indigo-300 font-medium">{user.designation}</p>
            <p className="text-xs text-slate-400">
              Department of Revenue, Govt. of Telangana • DILRMP Jurisdiction
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
            <Landmark className="w-5 h-5 text-indigo-400 flex-shrink-0" />
            <div>
              <p className="text-slate-400">Tehsil Office</p>
              <p className="font-semibold text-slate-200">{user.office}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
            <Building className="w-5 h-5 text-indigo-400 flex-shrink-0" />
            <div>
              <p className="text-slate-400">District Headquarters</p>
              <p className="font-semibold text-slate-200">{user.district}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
            <Mail className="w-5 h-5 text-indigo-400 flex-shrink-0" />
            <div>
              <p className="text-slate-400">Official Gov Email</p>
              <p className="font-mono text-slate-200">{user.email}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
            <Phone className="w-5 h-5 text-indigo-400 flex-shrink-0" />
            <div>
              <p className="text-slate-400">Official Mobile (NIC CUG)</p>
              <p className="font-mono text-slate-200">{user.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Signature & Statutory Authority */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white tracking-wide">
            Digital Signature Certificate (DSC) &amp; HSM Binding
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-semibold text-slate-200">Class 3 Government e-Sign DSC Token</p>
              <p className="text-slate-400 font-mono">
                Serial: DSC-RR-2026-TEL-9941 • Issued by: NIC-CA
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-bold">
              Active &amp; Ready
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-semibold text-slate-200">Statutory Delegation Authority</p>
              <p className="text-slate-400">
                Authorized under Telangana Rights in Land and Pattadar Pass Books Act
              </p>
            </div>
            <span className="text-indigo-400 font-mono font-semibold">Gazette Notified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
