import { useEffect } from 'react';

// Custom hook to register service worker
export const useServiceWorker = () => {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    // Add a delay to ensure React context is stable
    const timer = setTimeout(() => {
      try {
        if ('serviceWorker' in navigator) {
          const registerSW = async () => {
            try {
              const registration = await navigator.serviceWorker.register('/sw.js');
              console.log('Service Worker registered successfully:', registration);

              // Handle updates
              registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (newWorker) {
                  newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                      // New content is available, prompt user to refresh
                      if (window.confirm('New content is available! Refresh to update?')) {
                        window.location.reload();
                      }
                    }
                  });
                }
              });
            } catch (error) {
              console.error('Service Worker registration failed:', error);
            }
          };

          registerSW();
        }
      } catch (error) {
        console.error('Service Worker hook error:', error);
      }
    }, 1000); // Increased delay to ensure React context is stable

    return () => clearTimeout(timer);
  }, []);
};
