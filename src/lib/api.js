/**
 * API Utility Functions
 * Handles all HTTP requests to the Railway backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-ai-learning-insight-production.up.railway.app';

/**
 * Generic API request wrapper with error handling
 * @param {string} endpoint - API endpoint (e.g., '/auth/login')
 * @param {object} options - Fetch options
 * @returns {Promise<object>} Response data
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  // Get token from localStorage if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Add Authorization header if token exists
  if (token && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    // Get content type
    const contentType = response.headers.get('content-type');
    
    // Try to parse as JSON, fallback to text
    let data;
    try {
      data = await response.json();
    } catch (e) {
      // If not JSON, get as text
      const text = await response.text();
      data = { message: text, error: text };
    }
    
    // Handle errors
    if (!response.ok) {
      // Special handling for rate limit
      if (response.status === 429) {
        throw new Error('Terlalu banyak percobaan login. Silakan tunggu beberapa menit dan coba lagi.');
      }
      throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
    }
    
    return data;
  } catch (error) {
    // Re-throw with more context
    throw new Error(error.message || 'Network error occurred');
  }
}

/**
 * GET request
 */
export async function apiGet(endpoint, options = {}) {
  return apiRequest(endpoint, {
    ...options,
    method: 'GET',
  });
}

/**
 * POST request
 */
export async function apiPost(endpoint, body, options = {}) {
  return apiRequest(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * PUT request
 */
export async function apiPut(endpoint, body, options = {}) {
  return apiRequest(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

/**
 * DELETE request
 */
export async function apiDelete(endpoint, options = {}) {
  return apiRequest(endpoint, {
    ...options,
    method: 'DELETE',
  });
}
