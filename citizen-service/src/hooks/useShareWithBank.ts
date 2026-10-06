import { useMutation } from '@tanstack/react-query';
import { citizenApi } from '../api/citizenApi';
import { ShareWithBankPayload } from '../api/types';

export const useShareWithBank = () => {
  return useMutation({
    mutationFn: async (payload: ShareWithBankPayload) => {
      return citizenApi.shareWithBank(payload);
    },
  });
};
