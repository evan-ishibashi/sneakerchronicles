import { useEffect, useRef } from 'react';

// Custom hook to track route changes without interfering with React Router
export const useRouteTracker = (callback) => {
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    let currentPath = window.location.pathname + window.location.search;

    const checkForRouteChange = () => {
      const newPath = window.location.pathname + window.location.search;
      if (newPath !== currentPath) {
        currentPath = newPath;
        // Call the callback with a delay to ensure React Router has finished updating
        setTimeout(() => {
          if (callbackRef.current) {
            callbackRef.current();
          }
        }, 100);
      }
    };

    // Check for route changes periodically
    const interval = setInterval(checkForRouteChange, 100);

    // Also listen for popstate events
    window.addEventListener('popstate', checkForRouteChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('popstate', checkForRouteChange);
    };
  }, []);
};
