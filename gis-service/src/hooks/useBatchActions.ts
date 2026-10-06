import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gisApi } from '../api/gisApi';
import toast from 'react-hot-toast';

export const useBatchActions = () => {
  const queryClient = useQueryClient();

  const batchConfirm = useMutation({
    mutationFn: ({ ids, remarks }: { ids: string[]; remarks?: string }) =>
      gisApi.batchConfirm(ids, remarks),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['gis-queue'] });
      queryClient.invalidateQueries({ queryKey: ['gis-history'] });
      queryClient.invalidateQueries({ queryKey: ['gis-stats'] });
      toast.success(`${vars.ids.length} parcels confirmed & verified`);
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to confirm selected parcels');
    },
  });

  const batchFlag = useMutation({
    mutationFn: ({ ids, remarks }: { ids: string[]; remarks: string }) =>
      gisApi.batchFlag(ids, remarks),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['gis-queue'] });
      queryClient.invalidateQueries({ queryKey: ['gis-history'] });
      queryClient.invalidateQueries({ queryKey: ['gis-stats'] });
      toast.success(`${vars.ids.length} parcels flagged for field survey`);
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to flag selected parcels');
    },
  });

  const batchReject = useMutation({
    mutationFn: ({
      ids,
      reason,
      remarks,
    }: {
      ids: string[];
      reason: string;
      remarks: string;
    }) => gisApi.batchReject(ids, reason, remarks),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['gis-queue'] });
      queryClient.invalidateQueries({ queryKey: ['gis-history'] });
      queryClient.invalidateQueries({ queryKey: ['gis-stats'] });
      toast.success(`${vars.ids.length} parcels rejected due to boundary mismatch`);
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to reject selected parcels');
    },
  });

  return {
    batchConfirm,
    batchFlag,
    batchReject,
    isLoading: batchConfirm.isPending || batchFlag.isPending || batchReject.isPending,
  };
};
