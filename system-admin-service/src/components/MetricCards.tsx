import React from 'react';
import { StatsCard } from '@shared/components/StatsCard';
import { Activity, Cpu, ShieldCheck, Database } from 'lucide-react';
import { useTranslation } from '../i18n';

export const MetricCards: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <StatsCard
        title={t('Microservices Health')}
        value={t('9 / 9 Online')}
        change={t('100% Uptime')}
        icon={Activity}
        iconColor="text-emerald-400 bg-emerald-400/10"
      />
      <StatsCard
        title={t('AI Inference Throughput')}
        value={t('142 docs/min')}
        change="Chitrapathak + MuRIL"
        icon={Cpu}
        iconColor="text-indigo-400 bg-indigo-400/10"
      />
      <StatsCard
        title={t('Database Queries P95')}
        value="18 ms"
        change="PostgreSQL + PostGIS"
        icon={Database}
        iconColor="text-blue-400 bg-blue-400/10"
      />
      <StatsCard
        title={t('Immutable Audit Hash')}
        value={t('Verified')}
        change={t('SHA-256 Ledger')}
        icon={ShieldCheck}
        iconColor="text-purple-400 bg-purple-400/10"
      />
    </div>
  );
};
