import { useState, useMemo } from 'react';
import { useTranslation } from '../../i18n';
import { useGISStore } from '../../store/gisStore';
import { QueueFilters } from './QueueFilters';
import { QueueTable } from './QueueTable';
import { EmptyState } from './EmptyState';
import { BatchActionsBar } from '../../components/BatchActionsBar';
import { toast } from 'react-hot-toast';
import { Layers, CheckSquare, Sparkles } from 'lucide-react';

export const GISQueuePage = () => {
  const { t } = useTranslation();
  const applications = useGISStore((s) => s.applications);
  const batchConfirm = useGISStore((s) => s.batchConfirm);
  const batchFlagFieldSurvey = useGISStore((s) => s.batchFlagFieldSurvey);
  const batchReject = useGISStore((s) => s.batchReject);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrafficLight, setSelectedTrafficLight] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);

  // Counts for traffic lights
  const counts = useMemo(() => {
    return {
      all: applications.length,
      green: applications.filter((a) => a.trafficLight === 'green').length,
      yellow: applications.filter((a) => a.trafficLight === 'yellow').length,
      red: applications.filter((a) => a.trafficLight === 'red').length,
    };
  }, [applications]);

  // Filtered applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          app.applicationNo.toLowerCase().includes(q) ||
          app.citizenName.toLowerCase().includes(q) ||
          app.surveyNumber.toLowerCase().includes(q) ||
          app.village.toLowerCase().includes(q) ||
          app.mandal.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Traffic Light
      if (selectedTrafficLight !== 'all' && app.trafficLight !== selectedTrafficLight) {
        return false;
      }

      // Status
      if (selectedStatus !== 'all' && app.status !== selectedStatus) {
        return false;
      }

      // Priority
      if (selectedPriority !== 'all' && app.priority !== selectedPriority) {
        return false;
      }

      return true;
    });
  }, [applications, searchQuery, selectedTrafficLight, selectedStatus, selectedPriority]);

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredApplications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredApplications.map((a) => a.id));
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedTrafficLight('all');
    setSelectedStatus('all');
    setSelectedPriority('all');
  };

  // Batch actions
  const handleBatchConfirm = async (ids: string[], remarks?: string) => {
    setIsBatchProcessing(true);
    try {
      await batchConfirm(ids, remarks || 'Bulk boundary confirmation by GIS officer');
      toast.success(`${ids.length} parcels confirmed successfully!`);
      setSelectedIds([]);
    } catch {
      toast.error('Failed to confirm parcels');
    } finally {
      setIsBatchProcessing(false);
    }
  };

  const handleBatchFlag = async (ids: string[], remarks: string) => {
    setIsBatchProcessing(true);
    try {
      await batchFlagFieldSurvey(ids, remarks);
      toast.success(`${ids.length} parcels flagged for Mandal Field Survey!`);
      setSelectedIds([]);
    } catch {
      toast.error('Failed to flag parcels');
    } finally {
      setIsBatchProcessing(false);
    }
  };

  const handleBatchReject = async (ids: string[], reason: string, remarks: string) => {
    setIsBatchProcessing(true);
    try {
      await batchReject(ids, reason, remarks);
      toast.success(`${ids.length} parcels rejected due to boundary discrepancies.`);
      setSelectedIds([]);
    } catch {
      toast.error('Failed to reject parcels');
    } finally {
      setIsBatchProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-teal-400" />
              <span>{t('gis.queue')}</span>
            </h1>
            <span className="text-xs bg-slate-800 text-teal-300 font-mono px-2.5 py-0.5 rounded-full border border-slate-700">
              {filteredApplications.length} Parcels
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cadastral parcel queue for sub-meter boundary verification and overlap resolution
          </p>
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 bg-teal-500/10 px-3 py-1.5 rounded-xl border border-teal-500/20">
            <CheckSquare className="w-4 h-4" />
            <span>{selectedIds.length} Selected for Batch Actions</span>
          </div>
        )}
      </div>

      {/* Filter Controls */}
      <QueueFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTrafficLight={selectedTrafficLight}
        onTrafficLightChange={setSelectedTrafficLight}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedPriority={selectedPriority}
        onPriorityChange={setSelectedPriority}
        onReset={handleResetFilters}
        counts={counts}
      />

      {/* Table or Empty State */}
      {filteredApplications.length === 0 ? (
        <EmptyState onResetFilters={handleResetFilters} />
      ) : (
        <QueueTable
          applications={filteredApplications}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
        />
      )}

      {/* Floating Batch Actions Bar */}
      <BatchActionsBar
        selectedIds={selectedIds}
        onClearSelection={() => setSelectedIds([])}
        onBatchConfirm={handleBatchConfirm}
        onBatchFlag={handleBatchFlag}
        onBatchReject={handleBatchReject}
        isLoading={isBatchProcessing}
      />
    </div>
  );
};
export default GISQueuePage;
