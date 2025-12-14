/**
 * Tracking API Service
 * Handles all API calls related to learning progress tracking
 */

/**
 * Track tutorial progress (start or complete)
 * @param {number} tutorialId - Tutorial ID
 * @param {string} action - "start" or "complete"
 * @returns {Promise<Object>} Tracking result
 */
export async function trackTutorial(tutorialId, action) {
  try {
    // Get user_id from localStorage
    const userData = localStorage.getItem('user');
    let userId = null;
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        userId = user.user_id || user.id || user.userId;
      } catch (e) {
        console.warn('Failed to parse user data');
      }
    }

    // Get auth token
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Use Next.js API route
    const response = await fetch(`/api/tracking/tutorials/${tutorialId}/track`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ action, user_id: userId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Tracked tutorial ${tutorialId} as ${action}:`, data);
    
    return { success: true, data: data };
  } catch (error) {
    console.error(`Error tracking tutorial ${tutorialId}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Get tracking summary (completed and in-progress tutorials)
 * @param {string} startDate - Optional start date (YYYY-MM-DD)
 * @param {string} endDate - Optional end date (YYYY-MM-DD)
 * @returns {Promise<Object>} Summary data
 */
export async function getTrackingSummary(startDate = null, endDate = null) {
  try {
    // Get user_id from localStorage
    const userData = localStorage.getItem('user');
    let userId = null;
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        userId = user.user_id || user.id || user.userId;
      } catch (e) {
        console.warn('Failed to parse user data');
      }
    }

    // Get auth token
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Build query params
    const params = new URLSearchParams();
    if (userId) params.append('user_id', userId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    // Use Next.js API route
    const response = await fetch(`/api/tracking/summary?${params.toString()}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('📊 Tracking summary response:', data);
    
    return { success: true, data: data.data };
  } catch (error) {
    console.error('Error fetching tracking summary:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send activity heartbeat
 * @param {number} journeyId - Journey ID
 * @param {number} tutorialId - Tutorial ID
 * @returns {Promise<Object>} Heartbeat result
 */
export async function sendHeartbeat(journeyId, tutorialId) {
  try {
    // Get user_id from localStorage
    const userData = localStorage.getItem('user');
    let userId = null;
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        userId = user.user_id || user.id || user.userId;
      } catch (e) {
        console.warn('Failed to parse user data');
      }
    }

    // Get auth token
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Use Next.js API route
    const response = await fetch('/api/tracking/heartbeat', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        journeyId,
        tutorialId,
        user_id: userId
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data: data };
  } catch (error) {
    console.error('Error sending heartbeat:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get user tracking statistics
 * @returns {Promise<Object>} Statistics data
 */
export async function getTrackingStats() {
  try {
    // Use getTrackingSummary for now (same data)
    return await getTrackingSummary();
  } catch (error) {
    console.error('Error fetching tracking stats:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get user activities (paginated)
 * @param {number} limit - Number of activities to fetch
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Object>} Activities data
 */
export async function getUserActivities(limit = 5, offset = 0) {
  try {
    // Get user_id from localStorage
    const userData = localStorage.getItem('user');
    let userId = null;
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        userId = user.user_id || user.id || user.userId;
      } catch (e) {
        console.warn('Failed to parse user data');
      }
    }

    // Get auth token
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Build query params
    const params = new URLSearchParams();
    if (userId) params.append('user_id', userId);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());

    // Use Next.js API route
    const response = await fetch(`/api/tracking/activities?${params.toString()}`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('📋 User activities response:', data);
    
    return { success: true, data: data.data };
  } catch (error) {
    console.error('Error fetching user activities:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update user progress summary
 * @returns {Promise<Object>} Update result
 */
export async function updateUserSummary() {
  try {
    // Get user_id from localStorage
    const userData = localStorage.getItem('user');
    let userId = null;
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        userId = user.user_id || user.id || user.userId;
      } catch (e) {
        console.warn('Failed to parse user data');
      }
    }

    if (!userId) {
      throw new Error('User ID not found');
    }

    // Get auth token
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Call Next.js API route
    const response = await fetch('/api/tracking/update-summary', {
      method: 'POST',
      headers,
      body: JSON.stringify({ user_id: userId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('📊 User summary updated:', data);
    
    return { success: true, data: data.data };
  } catch (error) {
    console.error('Error updating user summary:', error);
    return { success: false, error: error.message };
  }
}

