/**
 * Journeys API Service
 * Handles all API calls related to learning journeys and tutorials
 */

import { apiGet } from './api';

/**
 * Get all available journeys
 * @returns {Promise<Array>} List of journeys
 */
export async function getAllJourneys() {
  try {
    const response = await apiGet('/journeys');
    console.log('📦 Journeys API Response:', response);
    
    // Handle wrapped response (e.g. { status: 'success', data: [...] })
    const journeys = Array.isArray(response) ? response : (response.data || []);
    
    return { success: true, data: journeys };
  } catch (error) {
    console.error('Error fetching journeys:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get journey detail with tutorials
 * @param {number} journeyId - Journey ID
 * @returns {Promise<Object>} Journey detail with tutorials
 */
export async function getJourneyDetail(journeyId) {
  try {
    const response = await apiGet(`/journeys/${journeyId}`);
    // Handle wrapped response
    const journey = response.data || response;
    return { success: true, data: journey };
  } catch (error) {
    console.error(`Error fetching journey ${journeyId}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Get tutorial content
 * @param {number} tutorialId - Tutorial ID
 * @returns {Promise<Object>} Tutorial content
 */
export async function getTutorialContent(tutorialId) {
  try {
    const response = await apiGet(`/journeys/tutorials/${tutorialId}`);
    // Handle wrapped response
    const tutorial = response.data || response;
    return { success: true, data: tutorial };
  } catch (error) {
    console.error(`Error fetching tutorial ${tutorialId}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Helper function to get module count for a journey
 * @param {number} journeyId - Journey ID
 * @returns {Promise<number>} Number of tutorials/modules
 */
export async function getJourneyModuleCount(journeyId) {
  const result = await getJourneyDetail(journeyId);
  if (result.success && result.data.tutorial) {
    return result.data.tutorial.length;
  }
  return 0;
}
