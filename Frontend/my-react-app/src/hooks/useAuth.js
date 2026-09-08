import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Access the global auth state:
 *   { user, loading, login, register, logout }
 *
 * Usage: const { user, login } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used inside an <AuthProvider>');
  }
  return context;
}

export default useAuth;