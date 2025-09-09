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
  const trackSneakerClick = (sneakerId, sneakerTitle, sneakerSlug) => {
    trackEvent('sneaker_click', {
      event_category: 'engagement',
      event_label: sneakerTitle,
      sneaker_id: sneakerId,
      sneaker_slug: sneakerSlug,
    });
  };

  // Function to track sneaker detail page views
  const trackSneakerDetailView = (sneakerId, sneakerTitle, sneakerSlug, releaseDate) => {
    trackEvent('sneaker_detail_view', {
      event_category: 'page_view',
      event_label: sneakerTitle,
      sneaker_id: sneakerId,
      sneaker_slug: sneakerSlug,
      sneaker_release_date: releaseDate,
      page_title: `${sneakerTitle} | Sneaker Chronicles`,
      page_location: window.location.href,
    });
  };

  // Function to track external link clicks
  const trackExternalLink = (url, platform, sneakerContext = null) => {
    const eventData = {
      event_category: 'outbound',
      event_label: platform,
      link_url: url,
      destination_platform: platform,
    };

    // Add sneaker context if provided
    if (sneakerContext) {
      eventData.sneaker_id = sneakerContext.sneakerId;
      eventData.sneaker_title = sneakerContext.sneakerTitle;
      eventData.sneaker_slug = sneakerContext.sneakerSlug;
    }

    trackEvent('external_link_click', eventData);
  };

  // Function to track internal navigation
  const trackInternalNavigation = (fromPage, toPage, linkText = null) => {
    trackEvent('internal_navigation', {
      event_category: 'navigation',
      event_label: linkText || toPage,
      from_page: fromPage,
      to_page: toPage,
      navigation_type: 'internal',
    });
  };

  // Function to track back button clicks
  const trackBackNavigation = (fromPage, toPage) => {
    trackEvent('back_navigation', {
      event_category: 'navigation',
      event_label: 'back_button',
      from_page: fromPage,
      to_page: toPage,
      navigation_type: 'back',
    });
  };

  // Function to track traffic source
  const trackTrafficSource = (source, medium, campaign) => {
    trackEvent('traffic_source', {
      event_category: 'acquisition',
      source: source,
      medium: medium,
      campaign: campaign || 'none',
    });
  };

  // Function to track UTM parameters
  const trackUTMParameters = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    const utmContent = urlParams.get('utm_content');
    const utmTerm = urlParams.get('utm_term');

    if (utmSource) {
      trackEvent('utm_tracking', {
        event_category: 'acquisition',
        utm_source: utmSource,
        utm_medium: utmMedium || 'none',
        utm_campaign: utmCampaign || 'none',
        utm_content: utmContent || 'none',
        utm_term: utmTerm || 'none',
      });
    }
  };

  // Track referrer information
  const trackReferrer = () => {
    const referrer = document.referrer;
    if (referrer) {
      let source = 'unknown';
      let medium = 'referral';

      // Parse common referrers
      if (referrer.includes('instagram.com')) {
        source = 'Instagram';
        medium = 'social';
      } else if (referrer.includes('youtube.com') || referrer.includes('youtu.be')) {
        source = 'YouTube';
        medium = 'social';
      } else if (referrer.includes('facebook.com')) {
        source = 'Facebook';
        medium = 'social';
      } else if (referrer.includes('twitter.com') || referrer.includes('x.com')) {
        source = 'Twitter';
        medium = 'social';
      } else if (referrer.includes('google.com')) {
        source = 'Google';
        medium = 'organic';
      } else if (referrer.includes('bing.com')) {
        source = 'Bing';
        medium = 'organic';
      } else {
        source = new URL(referrer).hostname;
      }

      trackEvent('referrer_tracking', {
        event_category: 'acquisition',
        source: source,
        medium: medium,
        referrer_url: referrer,
      });
    }
  };

  // Function to track sneaker engagement (time spent, scroll depth, etc.)
  const trackSneakerEngagement = (sneakerId, sneakerTitle, action, value = null) => {
    const eventData = {
      event_category: 'engagement',
      event_label: action,
      sneaker_id: sneakerId,
      sneaker_title: sneakerTitle,
      engagement_action: action,
    };

    if (value !== null) {
      eventData.engagement_value = value;
    }

    trackEvent('sneaker_engagement', eventData);
  };

  // Function to track image interactions
  const trackImageInteraction = (sneakerId, sneakerTitle, imageAction) => {
    trackEvent('image_interaction', {
      event_category: 'engagement',
      event_label: imageAction,
      sneaker_id: sneakerId,
      sneaker_title: sneakerTitle,
      image_action: imageAction,
    });
  };

  return {
    trackEvent,
    trackSneakerClick,
    trackSneakerDetailView,
    trackExternalLink,
    trackInternalNavigation,
    trackBackNavigation,
    trackSneakerEngagement,
    trackImageInteraction,
    trackTrafficSource,
    trackUTMParameters,
    trackReferrer,
  };
};
