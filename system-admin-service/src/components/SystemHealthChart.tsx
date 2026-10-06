import React from 'react';
import { Server, Cpu, HardDrive } from 'lucide-react';

export const SystemHealthChart: React.FC = () => {
  const services = [
    { name: 'bhooraksha-gateway (Nginx)', port: 80, cpu: '12%', mem: '142 MB', status: 'Healthy' },
    { name: 'bhooraksha-auth (FastAPI)', port: 8000, cpu: '18%', mem: '210 MB', status: 'Healthy' },
    { name: 'bhooraksha-ai-orchestrator', port: 8001, cpu: '45%', mem: '1.2 GB', status: 'Healthy' },
    { name: 'bhooraksha-postgres (PostGIS)', port: 5432, cpu: '22%', mem: '580 MB', status: 'Healthy' },
    { name: 'bhooraksha-redis (Cache)', port: 6379, cpu: '5%', mem: '48 MB', status: 'Healthy' },
    { name: 'bhooraksha-minio (S3 Storage)', port: 9000, cpu: '8%', mem: '180 MB', status: 'Healthy' },
  ];

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-indigo-400" />
          <span>Core Infrastructure & Container Telemetry</span>
        </h3>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
          Kubernetes HPA Ready
        </span>
      </div>

      <div className="space-y-2 text-xs">
        {services.map((s, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
            <div>
              <div className="font-bold text-white font-mono">{s.name}</div>
              <div className="text-[11px] text-slate-400">Port {s.port}</div>
            </div>
            <div className="flex items-center gap-4 text-slate-300 font-mono">
              <span className="flex items-center gap-1"><Cpu className="w-3 h-3 text-slate-400" /> {s.cpu}</span>
              <span className="flex items-center gap-1"><HardDrive className="w-3 h-3 text-slate-400" /> {s.mem}</span>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[11px] font-sans">
                {s.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
