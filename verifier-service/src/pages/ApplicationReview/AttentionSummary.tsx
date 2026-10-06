import React from 'react';
import { VerifierApplication } from '../../api/types';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface AttentionSummaryProps {
  application: VerifierApplication;
  onScrollToSection: (sectionId: string) => void;
}

export const AttentionSummary: React.FC<AttentionSummaryProps> = ({
  application,
  onScrollToSection,
}) => {
  const docsList = application.documentsList || [];
  const missingDocsCount = docsList.filter((d) => d.required && !d.available).length;
  const docsComplete = missingDocsCount === 0;

  const validations = application.validationResults || [];
  const hasNameVariation = validations.some(
    (v) => v.field.toLowerCase().includes('name') && v.status !== 'MATCH'
  );
  const surveyMatch = !validations.some(
    (v) => v.field.toLowerCase().includes('survey') && v.status === 'MISMATCH'
  );
  const areaMatch = !validations.some(
    (v) => v.field.toLowerCase().includes('area') && v.status === 'MISMATCH'
  );
  const regDateDiff = validations.some(
    (v) => v.field.toLowerCase().includes('date') && v.status !== 'MATCH'
  );

  const gisData = application.gisData;
  const gisAreaDiff = gisData?.result === 'POTENTIAL_AREA_MISMATCH';

  const items = [
    {
      id: 'docs',
      label: docsComplete ? 'Documents Complete' : `${missingDocsCount} Document(s) Missing`,
      status: docsComplete ? 'pass' : 'warn',
      sectionId: 'section-documents',
    },
    {
      id: 'name',
      label: hasNameVariation ? 'Owner Name Variation' : 'Owner Name Match',
      status: hasNameVariation ? 'warn' : 'pass',
      sectionId: 'section-extracted',
    },
    {
      id: 'survey',
      label: surveyMatch ? 'Survey Number Match' : 'Survey Number Discrepancy',
      status: surveyMatch ? 'pass' : 'warn',
      sectionId: 'section-validation',
    },
    {
      id: 'area',
      label: areaMatch ? 'Area Extent Match' : 'Area Extent Discrepancy',
      status: areaMatch ? 'pass' : 'warn',
      sectionId: 'section-validation',
    },
    {
      id: 'regdate',
      label: regDateDiff ? 'Registration Date Variation' : 'Registration Date Match',
      status: regDateDiff ? 'warn' : 'pass',
      sectionId: 'section-validation',
    },
    {
      id: 'gis',
      label: gisAreaDiff ? 'GIS Area Difference' : 'GIS Boundaries Within Tolerance',
      status: gisAreaDiff ? 'warn' : 'pass',
      sectionId: 'section-gis',
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-emerald-400" />
          VERIFICATION ATTENTION SUMMARY
        </span>
        <span className="text-[11px] text-slate-400">
          Click any tag to scroll directly to evidence
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        {items.map((item) => {
          const isPass = item.status === 'pass';
          return (
            <button
              key={item.id}
              onClick={() => onScrollToSection(item.sectionId)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all hover:scale-105 cursor-pointer ${
                isPass
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/50'
                  : 'bg-amber-950/40 text-amber-300 border-amber-800/60 hover:bg-amber-900/50 shadow-sm shadow-amber-950'
              }`}
            >
              {isPass ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              )}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
