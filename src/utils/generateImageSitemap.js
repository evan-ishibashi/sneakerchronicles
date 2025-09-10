// Generate image sitemap for better SEO
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load sneaker data from JSON file
const sneakerDataPath = path.join(__dirname, '../data/sneakerData.json');
const sneakerData = JSON.parse(fs.readFileSync(sneakerDataPath, 'utf8'));

export const generateImageSitemap = () => {
  const baseUrl = 'https://sneakerchronicles.com';
  const images = [];

  // Add main sneaker images
  Object.values(sneakerData).forEach(sneaker => {
    if (sneaker.image) {
      images.push({
        loc: `${baseUrl}/sneaker/${sneaker.slug}`,
        image: {
          loc: sneaker.image,
          title: sneaker.title,
          caption: `Discover the story behind ${sneaker.title} - rare sneaker analysis and history`,
          geo_location: 'United States',
          license: `${baseUrl}/terms`
        }
      });
    }
  });

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${images.map(item => `  <url>
    <loc>${item.loc}</loc>
    <image:image>
      <image:loc>${item.image.loc}</image:loc>
      <image:title>${item.image.title}</image:title>
      <image:caption>${item.image.caption}</image:caption>
      <image:geo_location>${item.image.geo_location}</image:geo_location>
      <image:license>${item.image.license}</image:license>
    </image:image>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

// Generate robots.txt with image sitemap reference
export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /

# Image sitemap
Sitemap: https://sneakerchronicles.com/sitemap.xml
Sitemap: https://sneakerchronicles.com/image-sitemap.xml

# Crawl-delay for image-heavy content
Crawl-delay: 1`;
};
