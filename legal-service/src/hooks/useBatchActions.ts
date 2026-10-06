import { useMutation, useQueryClient } from '@tanstack/react-query';
import { legalApi } from '../api/legalApi';
import toast from 'react-hot-toast';

export const useBatchActions = () => {
  const queryClient = useQueryClient();

  const batchClear = useMutation({
    mutationFn: ({ ids, opinion }: { ids: string[]; opinion: string }) =>
      legalApi.batchClear(ids, opinion),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['legal-queue'] });
      queryClient.invalidateQueries({ queryKey: ['legal-history'] });
      queryClient.invalidateQueries({ queryKey: ['legal-stats'] });
      toast.success(`${vars.ids.length} applications cleared successfully`);
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to clear selected applications');
    },
  });

  const batchFlag = useMutation({
    mutationFn: ({
      ids,
      reason,
      opinion,
    }: {
      ids: string[];
      reason: string;
      opinion: string;
    }) => legalApi.batchFlag(ids, reason, opinion),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['legal-queue'] });
      queryClient.invalidateQueries({ queryKey: ['legal-history'] });
      queryClient.invalidateQueries({ queryKey: ['legal-stats'] });
      toast.success(`${vars.ids.length} applications flagged successfully`);
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to flag selected applications');
    },
  });

  const batchBlock = useMutation({
    mutationFn: ({
      ids,
      reason,
      opinion,
      legalReferences,
    }: {
      ids: string[];
      reason: string;
      opinion: string;
      legalReferences: string[];
    }) => legalApi.batchBlock(ids, reason, opinion, legalReferences),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['legal-queue'] });
      queryClient.invalidateQueries({ queryKey: ['legal-history'] });
      queryClient.invalidateQueries({ queryKey: ['legal-stats'] });
      toast.success(`${vars.ids.length} applications blocked with statutory notice`);
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Failed to block selected applications');
    },
  });

  return {
    batchClear,
    batchFlag,
    batchBlock,
    isLoading: batchClear.isPending || batchFlag.isPending || batchBlock.isPending,
  };
};
