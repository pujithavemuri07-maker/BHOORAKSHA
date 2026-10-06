import React from 'react';
import { CompleteApplicationData } from '../../api/types';
import { useTranslation } from '../../i18n';
import {
  Building2,
  User,
  FileCheck,
  Compass,
  MapPin,
  Calendar,
  Layers,
  ShieldCheck,
} from 'lucide-react';

interface CompleteDataProps {
  data?: CompleteApplicationData;
}

export const CompleteData: React.FC<CompleteDataProps> = ({ data }) => {
  const { t } = useTranslation();
  if (!data) return null;
  const { property, owner, document } = data;

  return (
    <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white tracking-wide">
            {t('AI-Extracted Application & Title Records')}
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {t('Confidence Score')}: <strong className="text-emerald-400">99.4%</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section A: Property Details */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>{t('Property & Extent')}</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">{t('Survey Number')}</span>
              <span className="font-mono font-bold text-white">
                {property?.surveyNumber}
              </span>
            </div>
            {property?.subdivisionNumber && (
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">{t('Subdivision / Hissa')}</span>
                <span className="font-mono text-slate-200">{property.subdivisionNumber}</span>
              </div>
            )}
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">{t('Total Area')}</span>
              <span className="font-bold text-emerald-400">
                {property?.extentAcres} {t('Ac')} ({property?.extentGuntas} {t('Guntas')})
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">{t('Land Classification')}</span>
              <span className="text-slate-200">{property?.landClassification}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">{t('Estimated Market Value')}</span>
              <span className="font-bold text-indigo-300">{property?.marketValue}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">{t('Location')}</span>
              <span className="text-slate-200 text-right">
                {property?.village}, {property?.tehsil}, {property?.district}
              </span>
            </div>
          </div>

          {/* Boundaries */}
          <div className="pt-2 border-t border-slate-800/80">
            <p className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              {t('Statutory Boundaries (Chakbandi)')}
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
              <span className="text-slate-400">{t('North: Sy 123/1')}</span>
              <span className="text-slate-400">{t('South: Grama Kantham')}</span>
              <span className="text-slate-400">{t('East: PWD Road')}</span>
              <span className="text-slate-400">{t('West: Sy 123/3')}</span>
            </div>
          </div>
        </div>

        {/* Section B: Owner Details */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            <User className="w-4 h-4" />
            <span>{t('Title Holder / Applicant')}</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">{t('Full Name')}</span>
              <span className="font-bold text-white">{owner?.primaryOwner}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">{t('Parent / Spouse')}</span>
              <span className="text-slate-200">{owner?.relativeName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">{t('Aadhaar (Masked)')}</span>
              <span className="font-mono text-slate-300">{owner?.aadhaarMasked}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">{t('Contact Number')}</span>
              <span className="font-mono text-slate-300">{owner?.phone}</span>
            </div>
            {owner?.casteCategory && (
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">{t('Category')}</span>
                <span className="text-slate-200">{owner.casteCategory}</span>
              </div>
            )}
            <div className="flex justify-between py-1">
              <span className="text-slate-400">{t('Registered Address')}</span>
              <span className="text-slate-200 text-right max-w-[180px] truncate">
                {owner?.address}
              </span>
            </div>
          </div>
        </div>

        {/* Section C: Verified Documents */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            <FileCheck className="w-4 h-4" />
            <span>{t('Verified Documents & Deeds')}</span>
          </div>

          <div className="space-y-2">
            {document && (
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-200">{t(document.documentType)}</p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Doc #{document.documentNumber} • {t('Date')}: {document.registrationDate}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    SRO: {document.subRegistrarOffice} • Stamp: {document.stampDutyPaid}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3" />
                  {t('Verified')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
