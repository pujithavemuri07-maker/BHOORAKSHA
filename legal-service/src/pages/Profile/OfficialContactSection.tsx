import React, { useState } from 'react';
import { User as UserType } from '../../api/types';
import { Mail, Phone, MapPin, Clock, Save, Info, Building } from 'lucide-react';
import toast from 'react-hot-toast';

interface OfficialContactSectionProps {
  user: UserType | null;
  onUpdateContact: (data: { email: string; phone: string; office: string }) => void;
}

export const OfficialContactSection: React.FC<OfficialContactSectionProps> = ({
  user,
  onUpdateContact,
}) => {
  const [email, setEmail] = useState(user?.email || 'rajeshwari.sharma@telangana.gov.in');
  const [phone, setPhone] = useState(user?.phone || '+91 94401 88921');
  const [office, setOffice] = useState(user?.office || 'Office of the District Revenue Officer, Lakdikapul, Hyderabad');
  const [hours, setHours] = useState('10:00 AM – 05:30 PM (Mon – Sat)');
  const [channel, setChannel] = useState('Bhooraksha Officer Mail & Revenue Intranet');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateContact({ email, phone, office });
    toast.success('Official contact preferences updated successfully');
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Official Contact Information</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Official office communication channels, telephone extensions, and service address
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 font-semibold self-start sm:self-auto">
          Editable Contact Details
        </span>
      </div>

      {/* Read-only Security Disclaimer */}
      <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-200">Verified Credentials Notice: </span>
          Full name, designation, department, officer ID, and Bar Council enrollment are verified government service records — contact the system administrator to request statutory amendments.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Official Government Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="officer.name@telangana.gov.in"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              Official Office Phone / Extension *
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="+91 94401 88921"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              Office Complex & Posting Address
            </label>
            <input
              type="text"
              value={office}
              onChange={(e) => setOffice(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="District Revenue Complex, Lakdikapul, Hyderabad - 500004"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Official Office Working Hours
            </label>
            <input
              type="text"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              Official Communication Channel
            </label>
            <input
              type="text"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Contact Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
