/**
 * Authentication Service
 * Handles user authentication operations with Railway backend
 */

import { apiPost } from './api';

/**
 * Register a new user
 * @param {string} username - Username
 * @param {string} password - Password (must contain uppercase, lowercase, and numbers)
 * @returns {Promise<object>} Registration response
 */
export async function register(username, password) {
  try {
    const response = await apiPost('/auth/register', {
      username,
      password,
    }, { skipAuth: true });
    
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Login user and store JWT token
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<object>} Login response with token
 */
export async function login(username, password) {
  try {
    console.log("🌐 Calling backend API /auth/login...");
    const response = await apiPost('/auth/login', {
      username,
      password,
    }, { skipAuth: true });
    
    console.log("📦 Backend response:", response);
    
    // Extract token from response (handle both formats)
    const token = response.token || response.data?.token;
    const userId = response.user_id || response.data?.user_id;
    
    // Store token in localStorage and cookies
    if (token) {
      console.log("💾 Storing token:", token.substring(0, 20) + "...");
      localStorage.setItem('token', token);
      // Store in cookie for middleware access (expires in 7 days)
      document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      console.log("✅ Token stored successfully");
    } else {
      console.warn("⚠️ No token in response:", response);
    }
    
    return { success: true, data: { token, userId, ...response } };
  } catch (error) {
    console.error("❌ Login error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Logout user and clear session
 */
export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Remove cookie
    document.cookie = 'token=; path=/; max-age=0';
  }
}

/**
 * Get current user profile
 * @returns {Promise<object>} User profile data
 */
export async function getCurrentUser() {
  try {
    const response = await apiPost('/auth/me');
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get stored JWT token
 * @returns {string|null} JWT token
 */
export function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if token exists
 */
export function isAuthenticated() {
  return !!getToken();
}

/**
 * Validate password requirements
 * @param {string} password - Password to validate
 * @returns {object} Validation result
 */
export function validatePassword(password) {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isLongEnough = password.length >= 8;
  
  const isValid = hasUppercase && hasLowercase && hasNumber && isLongEnough;
  
  return {
    isValid,
    errors: {
      uppercase: !hasUppercase,
      lowercase: !hasLowercase,
      number: !hasNumber,
      length: !isLongEnough,
    },
  };
}
