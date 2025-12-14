/**
 * ML Insights Service (Hybrid Approach)
 * Calls Next.js API route which proxies to ML service
 */

/**
 * Get ML insights by calling Next.js proxy API
 * This bypasses the backend Node.js and uses Next.js API route instead
 * 
 * @param {number} userId - User ID
 * @param {object} stats - User statistics
 * @param {object} userProfile - User profile info
 * @returns {Promise<object>} ML insights data
 */
export async function getMLInsights(userId, stats, userProfile) {
  try {
    console.log('🤖 [ML Service] Calling Next.js ML proxy...');
    
    const response = await fetch('/api/ml-insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        stats,
        userProfile
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `ML service error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ [ML Service] ML insights received:', data);
    
    return { success: true, data };
  } catch (error) {
    console.error('❌ [ML Service] Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Check ML service health
 */
export async function checkMLServiceHealth() {
  try {
    const response = await fetch('/api/ml-insights');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ [ML Service] Health check failed:', error);
    return { status: 'error', message: error.message };
  }
}
