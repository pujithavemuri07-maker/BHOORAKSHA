import { useMutation, useQueryClient } from '@tanstack/react-query';
import { revenueApi } from '../api/revenueApi';
import toast from 'react-hot-toast';

export const useApprove = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId, remarks }: { applicationId: string; remarks?: string }) => {
      await revenueApi.approve(applicationId, remarks);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revenueQueue'] });
      queryClient.invalidateQueries({ queryKey: ['revenueApplication'] });
      toast.success('Application approved & Mutation triggered in State Revenue Registry!');
    },
    onError: () => {
      toast.error('Failed to approve application');
    },
  });
};
