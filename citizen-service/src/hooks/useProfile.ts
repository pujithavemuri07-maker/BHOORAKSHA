import { useMutation } from '@tanstack/react-query';
import { citizenApi } from '../api/citizenApi';
import { User } from '../api/types';

export const useProfile = () => {
  return useMutation({
    mutationFn: async (updatedData: Partial<User>) => {
      return citizenApi.updateProfile(updatedData);
    },
  });
};
