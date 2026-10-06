import React from 'react';
import { User as UserType } from '../../api/types';
import { ShieldCheck, Building2, MapPin, Landmark, Award, CheckCircle2 } from 'lucide-react';

interface ProfileHeaderProps {
  user: UserType | null;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-950/90 via-slate-900 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-center gap-5">
        {/* Profile Avatar with Govt Seal Ring */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-700 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-indigo-950/80 border border-indigo-400/30">
            {user?.name?.charAt(0) || 'R'}
          </div>
          <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-slate-950" title="Active Verified Officer">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 fill-white" />
          </span>
        </div>

        {/* Identity & Department */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              {user?.name || 'Adv. Rajeshwari Sharma'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Verified Officer
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              Official Govt Account
            </span>
          </div>

          <p className="text-xs font-semibold text-indigo-300">
            {user?.designation || 'Senior Legal Officer / Revenue Legal Advisor'}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              {user?.department || 'Revenue Department'} • {user?.office || 'Office of the District Revenue Officer'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {user?.jurisdiction?.includes('Ranga Reddy') ? 'Ranga Reddy' : 'Ranga Reddy District'}, Telangana
            </span>
          </div>
        </div>
      </div>

      {/* Official Status Card */}
      <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex items-center gap-4 self-start md:self-auto shrink-0">
        <div className="border-r border-slate-800 pr-4">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Account Status</div>
          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ACTIVE
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Officer ID</div>
          <div className="text-xs font-mono font-bold text-white mt-0.5">
            {user?.id ? `LO-TS-2024-${user.id.substring(0, 4)}` : 'LO-TS-2024-041'}
          </div>
        </div>
      </div>
    </div>
  );
};
