/**
 * Insights API Service
 * Handles AI-generated learning insights and recommendations
 */

import { apiGet } from './api';

/**
 * Get AI-generated learning insights for current user
 * @returns {Promise<Object>} Insights data with learning profile and progress summary
 */
export async function getInsights() {
  try {
    console.log('📊 Fetching AI insights...');
    const response = await apiGet('/insights');
    
    console.log('✅ Insights response:', response);
    
    // Unwrap nested data property if exists
    const insightsData = response.data || response;
    
    return { success: true, data: insightsData };
  } catch (error) {
    console.error('❌ Error fetching insights:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Check if insights data is fresh (created today)
 * @param {string} createdAt - ISO timestamp of when insights were created
 * @returns {boolean} True if insights are from today
 */
export function isInsightsFresh(createdAt) {
  if (!createdAt) return false;
  
  const insightsDate = new Date(createdAt);
  const today = new Date();
  
  return (
    insightsDate.getDate() === today.getDate() &&
    insightsDate.getMonth() === today.getMonth() &&
    insightsDate.getFullYear() === today.getFullYear()
  );
}

/**
 * Format confidence score for display
 * @param {number} confidence - Confidence score (0-100)
 * @returns {string} Formatted confidence with label
 */
export function formatConfidence(confidence) {
  if (confidence >= 90) return { label: 'Sangat Tinggi', color: 'green' };
  if (confidence >= 70) return { label: 'Tinggi', color: 'blue' };
  if (confidence >= 50) return { label: 'Sedang', color: 'yellow' };
  return { label: 'Rendah', color: 'red' };
}
