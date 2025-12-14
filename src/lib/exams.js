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
    console.log('📝 [getExamQuestions] Fetching exam:', examId);
    
    // Get auth token and user data from localStorage
    const token = localStorage.getItem('token');
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
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Use Next.js API route with user_id query parameter
    const url = userId 
      ? `/api/exams/${examId}/start?user_id=${userId}`
      : `/api/exams/${examId}/start`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ [getExamQuestions] Response:', data);
    
    return { success: true, data: data.data };
  } catch (error) {
    console.error(`❌ [getExamQuestions] Error:`, error);
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
    console.log('📝 [submitExamAnswers] Submitting exam:', examId, 'with', answers.length, 'answers');
    
    // Get auth token and user data from localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    let userId = null;
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        // Try different possible field names
        userId = user.user_id || user.id || user.userId;
        console.log('👤 [submitExamAnswers] User data:', user);
        console.log('👤 [submitExamAnswers] User ID:', userId);
      } catch (e) {
        console.warn('⚠️ Failed to parse user data:', e);
      }
    } else {
      console.warn('⚠️ No user data in localStorage');
    }
    
    // Get start time and calculate duration
    const startTimeStr = localStorage.getItem(`exam-${examId}-start-time`);
    let startTime = null;
    let durationSeconds = null;
    
    if (startTimeStr) {
      startTime = startTimeStr;
      const start = new Date(startTimeStr);
      const end = new Date();
      durationSeconds = Math.floor((end - start) / 1000); // Convert to seconds
      console.log('⏱️ [submitExamAnswers] Duration:', durationSeconds, 'seconds');
    }
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Use Next.js API route instead of Railway backend
    const response = await fetch(`/api/exams/${examId}/submit`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        answers,
        user_id: userId, // Send user_id for database insert
        start_time: startTime, // Send start time
        duration_seconds: durationSeconds // Send duration
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ [submitExamAnswers] Response:', data);
    
    // Unwrap nested data property if exists
    const resultData = data.data || data;
    return { success: true, data: resultData };
  } catch (error) {
    console.error(`❌ [submitExamAnswers] Error submitting exam ${examId}:`, error);
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
