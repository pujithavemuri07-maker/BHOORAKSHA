import { useMutation, useQueryClient } from '@tanstack/react-query';
import { revenueApi } from '../api/revenueApi';
import toast from 'react-hot-toast';

export const useReject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      applicationId,
      reason,
      remarks,
    }: {
      applicationId: string;
      reason: string;
      remarks: string;
    }) => {
      await revenueApi.reject(applicationId, reason, remarks);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revenueQueue'] });
      queryClient.invalidateQueries({ queryKey: ['revenueApplication'] });
      toast.success('Final administrative rejection order issued.');
    },
    onError: () => {
      toast.error('Failed to record rejection order');
    },
  });
};
