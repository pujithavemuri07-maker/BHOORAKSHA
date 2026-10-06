import React, { useState } from 'react';
import { Bell } from 'lucide-react';

export const NotificationBell: React.FC = () => {
  const [unreadCount] = useState(3);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              DEO Operational Alerts
            </h4>
            <span className="text-[10px] bg-amber-500/10 text-amber-500 font-bold px-2 py-0.5 rounded-full">
              {unreadCount} New
            </span>
          </div>
          <div className="mt-3 space-y-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <p className="font-semibold text-slate-900 dark:text-white">Govt Dharani API 503</p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                Keesara Mandal API timed out. 2 applications queued for manual entry.
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <p className="font-semibold text-slate-900 dark:text-white">High Priority Case Assigned</p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                DEO-2026-401 requires name voucher verification before forwarding.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
