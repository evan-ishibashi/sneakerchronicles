import { useEffect, useRef } from 'react';

// Custom hook for preloading images
export const useImagePreload = (imageUrl) => {
  const preloadRef = useRef(null);

  useEffect(() => {
    if (!imageUrl || typeof window === 'undefined') return;

    // Create preload link
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = imageUrl;

    // Store reference for cleanup
    preloadRef.current = link;

    // Add to document head
    document.head.appendChild(link);

    // Cleanup function
    return () => {
      if (preloadRef.current && document.head.contains(preloadRef.current)) {
        document.head.removeChild(preloadRef.current);
      }
    };
  }, [imageUrl]);

  return preloadRef.current;
};
