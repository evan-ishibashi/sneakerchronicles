// Image SEO utilities for better search engine optimization
export const generateImageAltText = (sneaker, imageType = 'main') => {
  const { title, description } = sneaker;

  // Base keywords for sneaker SEO
  const baseKeywords = [
    'sneaker',
    'shoes',
    'footwear',
    'rare sneakers',
    'limited edition',
    'sneaker culture'
  ];

  // Specific keywords based on sneaker title
  const titleKeywords = title.toLowerCase()
    .split(' ')
    .filter(word => word.length > 2)
    .slice(0, 4); // Take first 4 meaningful words

  // Image type specific descriptions
  const imageTypeDescriptions = {
    main: 'detailed view of',
    side: 'side profile of',
    detail: 'close-up detail of',
    box: 'original packaging of',
    comparison: 'comparison view of',
    collection: 'collection featuring'
  };

  // Combine all keywords
  const allKeywords = [...titleKeywords, ...baseKeywords];
  const uniqueKeywords = [...new Set(allKeywords)].slice(0, 6); // Limit to 6 keywords

  const imageDescription = imageTypeDescriptions[imageType] || 'image of';

  return `${imageDescription} ${title} - ${uniqueKeywords.join(', ')} - Sneaker Chronicles`;
};

export const generateImageTitle = (sneaker, imageType = 'main') => {
  return `${sneaker.title} - ${imageType} view | Sneaker Chronicles`;
};

export const generateImageCaption = (sneaker, imageType = 'main') => {
  const captions = {
    main: `Discover the story behind ${sneaker.title}`,
    side: `Side profile showcasing the unique design of ${sneaker.title}`,
    detail: `Intricate details and craftsmanship of ${sneaker.title}`,
    box: `Original packaging and presentation of ${sneaker.title}`,
    comparison: `Size and style comparison of ${sneaker.title}`,
    collection: `Part of our curated collection featuring ${sneaker.title}`
  };

  return captions[imageType] || `Explore ${sneaker.title} on Sneaker Chronicles`;
};

// Generate structured data for images
export const generateImageStructuredData = (sneaker, imageUrl, imageType = 'main') => {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "name": generateImageTitle(sneaker, imageType),
    "description": generateImageAltText(sneaker, imageType),
    "url": imageUrl,
    "thumbnailUrl": imageUrl,
    "contentUrl": imageUrl,
    "caption": generateImageCaption(sneaker, imageType),
    "keywords": generateImageAltText(sneaker, imageType).split(' - ')[1]?.split(', ') || [],
    "creator": {
      "@type": "Organization",
      "name": "Sneaker Chronicles",
      "url": "https://sneakerchronicles.com"
    },
    "copyrightHolder": {
      "@type": "Organization",
      "name": "Sneaker Chronicles"
    },
    "license": "https://sneakerchronicles.com/terms",
    "isPartOf": {
      "@type": "Article",
      "name": sneaker.title,
      "url": `https://sneakerchronicles.com/sneaker/${sneaker.slug}`
    }
  };
};

// Generate Open Graph image data
export const generateOpenGraphImageData = (sneaker, imageUrl) => {
  return {
    'og:image': imageUrl,
    'og:image:alt': generateImageAltText(sneaker, 'main'),
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:type': 'image/jpeg',
    'og:image:secure_url': imageUrl
  };
};

// Generate Twitter Card image data
export const generateTwitterImageData = (sneaker, imageUrl) => {
  return {
    'twitter:image': imageUrl,
    'twitter:image:alt': generateImageAltText(sneaker, 'main'),
    'twitter:card': 'summary_large_image'
  };
};

// SEO-optimized filename generator
export const generateSEOFileName = (sneaker, imageType = 'main') => {
  const cleanTitle = sneaker.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();

  const typePrefix = {
    main: 'hero',
    side: 'side-view',
    detail: 'detail',
    box: 'packaging',
    comparison: 'comparison',
    collection: 'collection'
  };

  return `${typePrefix[imageType] || 'image'}-${cleanTitle}-sneaker-chronicles`;
};

// Cloudinary optimization with SEO-friendly parameters
export const getSEOOptimizedImageUrl = (originalUrl, width = 1200, quality = 85, format = 'auto') => {
  if (!originalUrl || !originalUrl.includes('res.cloudinary.com')) {
    return originalUrl;
  }

  const baseUrl = originalUrl.split('/upload/')[0];
  const path = originalUrl.split('/upload/')[1];

  // SEO-optimized Cloudinary parameters
  const params = [
    `w_${width}`,
    `q_${quality}`,
    `f_${format}`,
    'fl_progressive', // Progressive JPEG for better loading
    'fl_immutable_cache', // Better caching
    'fl_auto_optimize', // Auto optimization
    'fl_lossy' // Lossy compression for smaller files
  ].join(',');

  return `${baseUrl}/upload/${params}/${path}`;
};
