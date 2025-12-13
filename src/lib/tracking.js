/**
 * Tracking API Service
 * Handles all API calls related to learning progress tracking
 */

import { apiGet, apiPost } from './api';

/**
 * Track tutorial progress (start or complete)
 * @param {number} tutorialId - Tutorial ID
 * @param {string} action - "start" or "complete"
 * @returns {Promise<Object>} Tracking result
 */
export async function trackTutorial(tutorialId, action) {
  try {
    const response = await apiPost(`/tracking/tutorials/${tutorialId}/track`, {
      action
    });
    
    console.log(`✅ Tracked tutorial ${tutorialId} as ${action}:`, response);
    return { success: true, data: response };
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
    let endpoint = '/tracking/summary';
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    
    const response = await apiGet(endpoint);
    console.log('📊 Tracking summary response:', response);
    
    // Unwrap nested data property
    const summaryData = response.data || response;
    return { success: true, data: summaryData };
  } catch (error) {
    console.error('Error fetching tracking summary:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get user tracking statistics
 * @returns {Promise<Object>} Statistics data
 */
export async function getTrackingStats() {
  try {
    const response = await apiGet('/tracking/stats');
    console.log('📈 Tracking stats:', response);
    return { success: true, data: response };
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
    const response = await apiGet(`/tracking/activities?limit=${limit}&offset=${offset}`);
    console.log('📋 User activities response:', response);
    
    // Unwrap nested data property
    const activitiesData = response.data || response;
    return { success: true, data: activitiesData };
  } catch (error) {
    console.error('Error fetching user activities:', error);
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
    const response = await apiPost('/tracking/heartbeat', {
      journeyId,
      tutorialId
    });
    return { success: true, data: response };
  } catch (error) {
    console.error('Error sending heartbeat:', error);
    return { success: false, error: error.message };
  }
}
