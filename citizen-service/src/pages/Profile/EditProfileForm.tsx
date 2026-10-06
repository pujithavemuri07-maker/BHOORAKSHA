import React, { useState } from 'react';
import { User } from '../../api/types';
import { useProfile } from '../../hooks/useProfile';
import { useTranslation } from '../../i18n';
import { UserCheck, MapPin, Phone, Mail, Globe, Save } from 'lucide-react';
import { SUPPORTED_LANGUAGES_LIST } from '../../i18n';
import toast from 'react-hot-toast';

interface EditProfileFormProps {
  user: User | null;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({ user }) => {
  const { t } = useTranslation();
  const [name, setName] = useState(user?.name || '');
  const [city, setCity] = useState(user?.city || '');
  const [pincode, setPincode] = useState(user?.pincode || '');
  const [languagePreference, setLanguagePreference] = useState(user?.languagePreference || 'en');

  const { mutate: updateProfile, isPending } = useProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(
      {
        name,
        city,
        pincode,
        languagePreference,
      },
      {
        onSuccess: () => {
          toast.success(t('Profile details saved successfully!'));
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
          <UserCheck className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{t('Citizen Personal & KYC Information')}</h3>
          <p className="text-xs text-slate-400">{t('Authenticated details verified with mobile Aadhaar link')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1.5">{t('Full Legal Name')}</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Phone (Read-Only) */}
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1.5 flex items-center justify-between">
            <span>{t('Registered Mobile (OTP Bound)')}</span>
            <span className="text-[10px] text-emerald-400 font-semibold">{t('Verified KYC')}</span>
          </label>
          <div className="relative">
            <input
              type="text"
              readOnly
              value={user?.phone || '+91 98765 43210'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 text-xs font-mono select-none cursor-not-allowed"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1.5">{t('Email Address')}</label>
          <input
            type="email"
            value={user?.email || ''}
            readOnly
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 text-xs font-semibold select-none cursor-not-allowed"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1.5">{t('City / Village')}</label>
          <input
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* PIN Code */}
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1.5">{t('Postal PIN Code')}</label>
          <input
            type="text"
            required
            maxLength={6}
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Preferred Language */}
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1.5">
            {t('Default Portal Language')}
          </label>
          <select
            value={languagePreference}
            onChange={(e) => setLanguagePreference(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
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
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isPending ? t('Saving Changes...') : t('Save Profile Changes')}</span>
        </button>
      </div>
    </form>
  );
};
