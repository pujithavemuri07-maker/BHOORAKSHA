import React from 'react';
import { useApplicationStore } from '../../store/applicationStore';
import { Link } from 'react-router-dom';
import { Bell, Check, ShieldCheck, AlertTriangle, Info, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';
import { useTranslation } from '../../i18n';

export const NotificationsPage: React.FC = () => {
  const { t } = useTranslation();
  const { notifications, markNotificationRead, clearNotifications } = useApplicationStore();

  const handleMarkAll = () => {
    clearNotifications();
    toast.success(t('All notifications marked as read'));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">{t('Application Notifications')}</h1>
            <p className="text-xs text-slate-400">{t('Real-time alerts from AI and revenue department officers')}</p>
          </div>
        </div>

        {notifications.some((n) => !n.read) && (
          <button
            onClick={handleMarkAll}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{t('Mark all as read')}</span>
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl">
            <Bell className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-bold text-white">{t('No Notifications')}</p>
            <p className="text-xs text-slate-400 mt-1">{t("You're all caught up with your land records!")}</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={cn(
                'p-5 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer',
                n.read
                  ? 'bg-slate-900/60 border-slate-800/80 opacity-80'
                  : 'bg-slate-900 border-emerald-500/30 shadow-lg shadow-emerald-950/20'
              )}
            >
              <div className="mt-0.5 flex-shrink-0">{getIcon(n.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-white">{n.title}</h4>
                  <span className="text-[11px] font-mono text-slate-500">
                    {new Date(n.timestamp).toLocaleString('en-IN', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                {n.applicationId && (
                  <div className="mt-3">
                    <Link
                      to={`/citizen/applications/${n.applicationId}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
                    >
                      <span>View Application {n.applicationId}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default NotificationsPage;
