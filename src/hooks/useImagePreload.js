import React, { useEffect, useRef } from 'react';

// Custom hook for preloading images
export const useImagePreload = (imageUrl) => {
  const preloadRef = useRef(null);

  useEffect(() => {
    if (!imageUrl || typeof window === 'undefined') return;

    // Create preload link with cache-busting for Cloudinary URLs
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';

    // Add cache-busting parameter for Cloudinary URLs to ensure optimized versions are loaded
    let optimizedUrl = imageUrl;
    if (imageUrl.includes('res.cloudinary.com')) {
      const separator = imageUrl.includes('?') ? '&' : '?';
      optimizedUrl = `${imageUrl}${separator}_v=${Date.now()}&_cb=${Math.random()}`;
    }

    link.href = optimizedUrl;

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
