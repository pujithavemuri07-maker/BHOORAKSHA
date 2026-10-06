import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, isAuthenticated, login, logout, updateUser } = useAuthStore();
  return {
    user,
    isAuthenticated,
    login,
    logout,
    updateUser,
  };
};
