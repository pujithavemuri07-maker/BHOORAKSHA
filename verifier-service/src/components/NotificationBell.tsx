import { useState } from 'react';
import { Bell, ShieldAlert, CheckCircle2, Info, ArrowRight, RotateCcw, XCircle } from 'lucide-react';
import { useVerifierStore } from '../store/verifierStore';
import { Link } from 'react-router-dom';

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const notifications = useVerifierStore((s) => s.notifications);
  const markNotificationRead = useVerifierStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useVerifierStore((s) => s.markAllNotificationsRead);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
      case 'error':
        return <ShieldAlert className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />;
    }
  };

  const handleNotificationClick = (notifId: string) => {
    markNotificationRead(notifId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 text-[8px] font-mono text-slate-950 flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-88 max-w-sm bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 z-50">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Operational Alerts ({unreadCount} unread)
            </h4>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllNotificationsRead()}
                className="text-[10px] text-emerald-400 hover:underline font-semibold"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="divide-y divide-slate-800/60 mt-2 space-y-2 max-h-80 overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                No active notifications
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`pt-2 first:pt-0 ${n.read ? 'opacity-60' : 'opacity-100'}`}
                >
                  <div className="flex items-start gap-2.5">
                    {getIcon(n.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-semibold text-slate-100 truncate">{n.title}</p>
                        <span className="text-[10px] text-slate-500 shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{n.desc}</p>
                      {n.applicationId && (
                        <Link
                          to={`/verifier/review/${n.applicationId}`}
                          onClick={() => handleNotificationClick(n.id)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 mt-1"
                        >
                          <span>Review {n.applicationId}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
