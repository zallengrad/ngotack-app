"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, register as registerService, logout as logoutService, getToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  function checkAuth() {
    const token = getToken();
    if (token) {
      // Get user from localStorage if available
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          // Invalid user data, clear it
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
    }
    setLoading(false);
  }

  async function login(username, password) {
    const result = await loginService(username, password);
    if (result.success) {
      // Store user data from login response
      const userData = { username, ...result.data };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    }
    return result;
  }

  async function register(username, password) {
    return await registerService(username, password);
  }

  function logout() {
    logoutService();
    setUser(null);
    router.push('/');
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
