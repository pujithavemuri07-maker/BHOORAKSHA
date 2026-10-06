import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Globe, Bell, Save, CheckCircle2, Shield } from 'lucide-react';

export const EditProfileForm = () => {
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name || 'K. Venkat Rao');
  const [phone, setPhone] = useState(user?.phone || '+91 94401 88290');
  const [email, setEmail] = useState(user?.email || 'venkat.rao@revenue.telangana.gov.in');
  const [language, setLanguage] = useState('en');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [escalationAlerts, setEscalationAlerts] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      updateUser({ name, phone, email });
      setIsSaving(false);
      toast.success('Profile and notification preferences saved successfully.');
    }, 400);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          Editable Profile & Communication Settings
        </span>
        <span className="text-[10px] text-slate-500 font-mono">
          Official Govt Profile
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Full Name (Officer Name)
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="Officer Full Name"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Official Govt Email ID
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="officer@revenue.telangana.gov.in"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Official Mobile (2FA & SMS Alerts)
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-mono"
              placeholder="+91 94400 00000"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Preferred Portal Language
          </label>
          <div className="relative">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            >
              <option value="en">English (Official Revenue Standard)</option>
              <option value="te">తెలుగు (Telugu - State Official)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <Bell className="w-4 h-4 text-emerald-400" />
          <span>Statutory Notification & Alert Preferences</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-950"
            />
            <div>
              <span className="text-xs font-semibold text-slate-200 block">High-Risk Case Alerts</span>
              <span className="text-[10px] text-slate-400">Email notice when risk &gt; 65</span>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-950"
            />
            <div>
              <span className="text-xs font-semibold text-slate-200 block">SMS Queue Alerts</span>
              <span className="text-[10px] text-slate-400">SMS on new assigned cases</span>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={escalationAlerts}
              onChange={(e) => setEscalationAlerts(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-950"
            />
            <div>
              <span className="text-xs font-semibold text-slate-200 block">Daily Digest & Updates</span>
              <span className="text-[10px] text-slate-400">Daily verification status summary</span>
            </div>
          </label>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Changes take effect immediately across active verification sessions
        </span>
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-950/80 transition-all disabled:opacity-50 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Profile Details'}</span>
        </button>
      </div>
    </form>
  );
};
