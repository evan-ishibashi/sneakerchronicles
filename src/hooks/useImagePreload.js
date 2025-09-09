import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Custom hook for preloading images - only on home page
export const useImagePreload = (imageUrl) => {
  const preloadRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Only preload on home page
    if (!imageUrl || typeof window === 'undefined' || location.pathname !== '/') return;

    try {
      // Create preload link immediately
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = imageUrl;

      // Store reference for cleanup
      preloadRef.current = link;

      // Add to document head
      document.head.appendChild(link);
    } catch (error) {
      console.error('useImagePreload error:', error);
    }

    // Cleanup function
    return () => {
      if (preloadRef.current && document.head.contains(preloadRef.current)) {
        document.head.removeChild(preloadRef.current);
      }
    };
  }, [imageUrl, location.pathname]);

  return preloadRef.current;
};
