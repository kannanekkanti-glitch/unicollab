import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, College } from '../types';
import { api, setAuthToken, clearAuthToken, getAuthToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  colleges: College[];
  loading: boolean;
  login: (credentials: { email_or_username: string; password: string }) => Promise<void>;
  register: (data: any) => Promise<{ access_token: string; user: User }>;
  verifyOtp: (email: string, code: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  demoLogin: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchColleges = async () => {
    try {
      const data = await api.getColleges();
      setColleges(data);
    } catch (err) {
      console.error('Failed to load colleges', err);
    }
  };

  const refreshUser = async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const userData = await api.getMe();
      setUser(userData);
    } catch (err) {
      console.error('Failed to fetch user profile', err);
      clearAuthToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
    refreshUser();
  }, []);

  const login = async (credentials: { email_or_username: string; password: string }) => {
    const res = await api.login(credentials);
    setAuthToken(res.access_token);
    setUser(res.user);
  };

  const register = async (data: any) => {
    const res = await api.register(data);
    setAuthToken(res.access_token);
    setUser(res.user);
    return res;
  };

  const verifyOtp = async (email: string, code: string) => {
    const res = await api.verifyOtp(email, code);
    setAuthToken(res.access_token);
    setUser(res.user);
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
  };

  const demoLogin = async (email: string) => {
    let password = 'Pass@123';
    if (email === 'admin@unicollab.edu') password = 'Admin@123';
    await login({ email_or_username: email, password });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        colleges,
        loading,
        login,
        register,
        verifyOtp,
        logout,
        refreshUser,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
