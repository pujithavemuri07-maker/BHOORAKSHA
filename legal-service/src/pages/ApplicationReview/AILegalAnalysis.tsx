import React from 'react';
import { LegalApplication, LegalFlag } from '../../api/types';
import { LegalFlagSummary } from '../../components/LegalFlagSummary';
import { LegalFlagCard } from '../../components/LegalFlagCard';
import { Scale } from 'lucide-react';

interface AILegalAnalysisProps {
  application: LegalApplication;
  onQuoteCitation?: (citation: string) => void;
}

export const AILegalAnalysis: React.FC<AILegalAnalysisProps> = ({
  application,
  onQuoteCitation,
}) => {
  return (
    <div className="space-y-4">
      {/* Executive Summary Widget */}
      <LegalFlagSummary
        flags={application.legalFlags}
        riskScore={application.legalRiskScore}
      />

      {/* Flag Cards Stack */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
          <span className="flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-indigo-400" />
            Detected Caveats & Legal Findings ({application.legalFlags.length})
          </span>
          <span className="text-[11px] text-slate-500">
            Click to insert statutory provision into opinion
          </span>
        </div>

        {application.legalFlags.map((flag) => (
          <LegalFlagCard
            key={flag.id}
            flag={flag}
            onQuoteCitation={onQuoteCitation}
          />
        ))}
      </div>
    </div>
  );
};
