import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DEOApplication } from '../../api/types';
import { StatusBadge } from '../../components/StatusBadge';
import { PriorityBadge } from '../../components/PriorityBadge';
import { formatDate } from '../../utils/formatters';
import {
  getApplicationEffectiveStatus,
  getApplicationEffectivePriority,
} from '../../utils/riskClassification';
import { ArrowLeft, User, Phone, Mail, FileText, Calendar, Building2, Globe, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

interface ReviewHeaderProps {
  application: DEOApplication;
}

const INDIAN_STATES_CONFIG = [
  { state: 'Telangana', portal: 'State Land Records API', landUnit: 'Acres / Guntas', termRoR: 'ROR 1B / Pahani', subDiv: 'Survey / Hissa' },
  { state: 'Karnataka', portal: 'State Land Records API (Bhoomi)', landUnit: 'Acres / Guntas', termRoR: 'RTC / Pahani (Form 16)', subDiv: 'Survey / Hissa' },
  { state: 'Maharashtra', portal: 'State Land Records API (MahaBhulekh)', landUnit: 'Hectares / Ares', termRoR: '7/12 & 8A Extract', subDiv: 'Gat / Survey' },
  { state: 'Uttar Pradesh', portal: 'State Land Records API (Bhulekh UP)', landUnit: 'Bigha / Hectares', termRoR: 'Khatauni / Khatiyan', subDiv: 'Khasra / Gata' },
  { state: 'Andhra Pradesh', portal: 'State Land Records API (Meebhoomi)', landUnit: 'Acres / Cents', termRoR: 'Adangal / 1B Record', subDiv: 'Survey / Sub-Division' },
  { state: 'Odisha', portal: 'State Land Records API (Bhulekh Odisha)', landUnit: 'Acres / Decimals', termRoR: 'RoR Khatiyan', subDiv: 'Plot / Khata' },
];

export const ReviewHeader: React.FC<ReviewHeaderProps> = ({ application }) => {
  const [selectedStateConfig, setSelectedStateConfig] = useState(INDIAN_STATES_CONFIG[0]);

  const handleStateChange = (stateName: string) => {
    const found = INDIAN_STATES_CONFIG.find((s) => s.state === stateName) || INDIAN_STATES_CONFIG[0];
    setSelectedStateConfig(found);
    toast.success(`Revenue jurisdiction configured for ${found.state} (${found.termRoR})`);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Navigation & Identity */}
        <div className="flex items-center gap-3">
          <Link
            to="/deo/review"
            className="p-2.5 rounded-2xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title="Back to Review Queue"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-black font-mono text-white tracking-wide">
                {application.id}
              </h1>
              <StatusBadge status={getApplicationEffectiveStatus(application)} />
              <PriorityBadge priority={getApplicationEffectivePriority(application)} />
            </div>
            <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-amber-500" />
                {application.documentType}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Filed: {formatDate(application.submissionDate)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-400 font-medium">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                Tahsildar Revenue Office, Serilingampally (Ranga Reddy)
              </span>
            </p>
          </div>
        </div>

        {/* Right: State Integration Selector */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950/80 border border-slate-800 px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs">
            <Globe className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                State Integration Profile
              </span>
              <select
                value={selectedStateConfig.state}
                onChange={(e) => handleStateChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-white border-0 p-0 focus:ring-0 focus:outline-none cursor-pointer"
              >
                {INDIAN_STATES_CONFIG.map((st) => (
                  <option key={st.state} value={st.state} className="bg-slate-900 text-white">
                    {st.state} ({st.termRoR})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Citizen Applicant Strip */}
      <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <User className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span>
            Applicant: <strong className="text-white font-medium">{application.citizenName}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-300 font-mono">
          <Phone className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span>{application.citizenPhone}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300 truncate">
          <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span className="truncate">{application.citizenEmail || 'contact@applicant.gov.in'}</span>
        </div>
      </div>
    </div>
  );
};
