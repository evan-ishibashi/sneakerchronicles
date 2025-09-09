import { useEffect, useCallback } from 'react'
import { useRouteTracker } from '../hooks/useRouteTracker'

// Component to scroll to top on route change
function ScrollToTop() {
  const scrollToTop = useCallback(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll to top on initial load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const timer = setTimeout(scrollToTop, 200);
    return () => clearTimeout(timer);
  }, [scrollToTop]);

  // Scroll to top on route changes
  useRouteTracker(scrollToTop);

  return null
}

export default ScrollToTop
