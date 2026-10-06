import { useMutation, useQueryClient } from '@tanstack/react-query';
import { verifierApi } from '../api/verifierApi';
import toast from 'react-hot-toast';

interface ApproveParams {
  applicationId: string;
  remarks: string;
}

export const useApprove = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicationId, remarks }: ApproveParams) =>
      verifierApi.approve(applicationId, remarks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verifier-queue'] });
      queryClient.invalidateQueries({ queryKey: ['verifier-application'] });
      queryClient.invalidateQueries({ queryKey: ['verifier-stats'] });
      queryClient.invalidateQueries({ queryKey: ['verifier-history'] });
      toast.success('Application verified and approved successfully! Routed to Revenue Admin.');
    },
    onError: () => {
      toast.error('Failed to approve application. Please try again.');
    },
  });
};
