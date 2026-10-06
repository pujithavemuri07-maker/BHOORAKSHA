import React, { useState } from 'react';
import { Map, MapPin, CheckCircle2, AlertTriangle, Compass, Maximize2, Layers, Info } from 'lucide-react';
import { GISParcelMapModal } from './GISParcelMapModal';
import { cn } from '../../lib/utils';

interface GISSpatialValidationProps {
  surveyNumber: string;
}

export const GISSpatialValidation: React.FC<GISSpatialValidationProps> = ({ surveyNumber }) => {
  const [showMapModal, setShowMapModal] = useState(false);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                GIS Spatial Validation & Cadastral Verification
              </h3>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold px-2 py-0.5 rounded-full">
                BhooNaksha Vector Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Vector parcel geometry, ULPIN centroid triangulation, and boundary overlap scrutiny
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">GIS Status:</span>
            <span className="text-[11px] font-bold font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              REVIEW REQUIRED
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowMapModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>VIEW PARCEL ON MAP</span>
          </button>
        </div>
      </div>

      {/* Metrics & Checks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-1.5">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Recorded Area (Deed)</span>
          <p className="text-lg font-bold font-mono text-white">2.50 Acres</p>
          <span className="text-[11px] text-slate-400 block">Stated in registered schedule</span>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-1.5">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Mapped Area (GIS)</span>
          <p className="text-lg font-bold font-mono text-amber-400">2.49 Acres</p>
          <span className="text-[11px] text-slate-400 block">Polygon vector surface area</span>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-1.5">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Area Difference</span>
          <p className="text-lg font-bold font-mono text-emerald-400">0.01 Acres</p>
          <span className="text-[11px] text-emerald-500/90 block font-medium">Within ±0.5% statutory limit</span>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-1.5">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">Spatial Centroid</span>
          <p className="text-xs font-mono font-bold text-slate-200 mt-1">17.4435° N, 78.3772° E</p>
          <span className="text-[11px] text-indigo-400 block font-mono">ULPIN: 36-RR-SER-123-01</span>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-slate-950/60 rounded-xl border border-emerald-500/20 flex items-center justify-between">
          <span className="text-slate-300 font-medium">Boundary Check:</span>
          <span className="text-emerald-400 font-bold font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Passed
          </span>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-xl border border-amber-500/30 flex items-center justify-between">
          <span className="text-slate-300 font-medium">Parcel Overlap:</span>
          <span className="text-amber-400 font-bold font-mono flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            Possible (0.4%)
          </span>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-xl border border-emerald-500/20 flex items-center justify-between">
          <span className="text-slate-300 font-medium">Survey Geometry:</span>
          <span className="text-emerald-400 font-bold font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Regular Poly
          </span>
        </div>

        <div className="p-3 bg-slate-950/60 rounded-xl border border-emerald-500/20 flex items-center justify-between">
          <span className="text-slate-300 font-medium">Geo-Reference:</span>
          <span className="text-emerald-400 font-bold font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            EPSG:4326
          </span>
        </div>
      </div>

      {/* Mandatory Statutory Notice */}
      <div className="p-3.5 bg-amber-500/5 rounded-2xl border border-amber-500/20 text-xs text-slate-300 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="text-amber-400 font-semibold block">
            Statutory AI-GIS Advisory Notice
          </strong>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Potential spatial conflict detected. GIS flags potential boundary and buffer conflicts for authorized revenue officer review. Does not constitute a final legal boundary dispute determination.
          </p>
        </div>
      </div>

      {/* Map Modal */}
      <GISParcelMapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        surveyNumber={surveyNumber}
      />
    </div>
  );
};
