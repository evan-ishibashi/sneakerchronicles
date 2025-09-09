import React from 'react';
import { isGA4Available } from '../config/ga4';

// TrackableLink component for external link tracking with GA4
function TrackableLink({
  href,
  children,
  eventCategory = 'outbound',
  eventLabel,
  className = '',
  sneakerContext = null,
  ...props
}) {
  const handleClick = () => {
    // Track the click event with GA4
    if (isGA4Available()) {
      const eventData = {
        event_category: eventCategory,
        event_label: eventLabel || href,
        link_url: href,
        destination_platform: eventLabel,
      };

      // Add sneaker context if provided
      if (sneakerContext) {
        eventData.sneaker_id = sneakerContext.sneakerId;
        eventData.sneaker_title = sneakerContext.sneakerTitle;
        eventData.sneaker_slug = sneakerContext.sneakerSlug;
      }

      window.gtag('event', 'external_link_click', eventData);
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </a>
  );
}

export default TrackableLink;
