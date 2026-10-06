import { UserCheck, MessageSquare, Clock } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

interface DEORemarksProps {
  deoName?: string;
  remarks?: string;
  forwardedAt?: string;
}

export const DEORemarks = ({ deoName, remarks, forwardedAt }: DEORemarksProps) => {
  if (!remarks && !deoName) return null;

  return (
    <div className="bg-sky-950/20 border border-sky-500/30 rounded-2xl p-5 shadow-lg space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-sky-500/10 text-sky-400 rounded-lg">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-300">
              DEO (Maker) Endorsement & Notes
            </h4>
            <p className="text-[11px] text-slate-400">
              Officer: <span className="text-slate-200 font-semibold">{deoName || 'Data Entry Officer'}</span>
            </p>
          </div>
        </div>
        {forwardedAt && (
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>Forwarded: {formatDate(forwardedAt)}</span>
          </div>
        )}
      </div>

      <div className="bg-slate-900/80 rounded-xl p-3.5 border border-sky-500/20 text-xs text-slate-200 leading-relaxed flex items-start gap-2.5">
        <MessageSquare className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <p className="font-mono text-slate-300 text-xs">{remarks || 'No additional remarks provided by maker.'}</p>
      </div>
    </div>
  );
};
