import { useRevenueStore } from '../store/revenueStore';
import toast from 'react-hot-toast';

export const useBatchActions = () => {
  const batchApproveStore = useRevenueStore((s) => s.batchApprove);
  const batchRejectStore = useRevenueStore((s) => s.batchReject);

  const batchApprove = async (ids: string[], remarks?: string) => {
    try {
      await batchApproveStore(ids, remarks);
      toast.success(`${ids.length} applications approved & mutations triggered!`);
    } catch {
      toast.error('Failed to batch approve');
    }
  };

  const batchReject = async (ids: string[], reason: string, remarks: string) => {
    try {
      await batchRejectStore(ids, reason, remarks);
      toast.success(`${ids.length} applications rejected by order.`);
    } catch {
      toast.error('Failed to batch reject');
    }
  };

  return {
    batchApprove,
    batchReject,
  };
};
