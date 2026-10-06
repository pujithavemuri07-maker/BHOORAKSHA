import React, { useState } from 'react';
import { X, Link2, Search, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { useTranslation } from '../../i18n';
import toast from 'react-hot-toast';

interface LinkUlpinModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  currentUlpin?: string;
  onSuccess: (ulpin: string) => void;
}

export const LinkUlpinModal: React.FC<LinkUlpinModalProps> = ({
  isOpen,
  onClose,
  documentId,
  currentUlpin,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [ulpinQuery, setUlpinQuery] = useState(currentUlpin || 'KA-1234-5678-9012');
  const [selectedUlpin, setSelectedUlpin] = useState(currentUlpin || 'KA-1234-5678-9012');
  const [isLinking, setIsLinking] = useState(false);

  if (!isOpen) return null;

  const sampleUlpins = [
    {
      ulpin: 'KA-1234-5678-9012',
      surveyNo: '123/456',
      owner: 'Suresh Reddy',
      village: 'Yelahanka',
      area: '2.48 Acres',
      confidence: 96,
    },
    {
      ulpin: 'KA-5566-7788-9900',
      surveyNo: '42/A',
      owner: 'N. Sitaram Rao',
      village: 'Begur',
      area: '1.25 Acres',
      confidence: 84,
    },
    {
      ulpin: 'KA-9988-7766-5544',
      surveyNo: '88/3',
      owner: 'Basavaraju M.',
      village: 'Chamundi Foothills',
      area: '3.10 Acres',
      confidence: 92,
    },
  ];

  const filtered = sampleUlpins.filter(
    (u) =>
      u.ulpin.toLowerCase().includes(ulpinQuery.toLowerCase()) ||
      u.surveyNo.toLowerCase().includes(ulpinQuery.toLowerCase()) ||
      u.owner.toLowerCase().includes(ulpinQuery.toLowerCase())
  );

  const handleLink = () => {
    if (!selectedUlpin) {
      toast.error('Please select a target modern ULPIN');
      return;
    }
    setIsLinking(true);
    setTimeout(() => {
      setIsLinking(false);
      onSuccess(selectedUlpin);
      toast.success(`Archival record ${documentId} bound to ULPIN ${selectedUlpin}!`);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 text-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {t('oldDocuments.linkUlpin', 'Link to Modern ULPIN')}
              </h2>
              <p className="text-xs text-slate-400">
                Bind archival deed {documentId} to live BHOOMI cadastral polygon
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={ulpinQuery}
            onChange={(e) => setUlpinQuery(e.target.value)}
            placeholder="Search by 14-digit ULPIN, Survey No, or Owner Name..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>

        {/* Cadastral Matching Candidates */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Cadastral Matching Candidates ({filtered.length})
          </span>
          {filtered.map((item) => (
            <div
              key={item.ulpin}
              onClick={() => setSelectedUlpin(item.ulpin)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedUlpin === item.ulpin
                  ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                  : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white text-xs">{item.ulpin}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Sy. #{item.surveyNo}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span>{item.owner}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {item.village} ({item.area})
                  </span>
                </div>
              </div>
              <div className="text-right font-mono text-xs">
                <span className="text-emerald-400 font-bold">{item.confidence}% match</span>
                {selectedUlpin === item.ulpin && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto mt-1" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleLink}
            disabled={isLinking || !selectedUlpin}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 disabled:opacity-50"
          >
            <Link2 className="w-4 h-4" />
            <span>{isLinking ? 'Binding...' : 'Bind & Finalize Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
