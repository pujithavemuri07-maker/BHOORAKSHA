import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  UploadCloud,
  BarChart3,
  Search,
  Filter,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Cpu,
  ChevronLeft,
  FileText,
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useOldDocumentsStore } from '../../store/oldDocumentsStore';

export default function OldDocumentsHub() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { documents, stats, searchQuery, setSearchQuery, selectedFilter, setSelectedFilter } = useOldDocumentsStore();
  const [docTypeFilter, setDocTypeFilter] = useState('all');

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.extractedFields.ownerName && doc.extractedFields.ownerName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      selectedFilter === 'all' ||
      (selectedFilter === 'processing' && doc.status === 'PROCESSING') ||
      (selectedFilter === 'awaiting' && (doc.status === 'AWAITING_VERIFICATION' || doc.status === 'UPLOADED')) ||
      (selectedFilter === 'completed' && (doc.status === 'COMPLETED' || doc.status === 'VERIFIED' || doc.status === 'ROUTED'));

    const matchesType = docTypeFilter === 'all' || doc.documentType === docTypeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>✅ Done</span>
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Cpu className="w-3.5 h-3.5 animate-pulse" />
            <span>⏳ HTR Running</span>
          </span>
        );
      case 'AWAITING_VERIFICATION':
      case 'UPLOADED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Search className="w-3.5 h-3.5" />
            <span>🔍 Verify</span>
          </span>
        );
      case 'ROUTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Layers className="w-3.5 h-3.5" />
            <span>📤 Routed</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Back link */}
      <div className="flex items-center justify-between">
        <Link
          to="/deo/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{t('Back to Dashboard', '← Back to Dashboard')}</span>
        </Link>
        <span className="text-[11px] font-mono font-bold text-amber-500/80 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          Module: Archival Cadastre Digitization v2.0
        </span>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
            <BookOpen className="w-4 h-4" />
            <span>{t('oldDocuments.title', 'Old Document Digitization')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t('oldDocuments.title', 'Old Document Digitization')}
          </h1>
          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            {t(
              'oldDocuments.subtitle',
              'Digitize old handwritten land records (registers, pattas, legacy deeds) and verify against modern records.'
            )}
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <Link
              to="/deo/old-documents/upload"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-2xl font-bold text-xs shadow-lg shadow-amber-600/30 transition-all hover:scale-105"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{t('oldDocuments.uploadBtn', '+ Upload Old Document')}</span>
            </Link>
            <button
              type="button"
              onClick={() => setSelectedFilter(selectedFilter === 'completed' ? 'all' : 'completed')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-2xl font-bold text-xs transition-all"
            >
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span>{t('oldDocuments.statisticsBtn', '📊 View Statistics')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-500 tracking-wider">
            {t('oldDocuments.pendingScans', 'Pending Scans')}
          </span>
          <p className="text-2xl font-black font-mono text-white mt-1">{stats.pendingScans}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Physical files queued for scanning</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <span className="text-[10px] font-mono uppercase font-bold text-amber-400 tracking-wider">
            {t('oldDocuments.processing', 'Processing')}
          </span>
          <p className="text-2xl font-black font-mono text-amber-400 mt-1">{stats.processing}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Sauvola + Chitrapathak HTR active</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <span className="text-[10px] font-mono uppercase font-bold text-purple-400 tracking-wider">
            {t('oldDocuments.awaitingVerification', 'Awaiting Verification')}
          </span>
          <p className="text-2xl font-black font-mono text-purple-400 mt-1">{stats.awaitingVerification}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Transcribed pages ready for DEO review</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 tracking-wider">
            {t('oldDocuments.digitizedToday', 'Digitized Today')}
          </span>
          <p className="text-2xl font-black font-mono text-emerald-400 mt-1">{stats.digitizedToday}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Bound to modern ULPIN cadastre</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {t('oldDocuments.recentUploads', 'Recent Uploads')}
            </h3>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {filteredDocs.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Doc ID, Village, Owner..."
                className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            {/* Quick Status Filter Tabs */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setSelectedFilter('all')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  selectedFilter === 'all' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter('processing')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  selectedFilter === 'processing' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                Processing
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter('awaiting')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  selectedFilter === 'awaiting' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                Verify
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter('completed')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  selectedFilter === 'completed' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                Done
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Doc ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Village</th>
                <th className="py-3 px-4">Year Range</th>
                <th className="py-3 px-4 text-center">HTR Conf.</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No archival land documents match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3.5 px-4 font-mono font-bold text-white group-hover:text-amber-400 transition-colors">
                      {doc.id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {doc.documentType}
                    </td>
                    <td className="py-3.5 px-4">
                      <span>{doc.village}</span>
                      <span className="text-[10px] text-slate-500 block font-mono">{doc.taluk}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {doc.yearFrom} – {doc.yearTo}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono font-bold text-amber-400">
                        {doc.overallConfidence}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(doc.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {doc.status === 'PROCESSING' ? (
                          <Link
                            to={`/deo/old-documents/processing/${doc.id}`}
                            className="px-3 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition-all inline-flex items-center gap-1"
                          >
                            <span>Live Progress</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        ) : (
                          <Link
                            to={`/deo/old-documents/verify/${doc.id}`}
                            className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all inline-flex items-center gap-1 group-hover:border-amber-500/40"
                          >
                            <span>Verify</span>
                            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-amber-400" />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
