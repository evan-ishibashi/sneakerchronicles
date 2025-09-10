import React from 'react';
import { generateImageStructuredData } from '../utils/imageSEO';

// Component to add structured data for images
const ImageStructuredData = ({ sneaker, imageUrl, imageType = 'main' }) => {
  if (!sneaker || !imageUrl) return null;

  const structuredData = generateImageStructuredData(sneaker, imageUrl, imageType);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
};

export default ImageStructuredData;
