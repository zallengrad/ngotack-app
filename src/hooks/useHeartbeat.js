/**
 * useHeartbeat Hook
 * Tracks active learning time with idle detection and visibility API
 */

import { useEffect, useRef, useState } from 'react';
import { sendHeartbeat } from '@/lib/tracking';

/**
 * Custom hook for tracking active learning time
 * @param {number} journeyId - Current journey ID
 * @param {number} tutorialId - Current tutorial ID
 * @param {boolean} isActive - Whether tracking should be active
 * @returns {Object} Heartbeat status and controls
 */
export function useHeartbeat(journeyId, tutorialId, isActive = true) {
  const [isTracking, setIsTracking] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);
  
  const lastActivityRef = useRef(Date.now());
  const heartbeatIntervalRef = useRef(null);
  const idleCheckIntervalRef = useRef(null);

  // Track user activity (mouse, keyboard, scroll, click)
  useEffect(() => {
    const updateActivity = () => {
      lastActivityRef.current = Date.now();
      setIsIdle(false);
    };

    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
    };
  }, []);

  // Check for idle state every 10 seconds
  useEffect(() => {
    idleCheckIntervalRef.current = setInterval(() => {
      const idleTime = Date.now() - lastActivityRef.current;
      const newIsIdle = idleTime > 60000; // 60 seconds = idle
      
      if (newIsIdle !== isIdle) {
        setIsIdle(newIsIdle);
        console.log(newIsIdle ? '😴 User is idle' : '👀 User is active');
      }
    }, 10000); // Check every 10 seconds

    return () => {
      if (idleCheckIntervalRef.current) {
        clearInterval(idleCheckIntervalRef.current);
      }
    };
  }, [isIdle]);

  // Track tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = document.visibilityState === 'visible';
      setIsTabVisible(visible);
      console.log(visible ? '👁️ Tab is visible' : '🙈 Tab is hidden');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Send heartbeat every 30 seconds
  useEffect(() => {
    // Only track if active, not idle, tab visible, and have valid IDs
    const shouldTrack = isActive && !isIdle && isTabVisible && journeyId && tutorialId;
    
    if (shouldTrack) {
      console.log('💓 Starting heartbeat tracking...');
      setIsTracking(true);

      // Send initial heartbeat immediately
      sendHeartbeat(journeyId, tutorialId);

      // Then send every 30 seconds
      heartbeatIntervalRef.current = setInterval(() => {
        console.log('💓 Sending heartbeat...', { journeyId, tutorialId });
        sendHeartbeat(journeyId, tutorialId);
      }, 30000); // 30 seconds

    } else {
      console.log('⏸️ Stopping heartbeat tracking...', {
        isActive,
        isIdle,
        isTabVisible,
        journeyId,
        tutorialId
      });
      setIsTracking(false);

      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
    }

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, [isActive, isIdle, isTabVisible, journeyId, tutorialId]);

  return {
    isTracking,
    isIdle,
    isTabVisible,
    shouldTrack: isActive && !isIdle && isTabVisible,
  };
}
