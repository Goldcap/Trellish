import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem('dasboot_token'));

  const login = useCallback(async (password) => {
    const { data } = await api.post('/auth/login', { password });
    sessionStorage.setItem('dasboot_token', data.token);
    setToken(data.token);
    return data;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('dasboot_token');
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
