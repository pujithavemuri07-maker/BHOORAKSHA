import React from 'react';
import { ExtractedData } from '../../api/types';
import { MapPin, User, Compass, FileCheck } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface ExtractedDataCardsProps {
  data: ExtractedData;
}

export const ExtractedDataCards: React.FC<ExtractedDataCardsProps> = ({ data }) => {
  const { t } = useTranslation();
  const { propertyDetails, ownerDetails, landDetails, documentDetails } = data;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          {t('Extracted Land & Deed Records (Indic OCR / NER)')}
        </h3>
        <span className="text-[11px] font-mono text-emerald-400">Confidence: 98.4%</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Property Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {t('1. Property & Cadastral Location')}
              </h4>
              <p className="text-[11px] text-slate-400">{t('Jurisdictional Revenue Division')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">{t('Survey Number')}</span>
              <span className="font-bold text-white font-mono">{propertyDetails.surveyNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">{t('Unique ULPIN Code')}</span>
              <span className="font-bold text-emerald-400 font-mono">{propertyDetails.ulpin}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">{t('State / UT')}</span>
              <span className="font-semibold text-slate-200">{propertyDetails.state}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">{t('District')}</span>
              <span className="font-semibold text-slate-200">{propertyDetails.district}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">{t('Taluk / Tehsil')}</span>
              <span className="font-semibold text-slate-200">{propertyDetails.taluk}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">{t('Village / Habitation')}</span>
              <span className="font-semibold text-slate-200">{propertyDetails.village}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Owner Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {t('2. Ownership & Title Chain')}
              </h4>
              <p className="text-[11px] text-slate-400">{t('Pattadar and Prior Conveyance')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="col-span-2">
              <span className="text-slate-500 block text-[11px]">{t('Registered Owner Name')}</span>
              <span className="font-bold text-white text-sm">{ownerDetails.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">{t('Father / Spouse Name')}</span>
              <span className="font-semibold text-slate-200">{ownerDetails.fatherOrSpouse}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">{t('Ownership Share')}</span>
              <span className="font-semibold text-emerald-400">{ownerDetails.share}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-500 block text-[11px]">{t('Previous Registered Owner')}</span>
              <span className="font-semibold text-slate-300">{ownerDetails.previousOwner}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Land Details & Metes/Bounds */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {t('3. Parcel Extent & Physical Boundaries')}
              </h4>
              <p className="text-[11px] text-slate-400">{t('Cadastral Schedule Specification')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">{t('Total Registered Area')}</span>
              <span className="font-black text-white text-sm font-mono">
                {landDetails.area} {landDetails.unit}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">{t('Land Classification')}</span>
              <span className="font-semibold text-teal-400">{landDetails.landType}</span>
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-800/80">
              <span className="text-slate-400 block text-[11px] font-bold mb-1.5 uppercase">
                {t('Metes & Bounds (Schedule B):')}
              </span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                <li>
                  <strong className="text-slate-400">{t('North:')}</strong> {landDetails.boundaries.north}
                </li>
                <li>
                  <strong className="text-slate-400">{t('South:')}</strong> {landDetails.boundaries.south}
                </li>
                <li>
                  <strong className="text-slate-400">{t('East:')}</strong> {landDetails.boundaries.east}
                </li>
                <li>
                  <strong className="text-slate-400">{t('West:')}</strong> {landDetails.boundaries.west}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Card 4: Document Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                {t('4. Registration Deed Credentials')}
              </h4>
              <p className="text-[11px] text-slate-400">{t('Stamping & Sub-Registrar Records')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="col-span-2">
              <span className="text-slate-500 block text-[11px]">{t('Deed Classification')}</span>
              <span className="font-semibold text-white">{t(documentDetails.type)}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">{t('Document / Book No.')}</span>
              <span className="font-mono font-bold text-slate-200">{documentDetails.number}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">{t('Registration No.')}</span>
              <span className="font-mono font-bold text-purple-400">
                {documentDetails.registrationNumber}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">{t('Registration Date')}</span>
              <span className="font-semibold text-slate-300">{documentDetails.date}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">{t('Issuing Authority')}</span>
              <span className="font-semibold text-slate-300">
                {documentDetails.issuingAuthority}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
