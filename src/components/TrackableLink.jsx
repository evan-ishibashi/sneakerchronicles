import React from 'react';
import { isGA4Available } from '../config/ga4';

// TrackableLink component for external link tracking with GA4
function TrackableLink({
  href,
  children,
  eventCategory = 'outbound',
  eventLabel,
  className = '',
  ...props
}) {
  const handleClick = () => {
    // Track the click event with GA4
    if (isGA4Available()) {
      window.gtag('event', 'click', {
        event_category: eventCategory,
        event_label: eventLabel || href,
        link_url: href,
      });
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
