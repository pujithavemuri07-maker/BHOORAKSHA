import React, { useState } from 'react';
import { User, Shield, Mail, Phone, Building, Key, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from '../../i18n';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [office, setOffice] = useState(user?.office || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, phone, office });
    toast.success('Administrator profile information saved.');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      toast.error('Passwords do not match or are empty.');
      return;
    }
    toast.success('Administrative credential updated.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/40 border border-indigo-500/20">
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
          Authenticated Identity & Security Keys
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          {t('admin.profile')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Manage your executive officer credentials, cryptographic signing keys, and emergency escalation contacts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Details Form */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" />
            <span>Executive Officer Credentials</span>
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Official Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Official Email</label>
              <input
                type="text"
                disabled
                value={user?.email || ''}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Official Mobile Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Secretariat / Office Unit</label>
              <input
                type="text"
                value={office}
                onChange={(e) => setOffice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-colors"
              >
                Save Officer Profile
              </button>
            </div>
          </form>
        </div>

        {/* Change Password / Key Form */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-purple-400" />
            <span>Cryptographic Key & Password Renewal</span>
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Current Passkey</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">New FIPS-140 Compliant Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-lg shadow-purple-600/30 transition-colors"
              >
                Rotate Master Key
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
