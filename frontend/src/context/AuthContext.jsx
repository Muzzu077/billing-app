import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('auth_token') || '');
  const [admin, setAdmin] = useState(() => {
    const raw = localStorage.getItem('auth_admin');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem('auth_token', token); else localStorage.removeItem('auth_token');
  }, [token]);

  useEffect(() => {
    if (admin) localStorage.setItem('auth_admin', JSON.stringify(admin)); else localStorage.removeItem('auth_admin');
  }, [admin]);

  const value = useMemo(() => ({ token, setToken, admin, setAdmin, isAuthenticated: !!token }), [token, admin]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);


