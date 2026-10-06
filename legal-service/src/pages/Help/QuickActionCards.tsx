import React from 'react';
import {
  FileSearch,
  FileCheck2,
  Scale,
  ShieldAlert,
  MapPin,
  ArrowUpRight,
} from 'lucide-react';

interface QuickActionCardsProps {
  onSelectCategory?: (category: string) => void;
}

export const QuickActionCards: React.FC<QuickActionCardsProps> = ({ onSelectCategory }) => {
  const cards = [
    {
      id: 'case_sop',
      title: 'Case Review SOP',
      desc: 'Step-by-step diligence workflow for title review and clearance',
      icon: <FileSearch className="w-5 h-5 text-indigo-400" />,
      border: 'hover:border-indigo-500/50',
    },
    {
      id: 'doc_verification',
      title: 'Document Verification',
      desc: 'Standards for verifying registered deeds, seals, and certified copies',
      icon: <FileCheck2 className="w-5 h-5 text-emerald-400" />,
      border: 'hover:border-emerald-500/50',
    },
    {
      id: 'ownership_check',
      title: 'Ownership & Title Check',
      desc: 'Verifying continuous 30-year root title and vendor conveyance rights',
      icon: <Scale className="w-5 h-5 text-blue-400" />,
      border: 'hover:border-blue-500/50',
    },
    {
      id: 'court_disputes',
      title: 'Court / Dispute Cases',
      desc: 'Handling civil injunctions, caveat alerts, and lis pendens stays',
      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
      border: 'hover:border-rose-500/50',
    },
    {
      id: 'boundary_issues',
      title: 'Boundary / Survey Issues',
      desc: 'Reconciling parcel extent variations against RoR 1-B and Pahani records',
      icon: <MapPin className="w-5 h-5 text-amber-400" />,
      border: 'hover:border-amber-500/50',
    },
    {
      id: 'escalation_proc',
      title: 'Escalation Procedure',
      desc: 'Protocol for referring complex legal disputes to Tehsildar or RDO',
      icon: <ArrowUpRight className="w-5 h-5 text-purple-400" />,
      border: 'hover:border-purple-500/50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      {cards.map((card) => (
        <div
          key={card.id}
          onClick={() => onSelectCategory?.(card.title)}
          className={`p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md transition-all flex items-start gap-3.5 group cursor-pointer ${card.border}`}
        >
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 group-hover:scale-105 transition-transform shrink-0 mt-0.5">
            {card.icon}
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
              {card.title}
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {card.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
