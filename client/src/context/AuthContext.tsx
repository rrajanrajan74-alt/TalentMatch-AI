import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginAsDemo: () => Promise<void>;
  register: (name: string, email: string, pass: string, company?: string) => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('tm_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const res = await api.getMe();
          setUser(res.user);
          localStorage.setItem('tm_user', JSON.stringify(res.user));
        } catch (err) {
          console.warn('Session expired or invalid token:', err);
          logout();
        }
      } else {
        // Clear ghost user profile if no valid token
        setUser(null);
        localStorage.removeItem('tm_token');
        localStorage.removeItem('tm_user');
      }
      setIsLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, pass);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('tm_token', res.token);
      localStorage.setItem('tm_user', JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemo = async () => {
    await login('recruiter@talentmatch.ai', 'password123');
  };

  const register = async (name: string, email: string, pass: string, company?: string) => {
    setIsLoading(true);
    try {
      const res = await api.register(name, email, pass, company);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('tm_token', res.token);
      localStorage.setItem('tm_user', JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (!user) return;
    const merged = { ...user, ...updatedUser };
    setUser(merged);
    localStorage.setItem('tm_user', JSON.stringify(merged));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('tm_token');
    localStorage.removeItem('tm_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isLoading,
        login,
        loginAsDemo,
        register,
        updateUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
