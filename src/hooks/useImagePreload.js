import { useEffect, useRef } from 'react';

// Custom hook for preloading images
export const useImagePreload = (imageUrl) => {
  const preloadRef = useRef(null);

  useEffect(() => {
    if (!imageUrl || typeof window === 'undefined') return;

    // Add a delay to ensure React context is stable
    const timer = setTimeout(() => {
      try {

    // Create preload link with cache-busting for Cloudinary URLs
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';

    // Use the image URL as-is to ensure preloaded image matches what's actually used
    // The component will handle its own optimization and cache-busting
    const optimizedUrl = imageUrl;

    link.href = optimizedUrl;

    // Store reference for cleanup
    preloadRef.current = link;

        // Add to document head
        document.head.appendChild(link);
      } catch (error) {
        console.error('useImagePreload error:', error);
      }
    }, 500); // Delay to ensure React context is stable

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (preloadRef.current && document.head.contains(preloadRef.current)) {
        document.head.removeChild(preloadRef.current);
      }
    };
  }, [imageUrl]);

  return preloadRef.current;
};
