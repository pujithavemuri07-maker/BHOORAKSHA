import React from 'react';
import { Cpu, CheckCircle } from 'lucide-react';

export const AIPerformanceChart: React.FC = () => {
  const models = [
    { name: 'Chitrapathak-1 Indic OCR', type: 'Vision-Language', accuracy: '98.6%', latency: '420ms' },
    { name: 'MuRIL Address NER', type: 'Indic Transformer', accuracy: '97.9%', latency: '110ms' },
    { name: 'PostGIS Spatial Intersection', type: 'Spatial Topology Engine', accuracy: '100%', latency: '35ms' },
    { name: 'Legal Risk Classifier', type: 'LLM Multi-Agent', accuracy: '96.2%', latency: '680ms' },
  ];

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-purple-400" />
          <span>AI Model Accuracy & Drift Telemetry</span>
        </h3>
        <span className="text-[11px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded font-bold">
          Zero Hallucination Guard Active
        </span>
      </div>

      <div className="space-y-2 text-xs">
        {models.map((m, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div>
              <div className="font-bold text-white">{m.name}</div>
              <div className="text-[11px] text-slate-400">{m.type}</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-emerald-400 font-bold">{m.accuracy} Accuracy</div>
              <div className="text-[11px] text-slate-400 font-mono">Latency: {m.latency}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
