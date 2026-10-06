import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../i18n';
import { EditProfileForm } from './EditProfileForm';
import { ChangePasswordForm } from './ChangePasswordForm';
import { ShieldCheck, Bell, Smartphone, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(true);
  const [inAppNotifs, setInAppNotifs] = useState(true);

  const handleSavePreferences = () => {
    toast.success(t('Notification preferences updated!'));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Overview Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-600/30 flex-shrink-0">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white">{user?.name || t('Citizen User')}</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('Aadhaar Verified Citizen')}</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {user?.phone} • {user?.email} • {user?.city}, PIN {user?.pincode}
          </p>
        </div>
      </div>

      {/* Edit Personal Details */}
      <EditProfileForm user={user} />

      {/* Notification Preferences */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{t('Alerts & Notification Channels')}</h3>
            <p className="text-xs text-slate-400">{t('Choose how Bhooraksha notifies you of verification milestones')}</p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800/80 cursor-pointer">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-xs font-bold text-white block">{t('Email Notifications')}</span>
                <span className="text-[11px] text-slate-400">{t('Receive verification digests & mutation certificates')}</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={emailNotifs}
              onChange={(e) => setEmailNotifs(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800/80 cursor-pointer">
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-xs font-bold text-white block">{t('SMS & WhatsApp Alerts')}</span>
                <span className="text-[11px] text-slate-400">{t('Instant SMS on Tehsildar approval and Patwari remarks')}</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={smsNotifs}
              onChange={(e) => setSmsNotifs(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800/80 cursor-pointer">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-xs font-bold text-white block">{t('In-App Live Push')}</span>
                <span className="text-[11px] text-slate-400">{t('Real-time status updates in notification bell')}</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={inAppNotifs}
              onChange={(e) => setInAppNotifs(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 rounded"
            />
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSavePreferences}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            {t('Update Alert Channels')}
          </button>
        </div>
      </div>

      {/* Security Form */}
      <ChangePasswordForm />
    </div>
  );
};
export default ProfilePage;
