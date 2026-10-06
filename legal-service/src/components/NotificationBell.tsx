import { useState } from 'react';
import { Bell, ShieldAlert, CheckCircle2, Scale } from 'lucide-react';

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Civil Court Caveat Matched',
      desc: 'Application LEG-2026-602 matches Junior Civil Judge Injunction OS 412/2024.',
      time: '10m ago',
      type: 'warning',
    },
    {
      id: 2,
      title: 'Section 22-A Prohibited Notification',
      desc: 'LEG-2026-603 detected on Dharani Prohibited Land Registry (Gram Kantham ceiling).',
      time: '35m ago',
      type: 'warning',
    },
    {
      id: 3,
      title: 'SRO Title Index Reconciled',
      desc: 'Book-1 30-year lineage extract refreshed for Serilingampally SRO.',
      time: '1h ago',
      type: 'success',
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
        aria-label="Legal Alerts"
      >
        <Bell className="w-4 h-4" />
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 z-50">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-indigo-400" />
              Legal Alerts ({notifications.length})
            </h4>
            <span className="text-[10px] text-indigo-400 font-medium">High Court & SRO Desk</span>
          </div>
          <div className="divide-y divide-slate-800/60 mt-2 space-y-2">
            {notifications.map((n) => (
              <div key={n.id} className="pt-2 first:pt-0">
                <div className="flex items-start gap-2">
                  {n.type === 'warning' ? (
                    <ShieldAlert className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <p className="text-xs font-semibold text-slate-100">{n.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{n.desc}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">{n.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
