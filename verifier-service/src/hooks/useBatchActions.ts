import { useMutation, useQueryClient } from '@tanstack/react-query';
import { verifierApi } from '../api/verifierApi';
import toast from 'react-hot-toast';

interface BatchApproveParams {
  ids: string[];
  remarks: string;
}

interface BatchRejectParams {
  ids: string[];
  reason: string;
  remarks: string;
}

export const useBatchActions = () => {
  const queryClient = useQueryClient();

  const batchApproveMutation = useMutation({
    mutationFn: ({ ids, remarks }: BatchApproveParams) =>
      verifierApi.batchApprove(ids, remarks),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['verifier-queue'] });
      queryClient.invalidateQueries({ queryKey: ['verifier-stats'] });
      queryClient.invalidateQueries({ queryKey: ['verifier-history'] });
      toast.success(`${variables.ids.length} applications batch approved successfully!`);
    },
    onError: () => {
      toast.error('Failed to batch approve applications.');
    },
  });

  const batchRejectMutation = useMutation({
    mutationFn: ({ ids, reason, remarks }: BatchRejectParams) =>
      verifierApi.batchReject(ids, reason, remarks),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['verifier-queue'] });
      queryClient.invalidateQueries({ queryKey: ['verifier-stats'] });
      queryClient.invalidateQueries({ queryKey: ['verifier-history'] });
      toast.error(`${variables.ids.length} applications batch rejected.`);
    },
    onError: () => {
      toast.error('Failed to batch reject applications.');
    },
  });

  return {
    batchApprove: batchApproveMutation.mutate,
    isBatchApproving: batchApproveMutation.isPending,
    batchReject: batchRejectMutation.mutate,
    isBatchRejecting: batchRejectMutation.isPending,
  };
};
