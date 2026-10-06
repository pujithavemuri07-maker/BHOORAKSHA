import React from 'react';
import { User as UserType } from '../../api/types';
import { Building2, Landmark, MapPin, Network, UserCheck } from 'lucide-react';

interface DepartmentPostingSectionProps {
  user: UserType | null;
}

export const DepartmentPostingSection: React.FC<DepartmentPostingSectionProps> = ({ user }) => {
  const postings = [
    { label: 'Government Department', value: user?.department || 'Revenue Department' },
    { label: 'Wing / Directorate', value: 'Directorate of Land Protection (Revenue Legal Wing)' },
    { label: 'Current Office', value: user?.office || 'Office of the District Revenue Officer' },
    { label: 'State', value: 'Telangana' },
    { label: 'District Jurisdiction', value: 'Ranga Reddy District' },
    { label: 'Revenue Division', value: 'Rajendranagar & Chevella Division' },
    { label: 'Mandal / Taluk', value: 'Serilingampally, Rajendranagar & Gandipet' },
    { label: 'Designated Posting', value: 'Senior Legal Advisor (Statutory Land Diligence)' },
    { label: 'Reporting Authority', value: 'District Collector & Joint Commissioner of Land Revenue' },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Department & Posting</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Administrative department, revenue wing hierarchy, and official reporting office
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-blue-300 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20 font-semibold">
          Revenue Administration
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {postings.map((p, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1"
          >
            <div className="text-[10px] uppercase font-bold text-slate-400">
              {p.label}
            </div>
            <div className="text-xs font-semibold text-slate-100">
              {p.value || 'Not available'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
