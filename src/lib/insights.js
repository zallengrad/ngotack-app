/**
 * Insights API Service
 * Handles AI-generated learning insights and recommendations
 */

import { apiGet } from './api';
import { getMLInsights } from './mlService';
import { getTrackingSummary } from './tracking';

/**
 * Get AI-generated learning insights for current user (Backend Node.js)
 * @returns {Promise<Object>} Insights data with learning profile and progress summary
 */
export async function getInsights() {
  try {
    console.log('📊 Fetching AI insights from backend...');
    const response = await apiGet('/insights');
    
    console.log('✅ Insights response:', response);
    
    // Unwrap nested data property if exists
    const insightsData = response.data || response;
    
    return { success: true, data: insightsData };
  } catch (error) {
    console.error('❌ Error fetching insights from backend:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get AI-generated learning insights (Hybrid Approach)
 * Tries backend first, falls back to direct ML service call if backend fails
 * 
 * @param {number} userId - User ID (required for fallback)
 * @returns {Promise<Object>} Insights data
 */
export async function getInsightsHybrid(userId) {
  try {
    // Try backend first (with caching)
    console.log('🔄 [Hybrid] Trying backend Node.js first...');
    const backendResult = await getInsights();
    
    if (backendResult.success) {
      console.log('✅ [Hybrid] Backend succeeded!');
      return backendResult;
    }
    
    // Backend failed, try Next.js ML proxy
    console.log('⚠️ [Hybrid] Backend failed, trying Next.js ML proxy...');
    
    // Get user stats first
    const statsResult = await getTrackingSummary();
    if (!statsResult.success || !statsResult.data) {
      throw new Error('Failed to get user statistics for ML prediction');
    }
    
    const stats = statsResult.data;
    
    // Get user info from localStorage
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const user = userStr ? JSON.parse(userStr) : null;
    
    // Call ML service via Next.js proxy
    const mlResult = await getMLInsights(
      userId || user?.userId,
      {
        avg_study_duration_hours: stats.totalDurationHours || 0,
        total_tutorial_completed: stats.completed || 0,
        total_study_days: stats.totalStudyDays || 0,
        consistency_score: 0, // Calculate if available
        avg_exam_score: stats.avgExamScore || 0
      },
      {
        name: user?.username || user?.name || 'User'
      }
    );
    
    if (mlResult.success) {
      console.log('✅ [Hybrid] Next.js ML proxy succeeded!');
      
      // Transform ML response to match backend format
      const mlData = mlResult.data.data || mlResult.data;
      return {
        success: true,
        data: {
          learningProfile: {
            classification: mlData.classification,
            title: mlData.content?.title,
            message: mlData.content?.message,
            action: mlData.content?.action,
            confidence: parseFloat(mlData.meta?.ai_confidence) || 0,
            data_stability: mlData.meta?.data_stability,
            disclaimer: mlData.meta?.disclaimer,
            created_at: new Date().toISOString()
          },
          progressSummary: {
            total_tutorial_accessed: stats.completed || 0,
            completion_rate: stats.completionRate || 0,
            avg_exam_score: stats.avgExamScore || 0,
            avg_study_duration_hours: stats.totalDurationHours || 0,
            total_study_days: stats.totalStudyDays || 0
          }
        }
      };
    }
    
    throw new Error('Both backend and ML proxy failed');
    
  } catch (error) {
    console.error('❌ [Hybrid] All methods failed:', error);
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
