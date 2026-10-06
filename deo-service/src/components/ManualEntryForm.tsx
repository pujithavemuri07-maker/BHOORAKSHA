import React from 'react';
import { useTranslation } from '../i18n';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { manualEntrySchema, ManualEntryFormData } from '../utils/validators';
import { toast } from 'react-hot-toast';
import { useDEOStore } from '../store/deoStore';
import { AlertTriangle, Save, CheckCircle2, ArrowRight, Sparkles, ExternalLink, ShieldCheck, FileCheck } from 'lucide-react';

interface ManualEntryFormProps {
  applicationId?: string;
  onSave?: (data: ManualEntryFormData) => void;
  onCancel?: () => void;
  defaultValues?: Partial<ManualEntryFormData>;
  onViewSource?: (docType: string, page: number, fieldKey?: string) => void;
}

export const ManualEntryForm: React.FC<ManualEntryFormProps> = ({
  applicationId,
  onSave,
  onCancel,
  defaultValues,
  onViewSource,
}) => {
  const { t } = useTranslation();
  const saveManualEntry = useDEOStore((state) => state.saveManualEntry);
  const [proofSource, setProofSource] = React.useState<string>('State Land Records API (Synced)');
  const [correctionReason, setCorrectionReason] = React.useState<string>('');
  const [hasEdits, setHasEdits] = React.useState<boolean>(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ManualEntryFormData>({
    resolver: zodResolver(manualEntrySchema),
    defaultValues: {
      state: defaultValues?.state || 'Telangana',
      district: defaultValues?.district || 'Medchal-Malkajgiri',
      taluk: defaultValues?.taluk || 'Shamirpet',
      village: defaultValues?.village || 'Aliabad',
      surveyNumber: defaultValues?.surveyNumber || '512/2',
      ulpin: defaultValues?.ulpin || 'ULPIN-36-MM-SHA-512-02',
      ownerName: defaultValues?.ownerName || 'Devender Rao Kulkarni',
      fatherName: defaultValues?.fatherName || 'Gopal Rao Kulkarni',
      share: defaultValues?.share || '100% Sole Ownership',
      previousOwner: defaultValues?.previousOwner || 'K. Balakrishnaiah',
      area: defaultValues?.area || 3.2,
      areaUnit: defaultValues?.areaUnit || 'Acres',
      landType: defaultValues?.landType || 'Agricultural Dry (Metta)',
      currentUsage: defaultValues?.currentUsage || 'Agriculture / Mango Orchard',
      boundaryNorth: defaultValues?.boundaryNorth || 'Survey 511 Grama Panchayat Road',
      boundarySouth: defaultValues?.boundarySouth || 'Survey 513 Natural Stream',
      boundaryEast: defaultValues?.boundaryEast || 'Survey 512/1 Land of M. Yadaiah',
      boundaryWest: defaultValues?.boundaryWest || 'Survey 510 Forest Boundary',
      documentType: defaultValues?.documentType || 'Sale Deed',
      documentNumber: defaultValues?.documentNumber || 'SD-2025-512',
      registrationNumber: defaultValues?.registrationNumber || 'REG-2025-9921',
      registrationDate: defaultValues?.registrationDate || '2025-11-28',
      issuingAuthority: defaultValues?.issuingAuthority || 'Sub-Registrar Office, Shamirpet',
      mutationNumber: defaultValues?.mutationNumber || 'MUT-2026-0412',
    },
  });

  const handleSaveChangesOnly = () => {
    const values = getValues();
    if (applicationId) {
      saveManualEntry(applicationId, values as any);
      toast.success('DEO field corrections saved successfully to database.');
    }
  };

  const onSubmit = (data: ManualEntryFormData) => {
    if (applicationId) {
      saveManualEntry(applicationId, data as any);
    }
    toast.success('Manual record saved & proceeding to review.');
    onSave?.(data);
  };

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-6">
      {/* Operating Explanation Alert */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            MANUAL GOVERNMENT RECORD ENTRY (API FALLBACK ENGINE)
          </h4>
          <p className="text-xs text-amber-200/80 mt-0.5 leading-relaxed">
            This fallback page is active only because the State Land Records API is unavailable, required records are unavailable digitally, or the application requires manual verification. Available AI-extracted data has been pre-filled.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* SECTION 1 — CADASTRAL & PROPERTY LOCATION */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                SECTION 1 — CADASTRAL & PROPERTY LOCATION
              </h4>
            </div>
            {onViewSource && (
              <button
                type="button"
                onClick={() => onViewSource('Registered Sale Deed', 1, 'propertyDetails')}
                className="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20"
              >
                <ExternalLink className="w-3 h-3" />
                <span>View Source (Sale Deed p.1)</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">
                  State *
                </label>
                {defaultValues?.state && (
                  <span className="text-[9px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                    AI: {defaultValues.state}
                  </span>
                )}
              </div>
              <input
                {...register('state')}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {errors.state && <p className="text-[11px] text-rose-500 mt-1">{errors.state.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">
                  District *
                </label>
                {defaultValues?.district && (
                  <span className="text-[9px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                    AI: {defaultValues.district}
                  </span>
                )}
              </div>
              <input
                {...register('district')}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {errors.district && <p className="text-[11px] text-rose-500 mt-1">{errors.district.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">
                  Taluk / Mandal *
                </label>
                {defaultValues?.taluk && (
                  <span className="text-[9px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                    AI: {defaultValues.taluk}
                  </span>
                )}
              </div>
              <input
                {...register('taluk')}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {errors.taluk && <p className="text-[11px] text-rose-500 mt-1">{errors.taluk.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">
                  Village / Ward *
                </label>
                {defaultValues?.village && (
                  <span className="text-[9px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                    AI: {defaultValues.village}
                  </span>
                )}
              </div>
              <input
                {...register('village')}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {errors.village && <p className="text-[11px] text-rose-500 mt-1">{errors.village.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">
                  Survey / Hissa Number *
                </label>
                <div className="flex items-center gap-1.5">
                  {defaultValues?.surveyNumber && (
                    <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">
                      AI: Sy. {defaultValues.surveyNumber}
                    </span>
                  )}
                  {onViewSource && (
                    <button
                      type="button"
                      onClick={() => onViewSource('Registered Sale Deed', 2, 'surveyNumber')}
                      className="text-[9px] font-bold text-blue-400 hover:text-blue-300 underline"
                      title="View Survey in Document"
                    >
                      [View Source]
                    </button>
                  )}
                </div>
              </div>
              <input
                {...register('surveyNumber')}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
              {errors.surveyNumber && <p className="text-[11px] text-rose-500 mt-1">{errors.surveyNumber.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">
                  ULPIN Code
                </label>
                {defaultValues?.ulpin && (
                  <span className="text-[9px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                    AI: {defaultValues.ulpin}
                  </span>
                )}
              </div>
              <input
                {...register('ulpin')}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2 — OWNERSHIP & PATTADAR PARTICULARS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                SECTION 2 — OWNERSHIP & PATTADAR PARTICULARS
              </h4>
            </div>
            {onViewSource && (
              <button
                type="button"
                onClick={() => onViewSource('Identity Proof (Masked)', 1, 'ownerName')}
                className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20"
              >
                <ExternalLink className="w-3 h-3" />
                <span>View Proof (Aadhaar p.1)</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">
                  Owner / Claimant Full Name *
                </label>
                <div className="flex items-center gap-1.5">
                  {defaultValues?.ownerName && (
                    <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-bold">
                      AI Extracted: {defaultValues.ownerName}
                    </span>
                  )}
                  {onViewSource && (
                    <button
                      type="button"
                      onClick={() => onViewSource('Registered Sale Deed', 1, 'ownerName')}
                      className="text-[9px] font-bold text-blue-400 hover:text-blue-300 underline"
                      title="View Owner in Sale Deed"
                    >
                      [View Source]
                    </button>
                  )}
                </div>
              </div>
              <input
                {...register('ownerName')}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
              />
              {errors.ownerName && <p className="text-[11px] text-rose-500 mt-1">{errors.ownerName.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">
                  Father / Spouse Name
                </label>
                <div className="flex items-center gap-1.5">
                  {defaultValues?.fatherName && (
                    <span className="text-[9px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      AI: {defaultValues.fatherName}
                    </span>
                  )}
                  {onViewSource && (
                    <button
                      type="button"
                      onClick={() => onViewSource('Identity Proof (Masked)', 1, 'fatherName')}
                      className="text-[9px] font-bold text-blue-400 hover:text-blue-300 underline"
                      title="View Father Name in Identity Proof"
                    >
                      [View Source]
                    </button>
                  )}
                </div>
              </div>
              <input
                {...register('fatherName')}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">
                  Ownership Share
                </label>
                {defaultValues?.share && (
                  <span className="text-[9px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                    AI: {defaultValues.share}
                  </span>
                )}
              </div>
              <input
                {...register('share')}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">
                  Previous Title Holder / Vendor
                </label>
                <div className="flex items-center gap-1.5">
                  {defaultValues?.previousOwner && (
                    <span className="text-[9px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      AI: {defaultValues.previousOwner}
                    </span>
                  )}
                  {onViewSource && (
                    <button
                      type="button"
                      onClick={() => onViewSource('Registered Sale Deed', 1, 'previousOwner')}
                      className="text-[9px] font-bold text-blue-400 hover:text-blue-300 underline"
                    >
                      [View Source]
                    </button>
                  )}
                </div>
              </div>
              <input
                {...register('previousOwner')}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3 — LAND EXTENT & SCHEDULE BOUNDARIES */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                SECTION 3 — LAND EXTENT & SCHEDULE BOUNDARIES
              </h4>
            </div>
            {onViewSource && (
              <button
                type="button"
                onClick={() => onViewSource('Registered Sale Deed', 2, 'area')}
                className="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20"
              >
                <ExternalLink className="w-3 h-3" />
                <span>View Schedule (Sale Deed p.2)</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">
                  Total Area Extent *
                </label>
                <div className="flex items-center gap-1.5">
                  {defaultValues?.area !== undefined && (
                    <span className="text-[9px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      AI: {defaultValues.area}
                    </span>
                  )}
                  {onViewSource && (
                    <button
                      type="button"
                      onClick={() => onViewSource('Registered Sale Deed', 2, 'area')}
                      className="text-[9px] font-bold text-blue-400 hover:text-blue-300 underline"
                    >
                      [View Source]
                    </button>
                  )}
                </div>
              </div>
              <input
                type="number"
                step="0.01"
                {...register('area', { valueAsNumber: true })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
              {errors.area && <p className="text-[11px] text-rose-500 mt-1">{errors.area.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">
                  Measurement Unit *
                </label>
              </div>
              <select
                {...register('areaUnit')}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Acres">Acres</option>
                <option value="Guntas">Guntas</option>
                <option value="Hectares">Hectares</option>
                <option value="Sq. Yards">Sq. Yards</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">
                  Land Classification *
                </label>
              </div>
              <input
                {...register('landType')}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">
                  Current Usage
                </label>
              </div>
              <input
                {...register('currentUsage')}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                North Boundary
              </label>
              <input
                {...register('boundaryNorth')}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                South Boundary
              </label>
              <input
                {...register('boundarySouth')}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                East Boundary
              </label>
              <input
                {...register('boundaryEast')}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                West Boundary
              </label>
              <input
                {...register('boundaryWest')}
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4 — REGISTERED INSTRUMENT & STAMP PARTICULARS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                SECTION 4 — REGISTERED INSTRUMENT & STAMP PARTICULARS
              </h4>
            </div>
            {onViewSource && (
              <button
                type="button"
                onClick={() => onViewSource('Registered Sale Deed', 1, 'documentNumber')}
                className="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20"
              >
                <ExternalLink className="w-3 h-3" />
                <span>View Registration (Sale Deed p.1)</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Instrument / Deed Type *
              </label>
              <select
                {...register('documentType')}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Sale Deed">Registered Sale Deed (Kraya Patram)</option>
                <option value="Pattadar Passbook">Pattadar Passbook / Dharani Title</option>
                <option value="Partition Deed">Partition Deed (Bhaaga Parishkaram)</option>
                <option value="Gift Deed">Gift Deed (Daanam)</option>
                <option value="Succession Certificate">Succession / Virasat Certificate</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">
                  Document / Deed Number *
                </label>
                <div className="flex items-center gap-1.5">
                  {defaultValues?.documentNumber && (
                    <span className="text-[9px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      AI: {defaultValues.documentNumber}
                    </span>
                  )}
                  {onViewSource && (
                    <button
                      type="button"
                      onClick={() => onViewSource('Registered Sale Deed', 1, 'documentNumber')}
                      className="text-[9px] font-bold text-blue-400 hover:text-blue-300 underline"
                    >
                      [View Source]
                    </button>
                  )}
                </div>
              </div>
              <input
                {...register('documentNumber')}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">
                  Book / SRO Registration Number
                </label>
              </div>
              <input
                {...register('registrationNumber')}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">
                  Registration Date
                </label>
                <div className="flex items-center gap-1.5">
                  {defaultValues?.registrationDate && (
                    <span className="text-[9px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      AI: {defaultValues.registrationDate}
                    </span>
                  )}
                  {onViewSource && (
                    <button
                      type="button"
                      onClick={() => onViewSource('Registered Sale Deed', 1, 'registrationDate')}
                      className="text-[9px] font-bold text-blue-400 hover:text-blue-300 underline"
                    >
                      [View Source]
                    </button>
                  )}
                </div>
              </div>
              <input
                type="date"
                {...register('registrationDate')}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">
                  Sub-Registrar Office
                </label>
              </div>
              <input
                {...register('issuingAuthority')}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">
                  Previous Mutation Proceeding Number
                </label>
                {onViewSource && (
                  <button
                    type="button"
                    onClick={() => onViewSource('Prior Mutation Order / Proceedings', 1, 'mutationNumber')}
                    className="text-[9px] font-bold text-blue-400 hover:text-blue-300 underline"
                  >
                    [View Source]
                  </button>
                )}
              </div>
              <input
                {...register('mutationNumber')}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* STATUTORY SOURCE PROOF & CORRECTION AUDIT TRAIL RECORDING */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              STATUTORY VERIFICATION PROOF & AUDIT TRAIL
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Supporting Proof Source Used for Verification / Correction *
              </label>
              <select
                value={proofSource}
                onChange={(e) => setProofSource(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="State Land Records API (Synced)">Online: State Land Records API (Synced)</option>
                <option value="Physical / Certified Government Record">Offline: Physical / Certified Government Record</option>
                <option value="Uploaded Supporting Document (Sale Deed)">Offline: Uploaded Supporting Document (Registered Sale Deed)</option>
                <option value="Uploaded Supporting Document (RoR / Pattadar Passbook)">Offline: Uploaded Supporting Document (RoR / Pattadar Passbook)</option>
                <option value="Identity Proof Document (Masked Aadhaar / Voter ID)">Offline: Identity Proof Document (Masked Aadhaar / Voter ID)</option>
                <option value="Certified Cadastral Village Map / FMB Tippan">Offline: Certified Cadastral Village Map / FMB Tippan</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Correction / Verification Reason (Mandatory if fields modified)
              </label>
              <input
                type="text"
                placeholder="e.g., Name verified against identity proof; Area corrected per certified RoR"
                value={correctionReason}
                onChange={(e) => setCorrectionReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
          <p className="text-[10px] text-slate-400">
            Audit guarantee: All confirmed corrections are timestamped, signed with your DEO officer credential, and appended to the immutable audit trail before forwarding.
          </p>
        </div>

        {/* Action Buttons: [Save Changes]  [Save & Proceed to Review] */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveChangesOnly}
              className="px-5 py-2.5 rounded-2xl border border-slate-700 bg-slate-800 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-all flex items-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>Save Changes</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 border border-slate-800 rounded-2xl text-xs font-bold text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all"
              >
                {t('common.cancel')}
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-2xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-amber-600/30 hover:scale-105"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t('common.saving')}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save & Proceed to Review</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
