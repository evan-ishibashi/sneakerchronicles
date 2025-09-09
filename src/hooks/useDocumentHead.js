import { useEffect } from 'react';

// Custom hook for managing document head (title, meta tags, etc.)
export const useDocumentHead = ({ title, description, keywords, image, url }) => {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    // Add a delay to ensure React context is stable
    const timer = setTimeout(() => {
      try {
        // Update document title
        if (title) {
          document.title = title;
        }

    // Update meta description
    if (description) {
      updateMetaTag('description', description);
      updateMetaTag('og:description', description);
      updateMetaTag('twitter:description', description);
    }

    // Update meta keywords
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }

    // Update Open Graph image
    if (image) {
      updateMetaTag('og:image', image);
      updateMetaTag('twitter:image', image);
    }

    // Update Open Graph URL
    if (url) {
      updateMetaTag('og:url', url);
    }

    // Update Open Graph title
    if (title) {
      updateMetaTag('og:title', title);
      updateMetaTag('twitter:title', title);
    }

        // Update canonical URL
        if (url) {
          updateCanonicalUrl(url);
        }
      } catch (error) {
        console.error('useDocumentHead error:', error);
      }
    }, 500); // Delay to ensure React context is stable

    return () => clearTimeout(timer);
  }, [title, description, keywords, image, url]);
};

// Helper function to update meta tags
const updateMetaTag = (property, content) => {
  // Try to find existing meta tag
  let metaTag = document.querySelector(`meta[name="${property}"]`) ||
                document.querySelector(`meta[property="${property}"]`);

  if (metaTag) {
    // Update existing tag
    metaTag.setAttribute('content', content);
  } else {
    // Create new meta tag
    metaTag = document.createElement('meta');
    if (property.startsWith('og:') || property.startsWith('twitter:')) {
      metaTag.setAttribute('property', property);
    } else {
      metaTag.setAttribute('name', property);
    }
    metaTag.setAttribute('content', content);
    document.head.appendChild(metaTag);
  }
};

// Helper function to update canonical URL
const updateCanonicalUrl = (url) => {
  let canonicalLink = document.querySelector('link[rel="canonical"]');

  if (canonicalLink) {
    canonicalLink.setAttribute('href', url);
  } else {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    canonicalLink.setAttribute('href', url);
    document.head.appendChild(canonicalLink);
  }
};
