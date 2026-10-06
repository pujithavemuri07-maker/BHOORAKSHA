import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deoApi } from '../api/deoApi';

export const useBatchActions = () => {
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: (payload: { ids: string[]; remarks?: string }) => deoApi.batchApprove(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deo-queue'] });
      queryClient.invalidateQueries({ queryKey: ['deo-stats'] });
      queryClient.invalidateQueries({ queryKey: ['deo-history'] });
    },
  });

  const correctionMutation = useMutation({
    mutationFn: (payload: { ids: string[]; reason: string; remarks?: string }) =>
      deoApi.batchCorrection(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deo-queue'] });
      queryClient.invalidateQueries({ queryKey: ['deo-stats'] });
      queryClient.invalidateQueries({ queryKey: ['deo-history'] });
    },
  });

  return {
    batchApprove: approveMutation.mutate,
    isBatchApproving: approveMutation.isPending,
    batchCorrection: correctionMutation.mutate,
    isBatchCorrecting: correctionMutation.isPending,
  };
};
