"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, register as registerService, logout as logoutService, getToken, getCurrentUser } from '@/lib/auth';
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

  async function checkAuth() {
    const token = getToken();
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Validate token with backend
      console.log('🔐 Validating token with /auth/me...');
      const result = await getCurrentUser();
      
      if (result.success && result.data) {
        // Update user data from backend
        const userData = result.data;
        console.log('✅ Token valid, user authenticated:', userData);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        // Token invalid or expired
        console.warn('⚠️ Token validation failed:', result.error);
        handleInvalidToken();
      }
    } catch (error) {
      console.error('❌ Error validating token:', error);
      // On network error, try to use cached user data
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          console.log('📦 Using cached user data (offline mode)');
        } catch (e) {
          handleInvalidToken();
        }
      } else {
        handleInvalidToken();
      }
    } finally {
      setLoading(false);
    }
  }

  function handleInvalidToken() {
    console.log('🚪 Invalid token detected, logging out...');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    document.cookie = 'token=; path=/; max-age=0';
    setUser(null);
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
