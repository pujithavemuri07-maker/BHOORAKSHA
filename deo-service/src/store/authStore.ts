import { useAuthStore as useSharedAuthStore } from '@shared/store/authStore';
import { UserResponse } from '@shared/types/user';

export type User = UserResponse;

export const useAuthStore: any = () => {
  const store = useSharedAuthStore();

  return {
    user: store.user,
    token: store.token,
    refreshToken: store.refreshToken,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    login: (userOrCredentials: any, token?: string) => {
      if (typeof userOrCredentials === 'object' && token) {
        store.setSession({
          access_token: token,
          refresh_token: token,
          token_type: 'bearer',
          expires_in: 86400,
          user: userOrCredentials,
        });
      } else if (userOrCredentials?.email && userOrCredentials?.password) {
        return store.login(userOrCredentials);
      }
    },
    loginWithCredentials: store.login,
    loginWithOtp: store.loginWithOtp,
    logout: store.logout,
    updateProfile: store.updateUser,
    updateUser: store.updateUser,
    initializeAuth: store.initializeAuth,
    clearError: store.clearError,
  };
};

useAuthStore.getState = () => {
  const store = useSharedAuthStore.getState();
  return {
    user: store.user,
    token: store.token,
    refreshToken: store.refreshToken,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    login: store.login,
    loginWithCredentials: store.login,
    loginWithOtp: store.loginWithOtp,
    logout: store.logout,
    updateProfile: store.updateUser,
    updateUser: store.updateUser,
    initializeAuth: store.initializeAuth,
    clearError: store.clearError,
  };
};

export { useSharedAuthStore };
export default useAuthStore;
