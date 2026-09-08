import { useCallback, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/authApi';
import { UNAUTHORIZED_EVENT } from '../api/apiClient';
import { AuthContext } from './AuthContext';

/**
 * Normalize the /user/ response into the app-wide user object.
 * `_id` is required for owner checks (project cards / details pages);
 * some backends return `id` instead, so accept both.
 */
function toUser(data) {
  return {
    _id: data._id ?? data.id ?? null,
    name: data.name,
    email: data.email,
    picture: data.picture,
  };
}


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking the session

  // Ask the backend for the current user once on mount.
  useEffect(() => {
    let cancelled = false;

    authApi
      .getMe()
      .then((data) => {
        if (!cancelled) setUser(toUser(data));
      })
      .catch(() => {
        // 401 (or any error) simply means "not logged in".
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // When any API call returns 401 (expired cookie mid-session),
  // drop the user so protected routes redirect to /login.
  useEffect(() => {
    const handleUnauthorized = () => setUser(null);
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  const login = useCallback(async (credentials) => {
    await authApi.login(credentials);
    // The login response does not include user data — fetch it.
    const data = await authApi.getMe();
    setUser(toUser(data));
  }, []);

  const register = useCallback(async (details) => {
    await authApi.register(details);
    // The backend does not log you in on registration (no cookie is set),
    // so the caller redirects to /login afterwards.
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}