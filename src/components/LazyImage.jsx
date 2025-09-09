import React, { useState, useRef, useEffect } from 'react';

// Helper function to get optimized image URL
const getOptimizedImageUrl = (originalUrl, width = 800, quality = 80) => {
  if (!originalUrl) return originalUrl;

  // If it's a Cloudinary URL, optimize it
  if (originalUrl.includes('res.cloudinary.com')) {
    const baseUrl = originalUrl.split('/upload/')[0];
    const path = originalUrl.split('/upload/')[1];
    return `${baseUrl}/upload/w_${width},q_${quality},f_auto/${path}`;
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
      const optimizedSrc = getOptimizedImageUrl(src, width, quality);
      const img = new Image();
      img.onload = () => {
        setImageSrc(optimizedSrc);
        setIsLoaded(true);
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
      img.src = optimizedSrc;
    }
  }, [isInView, src, placeholder, width, quality]);

  return (
    <img
      {...props}
      ref={setImageRef}
      src={imageSrc}
      alt={alt}
      className={`${className} ${isLoaded ? 'loaded' : 'loading'}`}
      loading={props.loading || 'lazy'}
      style={{
        transition: 'opacity 0.3s ease-in-out',
        opacity: isLoaded ? 1 : 0.7,
        ...props.style
      }}
    />
  );
};

export default LazyImage;
