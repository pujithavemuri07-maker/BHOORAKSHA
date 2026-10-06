import React from 'react';
import { MapPin, Layers, Maximize2 } from 'lucide-react';

interface MapPreviewProps {
  surveyNumber: string;
  village: string;
  extentAcres: number;
  hasOverlap?: boolean;
  overlapPercentage?: number;
  className?: string;
}

export const MapPreview: React.FC<MapPreviewProps> = ({
  surveyNumber,
  village,
  extentAcres,
  hasOverlap = false,
  overlapPercentage = 0,
  className = '',
}) => {
  return (
    <div
      className={`relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 text-white min-h-[240px] flex flex-col justify-between p-4 ${className}`}
    >
      {/* Background Cadastral Vector Grid Overlay */}
      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Simulated Cadastral Polygon Boundaries */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-emerald-500 fill-emerald-500/15" strokeWidth="2">
        <polygon points="60,40 180,30 220,130 90,170" />
        {hasOverlap && (
          <polygon
            points="150,50 240,40 260,140 180,110"
            className="stroke-red-500 fill-red-500/30 stroke-dashed animate-pulse"
            strokeDasharray="4"
          />
        )}
      </svg>

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold">{village}</span>
          <span className="text-slate-400">| Survey #{surveyNumber}</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all text-xs">
            <Layers className="w-3.5 h-3.5 text-slate-300" />
          </button>
          <button className="p-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all text-xs">
            <Maximize2 className="w-3.5 h-3.5 text-slate-300" />
          </button>
        </div>
      </div>

      {/* Bottom Footer Info */}
      <div className="relative z-10 flex items-center justify-between mt-auto">
        <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-xs border border-white/10">
          Extent: <span className="text-emerald-400 font-bold">{extentAcres} Acres</span>
        </div>
        {hasOverlap && (
          <div className="bg-red-500/80 text-white font-semibold text-xs px-2.5 py-1 rounded shadow-lg backdrop-blur-md">
            ⚠️ Overlap Detected: {overlapPercentage}%
          </div>
        )}
      </div>
    </div>
  );
};
