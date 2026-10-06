import React from 'react';
import {
  Cpu,
  Sparkles,
  GitBranch,
  Clock,
  ShieldCheck,
  AlertOctagon,
  TrendingUp,
  BarChart2,
  RefreshCw,
} from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { useTranslation } from '../../i18n';

export const AIPerformancePage: React.FC = () => {
  const { t } = useTranslation();
  const { aiAgents } = useAdminStore();

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/40 border border-purple-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
            {t('admin.aiAgentHeading')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {t('admin.aiPerformance')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Monitor multimodal vision-language models, Indic named-entity extractors, legal rule engines, and cadastral spatial congruence scores.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400 block text-[10px]">Fleet Aggregate Accuracy</span>
            <span className="text-base font-bold text-purple-400 font-mono">96.8%</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400 block text-[10px]">Human Override Rate</span>
            <span className="text-base font-bold text-emerald-400 font-mono">3.0%</span>
          </div>
        </div>
      </div>

      {/* 4 Agent Cards with Deep Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {aiAgents.map((agent) => (
          <div
            key={agent.id}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/30 transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{agent.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-mono text-indigo-400">{agent.modelName}</span>
                    <span className="text-[10px] text-slate-500 font-mono bg-slate-800 px-1.5 py-0.5 rounded">
                      {agent.version}
                    </span>
                  </div>
                </div>
              </div>

              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase">
                {agent.status}
              </span>
            </div>

            {/* Accuracy & Confidence Bars */}
            <div className="space-y-3 pt-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300 font-medium">Model Validation Accuracy</span>
                  <span className="font-bold text-purple-400 font-mono">{agent.accuracy}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${agent.accuracy}%` }}
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300 font-medium">Mean Confidence Score</span>
                  <span className="font-bold text-emerald-400 font-mono">{agent.confidenceScore}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${agent.confidenceScore}%` }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Inference Latency Breakdown */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                <span>Inference Latency Percentiles</span>
                <span className="font-mono text-slate-500">Avg: {agent.avgProcessingTimeSec}s</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-center">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/60">
                  <span className="text-[10px] text-slate-500 block">P50</span>
                  <span className="font-mono font-bold text-slate-200">{agent.p50Sec}s</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/60">
                  <span className="text-[10px] text-slate-500 block">P95</span>
                  <span className="font-mono font-bold text-indigo-400">{agent.p95Sec}s</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/60">
                  <span className="text-[10px] text-slate-500 block">P99</span>
                  <span className="font-mono font-bold text-purple-400">{agent.p99Sec}s</span>
                </div>
              </div>
            </div>

            {/* Extra Metadata Footer */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Last Retrained: {new Date(agent.lastRetrained).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
                <span>Override: <strong className="text-white">{agent.overrideRate}%</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confidence Distribution Matrix & Model Version Registry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confidence Score Buckets */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-purple-400" />
              <span>{t('admin.confidenceDist')}</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Today's Inferences</span>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            {[
              { bucket: '95% – 100% High Confidence (Auto-Approve Candidate)', count: 3240, pct: 64, color: 'bg-emerald-500' },
              { bucket: '85% – 94% Standard Confidence (Officer Review Required)', count: 1420, pct: 28, color: 'bg-indigo-500' },
              { bucket: '70% – 84% Low Confidence (Flagged for Field Verification)', count: 310, pct: 6, color: 'bg-amber-500' },
              { bucket: '< 70% Anomaly / Poor Scan Quality (Rejected by Agent)', count: 98, pct: 2, color: 'bg-rose-500' },
            ].map((b, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-300 font-medium">{b.bucket}</span>
                  <span className="font-mono text-slate-400">
                    <strong className="text-white">{b.count}</strong> ({b.pct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div style={{ width: `${b.pct}%` }} className={`h-full ${b.color} rounded-full`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Version Registry */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-indigo-400" />
              <span>{t('admin.modelVersions')}</span>
            </h3>
            <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded">
              MLOps Registry
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                name: 'Chitrapathak Multimodal OCR',
                version: 'v3.2.1-prod',
                status: 'Production Canary (100% Traffic)',
                checkpoint: 'gs://bhooraksha-models/chitrapathak-v3.2.1.pt',
              },
              {
                name: 'MuRIL Indic NER Tokenizer',
                version: 'v2.8.0-prod',
                status: 'Production Canary (100% Traffic)',
                checkpoint: 'gs://bhooraksha-models/muril-indic13-ner-v2.8.0.bin',
              },
              {
                name: 'LexBhoomi Statutory Rule Engine',
                version: 'v4.0.3-prod',
                status: 'Production Canary (100% Traffic)',
                checkpoint: 'gs://bhooraksha-models/lexbhoomi-rules-v4.0.3.onnx',
              },
              {
                name: 'BhooNaksha Vector Geometry Engine',
                version: 'v2.4.0-prod',
                status: 'Production Canary (100% Traffic)',
                checkpoint: 'gs://bhooraksha-models/cadastral-vector-v2.4.0.onnx',
              },
            ].map((m, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{m.name}</span>
                  <span className="font-mono text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded">
                    {m.version}
                  </span>
                </div>
                <div className="text-[11px] text-emerald-400">{m.status}</div>
                <div className="text-[10px] font-mono text-slate-500 truncate">{m.checkpoint}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
