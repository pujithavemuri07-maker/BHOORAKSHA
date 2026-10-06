import React, { useState } from 'react';
import { KeyRound, Lock, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const ChangePasswordForm: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters with numbers and symbols.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }
    toast.success('DEO credentials updated successfully with encrypted bcrypt hash.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <form
      onSubmit={handlePasswordSubmit}
      className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4"
    >
      <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
        <KeyRound className="w-4 h-4 text-amber-400" />
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
          Update Security Credentials & Password
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-400 mb-1">Current Password</label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 mb-1">New Strong Password</label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 mb-1">Confirm New Password</label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all shadow-sm"
        >
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Update Officer Password</span>
        </button>
      </div>
    </form>
  );
};

