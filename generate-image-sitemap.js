#!/usr/bin/env node

/**
 * Script to generate image sitemap for better SEO
 * Run this after adding new sneakers to update the image sitemap
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateImageSitemap, generateRobotsTxt } from './src/utils/generateImageSitemap.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, 'public');
const IMAGE_SITEMAP_PATH = path.join(PUBLIC_DIR, 'image-sitemap.xml');
const ROBOTS_TXT_PATH = path.join(PUBLIC_DIR, 'robots.txt');

function generateSitemaps() {
  try {
    // Generate image sitemap
    const imageSitemap = generateImageSitemap();
    fs.writeFileSync(IMAGE_SITEMAP_PATH, imageSitemap);
    console.log('✅ Image sitemap generated:', IMAGE_SITEMAP_PATH);

    // Generate robots.txt
    const robotsTxt = generateRobotsTxt();
    fs.writeFileSync(ROBOTS_TXT_PATH, robotsTxt);
    console.log('✅ Robots.txt updated:', ROBOTS_TXT_PATH);

    console.log('\n🎯 SEO Benefits:');
    console.log('  - Images will be better indexed by Google');
    console.log('  - Better visibility in Google Images search');
    console.log('  - Improved structured data for AI systems');
    console.log('  - Enhanced social media sharing');

  } catch (error) {
    console.error('❌ Error generating sitemaps:', error);
    process.exit(1);
  }
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSitemaps();
}

export { generateSitemaps };
