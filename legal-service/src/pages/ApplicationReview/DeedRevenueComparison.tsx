import React from 'react';
import { ExtractedData, GovtRecord } from '../../api/types';
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  ArrowRight,
  Database,
} from 'lucide-react';

interface DeedRevenueComparisonProps {
  extractedData: ExtractedData;
  govtRecord: GovtRecord;
}

export const DeedRevenueComparison: React.FC<DeedRevenueComparisonProps> = ({
  extractedData,
  govtRecord,
}) => {
  const extOwner = extractedData?.ownerDetails?.name || 'Not available';
  const govOwner = govtRecord?.ownerDetails?.name || 'Not available';
  const ownerMatch = extOwner.toLowerCase().trim() === govOwner.toLowerCase().trim();

  const extSy = extractedData?.propertyDetails?.surveyNumber || 'Not available';
  const govSy = govtRecord?.propertyDetails?.surveyNumber || 'Not available';
  const syMatch = extSy === govSy;

  const extSubDiv = extSy.includes('/') ? extSy.split('/')[1] : 'Main / A';
  const govSubDiv = govSy.includes('/') ? govSy.split('/')[1] : 'Main / A';
  const subDivMatch = extSubDiv === govSubDiv;

  const extArea = extractedData?.landDetails?.totalArea
    ? `${extractedData.landDetails.totalArea} ${extractedData.landDetails.areaUnit || 'Acres'}`
    : 'Not available';
  const govArea = govtRecord?.landDetails?.totalArea
    ? `${govtRecord.landDetails.totalArea} ${govtRecord.landDetails.areaUnit || 'Acres'}`
    : 'Not available';
  const areaMatch = extractedData?.landDetails?.totalArea === govtRecord?.landDetails?.totalArea;

  const extVillage = extractedData?.propertyDetails?.village || 'Not available';
  const govVillage = govtRecord?.propertyDetails?.village || 'Not available';
  const villageMatch = extVillage.toLowerCase() === govVillage.toLowerCase();

  const extRegNo = extractedData?.documentDetails?.registrationNumber || 'Not available';
  const govRegNo = govtRecord?.documentDetails?.registrationNumber || 'Not available';
  const regNoMatch = extRegNo === govRegNo;

  const extRegDate = extractedData?.documentDetails?.registrationDate || 'Not available';
  const govRegDate = govtRecord?.documentDetails?.registrationDate || 'Not available';
  const regDateMatch = extRegDate === govRegDate;

  const extClass = extractedData?.landDetails?.landType || 'Not available';
  const govClass = govtRecord?.landDetails?.landType || 'Not available';
  const classMatch = extClass.toLowerCase() === govClass.toLowerCase();

  const extMutation = extractedData?.documentDetails?.mutationNumber || 'Not applicable / New Conveyance';
  const govMutation = govtRecord?.documentDetails?.mutationNumber || 'MUT/2012/8821';
  const mutationStatus = 'REQUIRES REVIEW';

  const rows = [
    {
      field: 'Owner / Claimant',
      deedVal: extOwner,
      revenueVal: govOwner,
      status: ownerMatch ? 'MATCH' : 'MISMATCH',
      note: ownerMatch ? 'Exact match' : 'Variation across instruments & genealogy',
    },
    {
      field: 'Survey Number',
      deedVal: extSy,
      revenueVal: govSy,
      status: syMatch ? 'MATCH' : 'MISMATCH',
      note: syMatch ? 'Cadastral identity aligned' : 'Survey number mismatch',
    },
    {
      field: 'Sub-Division',
      deedVal: extSubDiv,
      revenueVal: govSubDiv,
      status: subDivMatch ? 'MATCH' : 'MISMATCH',
      note: subDivMatch ? 'Parcel portion verified' : 'Sub-division discrepancy',
    },
    {
      field: 'Area / Extent',
      deedVal: extArea,
      revenueVal: govArea,
      status: areaMatch ? 'MATCH' : 'MISMATCH',
      note: areaMatch ? 'Acreage matches RoR' : 'Extent variance between deed and Pahani',
    },
    {
      field: 'Village',
      deedVal: extVillage,
      revenueVal: govVillage,
      status: villageMatch ? 'MATCH' : 'MISMATCH',
      note: villageMatch ? 'Jurisdiction matches revenue circle' : 'Village boundary mismatch',
    },
    {
      field: 'Registration Number',
      deedVal: extRegNo,
      revenueVal: govRegNo,
      status: regNoMatch ? 'MATCH' : (govRegNo === 'Not available' ? 'NOT AVAILABLE' : 'MISMATCH'),
      note: regNoMatch ? 'SRO Book-1 indexed' : 'Prior instrument reconciliation needed',
    },
    {
      field: 'Registration Date',
      deedVal: extRegDate,
      revenueVal: govRegDate,
      status: regDateMatch ? 'MATCH' : 'REQUIRES REVIEW',
      note: regDateMatch ? 'Timestamp consistent' : 'Verify execution vs stamp date window',
    },
    {
      field: 'Land Classification',
      deedVal: extClass,
      revenueVal: govClass,
      status: classMatch ? 'MATCH' : 'REQUIRES REVIEW',
      note: classMatch ? 'Classification aligned' : 'Check conversion proceedings if applicable',
    },
    {
      field: 'Mutation Status',
      deedVal: extMutation,
      revenueVal: govMutation,
      status: mutationStatus,
      note: 'Pending current legal clearance before entry into RoR 1-B',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'MATCH':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            MATCH
          </span>
        );
      case 'MISMATCH':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1 animate-pulse">
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            MISMATCH
          </span>
        );
      case 'REQUIRES REVIEW':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            REQUIRES REVIEW
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-slate-400" />
            NOT AVAILABLE
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-indigo-400" />
            Deed vs Revenue Record Comparison
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated side-by-side reconciliation of presented title deed against authoritative state revenue registers
          </p>
        </div>
        <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 self-start sm:self-auto flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5" />
          Live Register Comparison
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3 px-3 w-1/4">Comparison Field</th>
              <th className="py-3 px-3 w-1/3 text-indigo-300">Deed / Registration Record</th>
              <th className="py-3 px-3 w-1/3 text-emerald-300">Revenue Record (Pahani / RoR)</th>
              <th className="py-3 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {rows.map((row, idx) => {
              const isMismatch = row.status === 'MISMATCH';
              const isReview = row.status === 'REQUIRES REVIEW';

              return (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    isMismatch
                      ? 'bg-rose-950/20 hover:bg-rose-950/30'
                      : isReview
                      ? 'bg-amber-950/10 hover:bg-amber-950/20'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  {/* Field */}
                  <td className="py-3.5 px-3 font-semibold text-slate-200">
                    <div>{row.field}</div>
                    <div className="text-[10px] text-slate-500 font-normal mt-0.5">{row.note}</div>
                  </td>

                  {/* Deed Record */}
                  <td className="py-3.5 px-3 text-slate-100 font-medium">
                    <span className={isMismatch ? 'text-rose-300 font-bold' : ''}>
                      {row.deedVal}
                    </span>
                  </td>

                  {/* Revenue Record */}
                  <td className="py-3.5 px-3 text-slate-100 font-medium">
                    <span className={isMismatch ? 'text-amber-300 font-bold' : ''}>
                      {row.revenueVal}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3 text-right whitespace-nowrap">
                    <div className="inline-flex justify-end">{getStatusBadge(row.status)}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
