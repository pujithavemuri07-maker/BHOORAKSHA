import { useState } from 'react';
import { Bell, CheckCircle2, AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';

export const NotificationBell = () => {
  const [open, setOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Mutation Synced in Telangana Dharani',
      desc: 'REV-2026-798 mutation verified in 1-B ledger.',
      time: '15m ago',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 2,
      title: 'High-Value Title Clearance Awaiting Order',
      desc: 'Sy. 123/456 Gachibowli (₹ 1.87 Cr) verified by all 4 officers.',
      time: '42m ago',
      icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 3,
      title: 'FTL Buffer Warning Recorded by GIS',
      desc: 'Sy. 312/A Puppalguda required buffer alignment check.',
      time: '1h ago',
      icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
    },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-4 z-40 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Executive Alerts
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
                3 New
              </span>
            </div>
            <div className="mt-3 space-y-2.5">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="mt-0.5 shrink-0">{n.icon}</div>
                  <div className="flex-1 min-w-0 text-xs">
                    <div className="font-semibold text-slate-200 truncate">{n.title}</div>
                    <div className="text-[11px] text-slate-400 leading-snug mt-0.5">{n.desc}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
