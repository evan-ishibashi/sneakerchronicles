import React, { useState, useRef, useEffect } from 'react';
import { getSEOOptimizedImageUrl, generateImageAltText, generateImageTitle } from '../utils/imageSEO';

// Helper function to get optimized image URL (legacy support)
const getOptimizedImageUrl = (originalUrl, width = 800, quality = 80) => {
  if (!originalUrl) return originalUrl;

  // If it's a Cloudinary URL, ensure it's optimized
  if (originalUrl.includes('res.cloudinary.com')) {
    const baseUrl = originalUrl.split('/upload/')[0];
    const path = originalUrl.split('/upload/')[1];

    // Check if already optimized, if so, update the parameters
    if (originalUrl.includes('w_')) {
      // Replace existing optimization parameters
      const pathWithoutParams = path.split('/').slice(1).join('/');
      return `${baseUrl}/upload/w_${width},q_${quality},f_auto/${pathWithoutParams}`;
    } else {
      // Add optimization parameters
      return `${baseUrl}/upload/w_${width},q_${quality},f_auto/${path}`;
    }
  }

  return originalUrl;
};

// Lazy loading image component with intersection observer and WebP support
const LazyImage = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+',
  width = 800,
  quality = 80,
  onLoad,
  onClick,
  sneakerData = null, // Pass sneaker data for SEO optimization
  imageType = 'main', // Type of image for SEO context
  useSEOOptimization = false, // Flag to enable SEO optimization
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageRef, setImageRef] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    let observer;
    if (imageRef && !isInView) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observer.unobserve(imageRef);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '50px'
        }
      );
      observer.observe(imageRef);
    }
    return () => {
      if (observer && observer.unobserve) {
        observer.unobserve(imageRef);
      }
    };
  }, [imageRef, isInView]);

  useEffect(() => {
    if (isInView && src) {
      let optimizedSrc;

      if (useSEOOptimization && sneakerData) {
        // Use SEO-optimized URL with better parameters
        optimizedSrc = getSEOOptimizedImageUrl(src, width, quality);
      } else {
        // Use standard optimization
        optimizedSrc = getOptimizedImageUrl(src, width, quality);
      }

      // Add cache-busting parameter for Cloudinary URLs
      let finalSrc = optimizedSrc;
      if (optimizedSrc.includes('res.cloudinary.com')) {
        const separator = optimizedSrc.includes('?') ? '&' : '?';
        finalSrc = `${optimizedSrc}${separator}_cb=${Date.now()}`;
      }

      const img = new Image();
      img.onload = () => {
        setImageSrc(finalSrc);
        setIsLoaded(true);
        // Call the onLoad callback if provided
        if (onLoad) {
          onLoad();
        }
      };
      img.onerror = () => {
        // Fallback to original src if optimized fails
        const fallbackImg = new Image();
        fallbackImg.onload = () => {
          setImageSrc(src);
          setIsLoaded(true);
        };
        fallbackImg.onerror = () => {
          // Final fallback to placeholder
          setImageSrc(placeholder);
          setIsLoaded(false);
        };
        fallbackImg.src = src;
      };
      img.src = finalSrc;
    }
  }, [isInView, src, placeholder, width, quality, useSEOOptimization, sneakerData]);

  // Generate SEO-optimized alt text if sneaker data is provided
  const getOptimizedAlt = () => {
    if (useSEOOptimization && sneakerData) {
      return generateImageAltText(sneakerData, imageType);
    }
    return alt;
  };

  // Generate SEO-optimized title attribute
  const getOptimizedTitle = () => {
    if (useSEOOptimization && sneakerData) {
      return generateImageTitle(sneakerData, imageType);
    }
    return props.title || alt;
  };

  return (
    <img
      {...props}
      ref={setImageRef}
      src={imageSrc}
      alt={getOptimizedAlt()}
      title={getOptimizedTitle()}
      className={`${className} ${isLoaded ? 'loaded' : 'loading'}`}
      loading={props.loading || 'lazy'}
      onClick={onClick}
      style={{
        transition: 'opacity 0.3s ease-in-out',
        opacity: isLoaded ? 1 : 0.7,
        cursor: onClick ? 'pointer' : 'default',
        ...props.style
      }}
    />
  );
};

export default LazyImage;
