import React from 'react';
import { BookOpen, MapPin, ArrowRight, Layers, Compass } from 'lucide-react';
import { useTranslation } from '../../i18n';

export default function LegacyRecordsGIS() {
  const { t } = useTranslation();

  const gisLegacyItems = [
    {
      docId: 'OLD-000123',
      type: 'Register (1975)',
      village: 'Yelahanka',
      spatialIssue: 'Survey Renumbering: Sy. 123/2 re-indexed as 123/456 in 1982 Village Map',
      areaShift: '0.8% area divergence (2.50 vs 2.48 Acres)',
      status: 'Awaiting Electronic Village Cadastre Overlay',
    },
    {
      docId: 'OLD-000122',
      type: 'Old Sale Deed (1968)',
      village: 'Begur',
      spatialIssue: 'Sub-division bifurcation boundary verification',
      areaShift: '1.25 Acres parcel polygon check',
      status: 'Shapefile Polygon Ingestion Required',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tight">
              {t('oldDocuments.legacyRecords', 'Legacy Records (Spatial & Boundary Verification)')}
            </h1>
            <p className="text-xs text-slate-400">
              Correlate historical survey numbers and hand-drawn FMB field sketches against modern DGPS polygons
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Doc ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Village</th>
                <th className="py-3 px-4">Cadastral / Boundary Anomaly</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
              {gisLegacyItems.map((item) => (
                <tr key={item.docId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-white">{item.docId}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">{item.type}</td>
                  <td className="py-3.5 px-4">{item.village}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-blue-400 font-semibold block">{item.spatialIssue}</span>
                    <span className="text-[10px] text-slate-400">{item.areaShift}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-mono font-bold border border-blue-500/20">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold transition-all inline-flex items-center gap-1"
                    >
                      <Compass className="w-3 h-3" />
                      <span>Map Overlay</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
