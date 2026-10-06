import React, { useState } from 'react';
import { Lock, Eye, Key } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { ForgotPasswordModal } from '@shared/components/ForgotPasswordModal';
import toast from 'react-hot-toast';

export const ChangePasswordForm: React.FC = () => {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error(t('New password must be at least 8 characters.'));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t('New password and confirmation do not match.'));
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success(t('Password updated successfully!'));
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
        <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
          <Key className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{t('Security & Password Credentials')}</h3>
          <p className="text-xs text-slate-400">{t('Protect access to your land titles and mutation records')}</p>
        </div>
      </div>

      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1.5">{t('Current Password')}</label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1.5">{t('New Password')}</label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t('Minimum 8 characters')}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1.5">{t('Confirm New Password')}</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t('Re-enter new password')}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => setIsForgotOpen(true)}
          className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 transition"
        >
          {t('Forgot Password? Reset via OTP')}
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all disabled:opacity-50"
        >
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>{isSubmitting ? t('Updating...') : t('Update Password')}</span>
        </button>
      </div>

      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
      />
    </form>
  );
};
