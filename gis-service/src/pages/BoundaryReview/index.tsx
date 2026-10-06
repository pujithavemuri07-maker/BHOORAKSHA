import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n';
import { useGISStore } from '../../store/gisStore';
import { ReviewHeader } from './ReviewHeader';
import { OverlapStatistics } from './OverlapStatistics';
import { BoundaryComparison } from './BoundaryComparison';
import { AdjoiningParcels } from './AdjoiningParcels';
import { RemarksInput } from './RemarksInput';
import { DecisionActions } from './DecisionActions';
import { InteractiveMap } from '../../components/InteractiveMap';
import { ConfirmModal } from '../../components/ConfirmModal';
import { AdjustModal } from '../../components/AdjustModal';
import { FlagFieldSurveyModal } from '../../components/FlagFieldSurveyModal';
import { RejectModal } from '../../components/RejectModal';
import { getGISClassification, TRAFFIC_LIGHT_SYSTEM } from '../../utils/constants';
import { toast } from 'react-hot-toast';
import {
  MapPin,
  AlertCircle,
  ArrowLeft,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Cpu,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const BoundaryReview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const applications = useGISStore((s) => s.applications);
  const confirmBoundary = useGISStore((s) => s.confirmBoundary);
  const adjustBoundary = useGISStore((s) => s.adjustBoundary);
  const flagFieldSurvey = useGISStore((s) => s.flagFieldSurvey);
  const rejectBoundary = useGISStore((s) => s.rejectBoundary);

  const application = useMemo(() => {
    return applications.find((a) => a.id === id);
  }, [applications, id]);

  const [activeModal, setActiveModal] = useState<'confirm' | 'adjust' | 'flag' | 'reject' | null>(null);
  const [remarks, setRemarks] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAdjustedCoords, setCurrentAdjustedCoords] = useState<[number, number][] | undefined>(undefined);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  if (!application) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-slate-900/60 rounded-2xl border border-slate-800 my-8">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white mb-2">Cadastral Application Not Found</h2>
        <p className="text-xs text-slate-400 mb-6">
          The requested parcel application ID <span className="font-mono text-teal-400">"{id}"</span> does not exist in the GIS database.
        </p>
        <button
          onClick={() => navigate('/gis/review')}
          className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs inline-flex items-center gap-2 hover:bg-teal-400 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to GIS Queue</span>
        </button>
      </div>
    );
  }

  const isFinalized =
    application.actionStatus === 'CONFIRMED' ||
    application.actionStatus === 'FIELD_SURVEY_REQUIRED' ||
    application.actionStatus === 'REJECTED' ||
    application.status === 'gis_verified' ||
    application.status === 'gis_flagged_field_survey' ||
    application.status === 'gis_rejected';

  // Handle vertex adjustment on the interactive map
  const handleVerticesChange = (newCoords: [number, number][]) => {
    setCurrentAdjustedCoords(newCoords);
  };

  // Handlers for modal actions
  const handleConfirmAction = async (userRemarks?: string) => {
    setIsProcessing(true);
    try {
      await confirmBoundary(application.id, userRemarks || remarks);
      toast.success(`Cadastral boundary for ${application.applicationNo} confirmed!`);
      setActiveModal(null);
    } catch {
      toast.error('Failed to confirm boundary');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAdjustAction = async (newCoordinates: [number, number][], userRemarks: string) => {
    setIsProcessing(true);
    try {
      await adjustBoundary(application.id, newCoordinates, userRemarks || remarks);
      toast.success(`Boundary coordinates for ${application.applicationNo} adjusted and recalculations saved!`);
      setActiveModal(null);
    } catch {
      toast.error('Failed to adjust boundary coordinates');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFlagFieldSurveyAction = async (userRemarks: string) => {
    setIsProcessing(true);
    try {
      await flagFieldSurvey(application.id, userRemarks || remarks);
      toast.success(`Parcels flagged for Mandal DGPS field survey!`);
      setActiveModal(null);
    } catch {
      toast.error('Failed to flag application for field survey');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectAction = async (reason: string, userRemarks: string) => {
    setIsProcessing(true);
    try {
      await rejectBoundary(application.id, reason, userRemarks || remarks);
      toast.success(`Cadastral application ${application.applicationNo} rejected.`);
      setActiveModal(null);
    } catch {
      toast.error('Failed to reject boundary application');
    } finally {
      setIsProcessing(false);
    }
  };

  // Dynamic calculations
  const classification = getGISClassification(application.overlapPercentage);
  const areaDiff = Math.abs(application.documentAreaAcres - application.govtCadastralAreaAcres);
  const isWithinTolerance = classification.trafficLight === 'green' || areaDiff <= 0.05;
  const hasAdjoiningConflict = application.adjoiningParcels.some((p) => p.hasConflict);

  const hasAdjustedHistory =
    application.previousOverlapPercentage !== undefined &&
    application.previousOverlapPercentage !== application.overlapPercentage;

  const prevTraffic = application.previousTrafficLight
    ? TRAFFIC_LIGHT_SYSTEM[application.previousTrafficLight]
    : null;
  const currTraffic = TRAFFIC_LIGHT_SYSTEM[classification.trafficLight];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-fade-in">
      {/* Section 1: Application Header */}
      <ReviewHeader application={application} />

      {/* Section 1B: BOUNDARY UPDATED Comparison Banner (when boundary was adjusted) */}
      {hasAdjustedHistory && (
        <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900/90 to-teal-950/60 border border-cyan-500/40 rounded-2xl p-5 shadow-2xl space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider text-xs">
              <Sparkles className="w-4 h-4" />
              <span>BOUNDARY GEOMETRY UPDATED & RECALCULATED</span>
            </div>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full font-mono font-bold border border-cyan-500/30">
              Live Geometry Recalculation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {/* Previous Spatial Match */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-medium">
                Previous Spatial Match
              </span>
              <span className="font-bold text-amber-400 font-mono text-sm line-through">
                {application.previousOverlapPercentage?.toFixed(1)}%
              </span>
            </div>

            {/* Current Spatial Match */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-emerald-500/30">
              <span className="text-[10px] text-emerald-400 block uppercase font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Updated Spatial Match
              </span>
              <span className="font-extrabold text-emerald-300 font-mono text-sm">
                {application.overlapPercentage.toFixed(1)}% Match
              </span>
            </div>

            {/* Previous Traffic Light */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-medium">
                Previous Status
              </span>
              <span className="font-semibold text-slate-300 text-xs">
                {prevTraffic ? prevTraffic.label : 'RED / URGENT'} ({application.previousPriority || 'HIGH'})
              </span>
            </div>

            {/* Current Traffic Light */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-teal-500/30">
              <span className="text-[10px] text-teal-400 block uppercase font-bold">
                Current Status
              </span>
              <span className="font-bold text-white text-xs">
                {currTraffic.label} ({classification.priority})
              </span>
            </div>
          </div>
        </div>
      )}

      {/* WHAT AM I SEEING? Quick Explanatory Panel */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-teal-400" />
            <span>WHAT AM I SEEING?</span>
          </h4>
          <span className="text-[10px] text-teal-400 font-mono font-semibold">Visual Layer Guide</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-blue-500/20 flex items-center gap-2.5">
            <span className="w-3.5 h-3.5 rounded bg-blue-500 border border-blue-400 shrink-0" />
            <div>
              <span className="font-bold text-blue-300 block">Blue Line</span>
              <span className="text-[11px] text-slate-400">Government cadastral boundary</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-red-500/20 flex items-center gap-2.5">
            <span className="w-3.5 h-3.5 rounded bg-red-500 border border-red-400 shrink-0" />
            <div>
              <span className="font-bold text-red-300 block">Red Line</span>
              <span className="text-[11px] text-slate-400">Claimed document boundary</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-yellow-500/20 flex items-center gap-2.5">
            <span className="w-3.5 h-3.5 rounded bg-yellow-400 border border-yellow-300 shrink-0" />
            <div>
              <span className="font-bold text-yellow-300 block">Yellow Zone</span>
              <span className="text-[11px] text-slate-400">Intersecting overlap area</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-emerald-500/20 flex items-center gap-2.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-500 border border-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-emerald-300 block">Green Area</span>
              <span className="text-[11px] text-slate-400">Non-overlapping matching area</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Interactive Cadastral Leaflet Map */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-400" />
              <span>Interactive PostGIS Cadastral Map</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Blue = Government Cadastre | Red = Document Claim | Yellow = Overlap Intersection | Green = Non-overlap
            </p>
          </div>
        </div>

        <InteractiveMap
          application={application}
          onVerticesChange={handleVerticesChange}
          isFinalized={isFinalized}
        />
      </div>

      {/* WHAT NEEDS ATTENTION? Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>WHAT NEEDS ATTENTION?</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/20 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">Survey Number Matched</span>
              <span className="text-[11px] text-slate-400">Sy. #{application.surveyNumber} verified in BhooNaksha</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/20 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">Government Parcel Found</span>
              <span className="text-[11px] text-slate-400">Recorded extent: {application.govtCadastralAreaAcres.toFixed(2)} Ac</span>
            </div>
          </div>

          <div className={`p-3 rounded-xl bg-slate-950/60 border flex items-center gap-2.5 ${
            isWithinTolerance ? 'border-emerald-500/20' : 'border-amber-500/30'
          }`}>
            {isWithinTolerance ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <div>
              <span className="font-bold text-white block">
                {isWithinTolerance ? 'Boundary Difference Resolved' : 'Area Difference Check'}
              </span>
              <span className={`text-[11px] ${isWithinTolerance ? 'text-slate-400' : 'text-amber-400'}`}>
                {areaDiff.toFixed(2)} Ac difference ({isWithinTolerance ? 'Within tolerance' : 'Exceeds standard tolerance'})
              </span>
            </div>
          </div>

          {hasAdjoiningConflict && (
            <div className="p-3 rounded-xl bg-slate-950/60 border border-rose-500/30 flex items-center gap-2.5 sm:col-span-2 lg:col-span-3">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <span className="font-bold text-rose-300 block">Adjoining Parcel Boundary Overlap</span>
                <span className="text-[11px] text-slate-300">
                  Document boundary claims enter adjoining survey parcel line. Specialist verification or vertex adjustment required.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section 3: Overlap Statistics */}
      <OverlapStatistics application={application} />

      {/* Section 4 & 5: Boundary Comparison & Adjoining Parcels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BoundaryComparison comparisons={application.boundaryComparison} />
        <AdjoiningParcels parcels={application.adjoiningParcels} />
      </div>

      {/* Collapsible Technical GIS Details Section */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-3">
        <button
          type="button"
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold text-white">TECHNICAL GIS DETAILS</h3>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono border border-slate-700">
              PostGIS / Coordinate Metadata
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-teal-400 font-semibold">
            <span>{showTechnicalDetails ? 'Hide Technical Metadata' : 'Show Technical Metadata'}</span>
            {showTechnicalDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showTechnicalDetails && (
          <div className="pt-3 border-t border-slate-800 space-y-3 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-300 font-mono text-[11px]">
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block uppercase font-sans">Projection / CRS</span>
                <span className="text-teal-300 font-bold">EPSG:4326 (WGS84)</span>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block uppercase font-sans">Spatial Engine</span>
                <span className="text-slate-200">PostGIS ST_Intersection</span>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block uppercase font-sans">GIS Protocol</span>
                <span className="text-slate-200">WFS 2.0 / Vector Tiles</span>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="text-slate-500 text-[10px] block uppercase font-sans">ULPIN Code</span>
                <span className="text-amber-400 font-bold">{application.ulpin || 'ULPIN-36-RR-SER-123'}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Document Boundary Vertices Coordinates:</span>
              <div className="font-mono text-[10px] text-slate-300 break-all bg-slate-900 p-2 rounded border border-slate-800">
                {JSON.stringify(application.documentBoundaryCoordinates)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 6: Official Remarks Input (only shown if not finalized) */}
      {!isFinalized && <RemarksInput remarks={remarks} onChange={setRemarks} />}

      {/* NEXT ACTION Guidance Banner */}
      <div className="bg-slate-950 border border-teal-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center shrink-0">
            <ArrowRight className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider block">RECOMMENDED NEXT ACTION</span>
            <span className="font-semibold text-white">
              {isFinalized
                ? application.actionStatus === 'CONFIRMED' || application.status === 'gis_verified'
                  ? '✓ GIS boundary verification completed. Boundary ratified in state cadastre.'
                  : application.actionStatus === 'FIELD_SURVEY_REQUIRED' || application.status === 'gis_flagged_field_survey'
                  ? '✓ Await Mandal field survey report and DGPS demarcation.'
                  : '✓ Case finalized as boundary mismatch. Archival record preserved.'
                : application.status === 'gis_adjusted'
                ? 'Review updated boundary coordinates and select final workflow action below.'
                : classification.trafficLight === 'green'
                ? 'High spatial match (>75%). Review overlap summary and click "Confirm Boundary" to ratify.'
                : classification.trafficLight === 'yellow'
                ? 'Moderate spatial mismatch (50-75%). Click "Adjust Boundary" to snap vertices or "Flag for Field Survey".'
                : 'Significant spatial mismatch (<50%). Review discrepancy and execute appropriate decision action.'}
            </span>
          </div>
        </div>
      </div>

      {/* Section 7: Decision Actions */}
      <DecisionActions
        application={application}
        onConfirm={() => setActiveModal('confirm')}
        onAdjust={() => setActiveModal('adjust')}
        onFlagFieldSurvey={() => setActiveModal('flag')}
        onReject={() => setActiveModal('reject')}
        isProcessing={isProcessing}
      />

      {/* Modals */}
      {activeModal === 'confirm' && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          applicationId={application.applicationNo}
          onConfirm={handleConfirmAction}
          isSubmitting={isProcessing}
          trafficLight={classification.trafficLight}
        />
      )}

      {activeModal === 'adjust' && (
        <AdjustModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          applicationId={application.applicationNo}
          currentCoordinates={currentAdjustedCoords || application.documentBoundaryCoordinates}
          onConfirm={handleAdjustAction}
          isSubmitting={isProcessing}
        />
      )}

      {activeModal === 'flag' && (
        <FlagFieldSurveyModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          applicationId={application.applicationNo}
          onConfirm={handleFlagFieldSurveyAction}
          isSubmitting={isProcessing}
        />
      )}

      {activeModal === 'reject' && (
        <RejectModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          applicationId={application.applicationNo}
          onConfirm={handleRejectAction}
          isSubmitting={isProcessing}
        />
      )}
    </div>
  );
};
export default BoundaryReview;
