import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation, SUPPORTED_LANGUAGES_LIST } from '../../i18n';
import { User, Mail, Phone, Building, MapPin, Save, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const EditProfileForm: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { currentLanguage, changeLanguage } = useTranslation();

  const [name, setName] = useState(user?.name || 'Suresh G. Patil');
  const [email] = useState(user?.email || 'suresh.patil@telangana.gov.in');
  const [phone, setPhone] = useState(user?.phone || '+91 94401 88321');
  const [district] = useState(user?.district || 'Ranga Reddy');
  const [office] = useState(user?.office || 'Tahsildar Revenue Office, Serilingampally');
  const [selectedLanguage, setSelectedLanguage] = useState(user?.languagePreference || currentLanguage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      languagePreference: selectedLanguage,
    });
    changeLanguage(selectedLanguage);
    toast.success('DEO officer profile updated successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Revenue Officer Official Profile
          </h3>
          <p className="text-xs text-slate-400">
            Government Identity Card: <span className="font-mono text-amber-400 font-bold">{user?.id || 'DEO-TEL-0412'}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1.5">Full Officer Name</label>
          <div className="relative">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1.5 flex items-center justify-between">
            <span>Official Government Email</span>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> NIC Verified
            </span>
          </label>
          <input
            type="email"
            readOnly
            value={email}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-500 text-xs font-mono select-none cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1.5">Registered Mobile (OTP 2FA)</label>
          <input
            type="text"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1.5">Assigned Mandal / Office</label>
          <input
            type="text"
            readOnly
            value={office}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 text-xs select-none cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1.5">Revenue District</label>
          <input
            type="text"
            readOnly
            value={district}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 text-xs select-none cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1.5">Default Interface Language</label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-500"
          >
            {SUPPORTED_LANGUAGES_LIST.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.nativeName} ({lang.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile Changes</span>
        </button>
      </div>
    </form>
  );
};
