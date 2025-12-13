/**
 * Exam API Service
 * Handles all API calls related to exams/quizzes
 */

import { apiGet, apiPost } from './api';

/**
 * Get exam questions
 * @param {number} examId - Exam ID
 * @returns {Promise<Object>} Exam data with questions
 */
export async function getExamQuestions(examId) {
  try {
    const response = await apiGet(`/exams/${examId}/start`);
    console.log('📝 Exam questions response:', response);
    
    // Unwrap nested data property if exists
    const examData = response.data || response;
    return { success: true, data: examData };
  } catch (error) {
    console.error(`Error fetching exam ${examId}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Submit exam answers
 * @param {number} examId - Exam ID
 * @param {Array} answers - Array of answers [{question_no, selected_option}]
 * @returns {Promise<Object>} Exam result with score
 */
export async function submitExamAnswers(examId, answers) {
  try {
    const response = await apiPost(`/exams/${examId}/submit`, {
      answers
    });
    console.log('✅ Exam submission response:', response);
    
    // Unwrap nested data property if exists
    const resultData = response.data || response;
    return { success: true, data: resultData };
  } catch (error) {
    console.error(`Error submitting exam ${examId}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Check if user can access exam
 * @param {number} examId - Exam ID
 * @returns {Promise<Object>} Access status
 */
export async function checkExamAccess(examId) {
  try {
    const response = await apiGet(`/exams/${examId}/access`);
    const accessData = response.data || response;
    return { success: true, data: accessData };
  } catch (error) {
    console.error(`Error checking exam access ${examId}:`, error);
    return { success: false, error: error.message };
  }
}
