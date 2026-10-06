import { useMutation, useQueryClient } from '@tanstack/react-query';
import { verifierApi } from '../api/verifierApi';
import toast from 'react-hot-toast';

interface RejectParams {
  applicationId: string;
  reason: string;
  remarks: string;
}

export const useReject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicationId, reason, remarks }: RejectParams) =>
      verifierApi.reject(applicationId, reason, remarks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verifier-queue'] });
      queryClient.invalidateQueries({ queryKey: ['verifier-application'] });
      queryClient.invalidateQueries({ queryKey: ['verifier-stats'] });
      queryClient.invalidateQueries({ queryKey: ['verifier-history'] });
      toast.error('Application has been rejected. Citizen and audit ledger notified.');
    },
    onError: () => {
      toast.error('Failed to reject application. Please try again.');
    },
  });
};
