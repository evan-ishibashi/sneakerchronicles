#!/usr/bin/env node

/**
 * Script to update service worker with current build assets
 * Run this after each build to ensure the service worker caches the correct files
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, 'dist');
const SW_PATH = path.join(__dirname, 'public', 'sw.js');

function getAssetsFromDist() {
  const assets = [];

  // Read index.html to find referenced assets
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    const htmlContent = fs.readFileSync(indexPath, 'utf8');

    // Extract script and link tags with assets
    const scriptRegex = /<script[^>]+src="([^"]+)"[^>]*><\/script>/g;
    const linkRegex = /<link[^>]+href="([^"]+)"[^>]*>/g;

    let match;
    while ((match = scriptRegex.exec(htmlContent)) !== null) {
      if (match[1].startsWith('/assets/')) {
        assets.push(match[1]);
      }
    }

    while ((match = linkRegex.exec(htmlContent)) !== null) {
      if (match[1].startsWith('/assets/')) {
        assets.push(match[1]);
      }
    }
  }

  // Also check for image assets in the assets directory
  const assetsDir = path.join(DIST_DIR, 'assets');
  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    files.forEach(file => {
      if (file.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        assets.push(`/assets/${file}`);
      }
    });
  }

  return assets;
}

function updateServiceWorker() {
  if (!fs.existsSync(SW_PATH)) {
    console.error('Service worker file not found:', SW_PATH);
    return;
  }

  const assets = getAssetsFromDist();
  const staticAssets = [
    '/',
    '/index.html',
    '/robots.txt',
    '/sitemap.xml',
    ...assets
  ];

  // Read current service worker
  let swContent = fs.readFileSync(SW_PATH, 'utf8');

  // Update the STATIC_ASSETS array
  const assetsArrayString = `const STATIC_ASSETS = [\n  ${staticAssets.map(asset => `'${asset}'`).join(',\n  ')}\n];`;

  const updatedContent = swContent.replace(
    /const STATIC_ASSETS = \[[\s\S]*?\];/,
    assetsArrayString
  );

  // Write updated service worker
  fs.writeFileSync(SW_PATH, updatedContent);

  console.log('✅ Service worker updated with current build assets:');
  staticAssets.forEach(asset => console.log(`  - ${asset}`));
}

if (require.main === module) {
  updateServiceWorker();
}

module.exports = { updateServiceWorker, getAssetsFromDist };
