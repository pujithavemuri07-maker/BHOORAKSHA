import React from 'react';
import { GisBoundaryData } from '../../api/types';
import { RiskScoreGauge } from '../../components/RiskScoreGauge';
import { MapPreview } from '../../components/MapPreview';
import { ShieldCheck, AlertTriangle, Scale, CheckCircle2, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from '../../i18n';

interface VerificationResultsProps {
  riskScore: number;
  confidenceCategory: 'HIGH' | 'MEDIUM' | 'LOW';
  riskFactors: string[];
  legalFlags: string[];
  gisData: GisBoundaryData;
  surveyNumber?: string;
  village?: string;
}

export const VerificationResults: React.FC<VerificationResultsProps> = ({
  riskScore,
  confidenceCategory,
  riskFactors,
  legalFlags,
  gisData,
  surveyNumber,
  village,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          {t('AI Verification Findings & Spatial Analysis')}
        </h3>
        <span className="text-xs text-slate-400">{t('10 Autonomous Agents Consolidated')}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Risk Gauge & Factor Breakdown */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6">
          <div className="text-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              {t('Composite Trust Index')}
            </h4>
            <RiskScoreGauge score={riskScore} size="lg" />
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t('Key Verification Signals')}</span>
            </h5>
            <ul className="space-y-2">
              {riskFactors.map((factor, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="leading-tight">{t(factor)}</span>
                </li>
              ))}
            </ul>
          </div>

          {legalFlags.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-amber-400">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{t('Statutory Caveat Flag Detected')}</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-200">
                {legalFlags.map((flag, i) => (
                  <li key={i}>{flag}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right 2 Columns: Cadastral Map View */}
        <div className="lg:col-span-2">
          <MapPreview
            gisData={gisData}
            surveyNumber={surveyNumber}
            village={village}
          />
        </div>
      </div>
    </div>
  );
};
