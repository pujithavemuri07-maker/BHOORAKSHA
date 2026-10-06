import React, { useState } from 'react';
import { KeyRound, ShieldCheck, Lock, Smartphone, Laptop, AlertCircle, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export const AccountSecuritySection: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword.trim() || !newPassword.trim()) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    toast.success('Officer account credentials updated securely');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const securityAttributes = [
    { label: 'Account Security Status', value: 'Active & Verified', isGood: true },
    { label: 'Two-Factor Authentication (2FA)', value: 'Enabled (Govt eSign & SMS OTP)', isGood: true },
    { label: 'Last Official Login', value: 'Today, 09:15 AM (Official Terminal)' },
    { label: 'Last Password Update', value: '14 August 2026' },
    { label: 'Authorized Device Access', value: 'Govt NIC Secure Terminal (IP: 10.142.xx.xx)' },
    { label: 'Security & Integrity Alerts', value: 'None (Account in Good Standing)', isGood: true },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Account Security</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Two-factor authentication status, session audit, and secure credential management
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          2FA Active
        </span>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
        {securityAttributes.map((sec, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1"
          >
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {sec.label}
            </span>
            <div
              className={`font-semibold ${
                sec.isGood ? 'text-emerald-400' : 'text-slate-200'
              }`}
            >
              {sec.value}
            </div>
          </div>
        ))}
      </div>

      {/* Password Change Form */}
      <div className="p-5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3 pt-4">
        <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-indigo-400" />
          Update Officer Access Password
        </h4>

        <form onSubmit={handlePasswordChange} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-slate-400 font-medium">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-medium">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-medium">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
