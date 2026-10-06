import React from 'react';
import { TrafficLight } from '../api/types';
import { CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { TRAFFIC_LIGHT_SYSTEM } from '../utils/constants';
import { useTranslation } from '../i18n';

interface TrafficLightBadgeProps {
  trafficLight?: TrafficLight;
  status?: TrafficLight;
  overlapPercentage?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const TrafficLightBadge: React.FC<TrafficLightBadgeProps> = ({
  trafficLight,
  status,
  overlapPercentage,
  size = 'md',
}) => {
  const { t } = useTranslation();
  const tl: TrafficLight = trafficLight || status || 'green';
  const config = TRAFFIC_LIGHT_SYSTEM[tl] || TRAFFIC_LIGHT_SYSTEM.green;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }[size];

  const capitalized = tl.charAt(0).toUpperCase() + tl.slice(1);

  return (
    <span
      className={`inline-flex items-center font-bold uppercase tracking-wider rounded-md border ${config.badge} ${sizeClasses}`}
    >
      {tl === 'green' && <CheckCircle2 className="w-3.5 h-3.5" />}
      {tl === 'yellow' && <AlertTriangle className="w-3.5 h-3.5" />}
      {tl === 'red' && <AlertOctagon className="w-3.5 h-3.5" />}
      <span>
        {t(capitalized)}
        {overlapPercentage !== undefined ? ` (${overlapPercentage.toFixed(1)}%)` : ''}
      </span>
    </span>
  );
};
export default TrafficLightBadge;
