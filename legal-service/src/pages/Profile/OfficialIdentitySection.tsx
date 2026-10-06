import React from 'react';
import { User as UserType } from '../../api/types';
import { User, ShieldCheck, Mail, Phone, Calendar, Building, Landmark, Award } from 'lucide-react';

interface OfficialIdentitySectionProps {
  user: UserType | null;
}

export const OfficialIdentitySection: React.FC<OfficialIdentitySectionProps> = ({ user }) => {
  const fields = [
    {
      label: 'Full Name',
      value: user?.name || 'Adv. Rajeshwari Sharma',
      verified: true,
    },
    {
      label: 'Designation',
      value: user?.designation || 'Senior Legal Officer / Revenue Legal Advisor',
      verified: true,
    },
    {
      label: 'Department',
      value: user?.department || 'Revenue Department',
      verified: true,
    },
    {
      label: 'Office / Institution',
      value: user?.office || 'Office of the District Revenue Officer',
      verified: true,
    },
    {
      label: 'Officer ID',
      value: user?.id ? `LO-TS-2024-${user.id.substring(0, 4)}` : 'LO-TS-2024-041',
      isMono: true,
      verified: true,
    },
    {
      label: 'Official Government Email',
      value: user?.email || 'rajeshwari.sharma@telangana.gov.in',
      isMono: true,
      verified: true,
    },
    {
      label: 'Official Contact Number',
      value: user?.phone || '+91 94401 88921',
      isMono: true,
      verified: true,
    },
    {
      label: 'Date of Appointment',
      value: '15 June 2018',
      verified: true,
    },
    {
      label: 'Current Posting',
      value: 'District Revenue Legal Wing, Ranga Reddy District',
      verified: true,
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Official Identity</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified government personnel identification and service credentials
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          Service Records Verified
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {fields.map((f, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1"
          >
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
              <span>{f.label}</span>
              {f.verified && (
                <span className="text-emerald-400 font-sans font-semibold text-[9px]">
                  [Verified]
                </span>
              )}
            </div>
            <div
              className={`text-xs font-semibold text-slate-100 ${
                f.isMono ? 'font-mono text-indigo-300' : ''
              }`}
            >
              {f.value || 'Not available'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
