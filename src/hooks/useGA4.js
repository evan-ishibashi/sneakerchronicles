import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getMeasurementId, isGA4Available } from '../config/ga4';

// Custom hook for GA4 tracking
export const useGA4 = () => {
  const location = useLocation();

  // Track page views on route changes
  useEffect(() => {
    if (isGA4Available()) {
      window.gtag('config', getMeasurementId(), {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  // Function to track custom events
  const trackEvent = (eventName, parameters = {}) => {
    if (isGA4Available()) {
      window.gtag('event', eventName, parameters);
    }
  };

  // Function to track sneaker card clicks
  const trackSneakerClick = (sneakerId, sneakerTitle) => {
    trackEvent('sneaker_click', {
      event_category: 'engagement',
      event_label: sneakerTitle,
      sneaker_id: sneakerId,
    });
  };

  // Function to track external link clicks
  const trackExternalLink = (url, platform) => {
    trackEvent('external_link_click', {
      event_category: 'outbound',
      event_label: platform,
      link_url: url,
    });
  };

  return {
    trackEvent,
    trackSneakerClick,
    trackExternalLink,
  };
};
