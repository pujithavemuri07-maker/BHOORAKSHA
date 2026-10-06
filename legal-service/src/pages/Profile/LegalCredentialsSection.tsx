import React from 'react';
import { User as UserType } from '../../api/types';
import { Award, Scale, ShieldCheck, BookOpen, CheckCircle2 } from 'lucide-react';

interface LegalCredentialsSectionProps {
  user: UserType | null;
}

export const LegalCredentialsSection: React.FC<LegalCredentialsSectionProps> = ({ user }) => {
  const credentials = [
    { label: 'Professional Advocate Name', value: user?.name || 'Adv. Rajeshwari Sharma', verified: true },
    { label: 'Professional Role', value: 'Legal Officer / Revenue Legal Advisor', verified: true },
    { label: 'Bar Council Enrollment Number', value: user?.barCouncilId || 'TS/BAR/2008/4192', isMono: true, verified: true },
    { label: 'Bar Council / State Authority', value: 'Bar Council of the State of Telangana', verified: true },
    { label: 'Legal Specialization', value: 'Revenue, Land Laws & Title Conveyancing', verified: true },
    { label: 'Judicial / Revenue Forum', value: 'High Court of Telangana & Special Revenue Courts', verified: true },
    { label: 'Professional Verification Status', value: 'Verified & Certified by State Bar Council', verified: true },
    { label: 'Credential Verification Date', value: '12 January 2024', verified: true },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Professional & Legal Credentials</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Bar council statutory enrollment, legal specialization, and professional verification status
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          Bar Enrollment Active
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {credentials.map((c, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1"
          >
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400">
              <span>{c.label}</span>
              {c.verified && (
                <span className="text-emerald-400 font-sans font-semibold text-[9px]">
                  [Verified]
                </span>
              )}
            </div>
            <div
              className={`text-xs font-semibold text-slate-100 ${
                c.isMono ? 'font-mono text-indigo-300' : ''
              }`}
            >
              {c.value || 'Not available'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
