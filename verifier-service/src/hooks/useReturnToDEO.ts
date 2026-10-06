import { useMutation, useQueryClient } from '@tanstack/react-query';
import { verifierApi } from '../api/verifierApi';
import toast from 'react-hot-toast';

interface ReturnToDEOParams {
  applicationId: string;
  reason?: string;
  remarks: string;
  requiredCorrection?: string;
  requestedDoc?: string;
}

export const useReturnToDEO = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      reason = 'Correction Required',
      remarks,
      requiredCorrection,
      requestedDoc,
    }: ReturnToDEOParams) =>
      verifierApi.returnToDEO(applicationId, reason, remarks, requiredCorrection, requestedDoc),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verifier-queue'] });
      queryClient.invalidateQueries({ queryKey: ['verifier-application'] });
      queryClient.invalidateQueries({ queryKey: ['verifier-stats'] });
      queryClient.invalidateQueries({ queryKey: ['verifier-history'] });
      toast.success('Application returned to DEO for correction and re-entry.');
    },
    onError: () => {
      toast.error('Failed to return application to DEO.');
    },
  });
};
