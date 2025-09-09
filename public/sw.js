// Service Worker for Sneaker Chronicles
// NOTE: After each build, update the STATIC_ASSETS array with the new hashed filenames
const CACHE_NAME = 'sneaker-chronicles-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/robots.txt',
  '/sitemap.xml',
  '/assets/index-CKtPRkY0.js',
  '/assets/nike-tom-sachs-overshoe-sfb-sole-swapped-side-2-optimized-DLTeUcf4.jpg',
  '/assets/vendor-DEQ385Nk.js',
  '/assets/router-CimB4GcN.js',
  '/assets/index-DGT9QyHA.css',
  '/assets/nike-tom-sachs-overshoe-sfb-sole-swapped-side-2-optimized-DLTeUcf4.jpg'
];

// Function to safely cache assets with individual error handling
async function cacheAssetsSafely(cache, assets) {
  const results = await Promise.allSettled(
    assets.map(async (asset) => {
      try {
        await cache.add(asset);
        console.log(`Successfully cached: ${asset}`);
        return { asset, success: true };
      } catch (error) {
        console.warn(`Failed to cache ${asset}:`, error.message);
        return { asset, success: false, error: error.message };
      }
    })
  );

  const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
  const failed = results.length - successful;

  console.log(`Cache operation completed: ${successful} successful, ${failed} failed`);
  return results;
}

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets safely...');
        return cacheAssetsSafely(cache, STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker installation completed');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker installation failed:', error);
        // Still try to skip waiting even if caching fails
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (url.pathname.startsWith('/sneaker/')) {
    // For sneaker detail pages, try cache first, then network
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request)
            .then((response) => {
              // Cache successful responses
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  });
              }
              return response;
            })
            .catch(() => {
              // Return offline page if available
              return caches.match('/');
            });
        })
    );
  } else if (url.pathname === '/' || url.pathname.startsWith('/assets/') || url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname.endsWith('.html')) {
    // For main app and static assets (including Vite-generated assets), cache first
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request)
            .then((response) => {
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(STATIC_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  });
              }
              return response;
            })
            .catch((error) => {
              console.warn('Failed to fetch resource:', request.url, error);
              // Return a fallback response if available
              return caches.match('/');
            });
        })
    );
  } else if (url.hostname.includes('res.cloudinary.com') || url.hostname.includes('i.ebayimg.com')) {
    // For images, cache with expiration
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request)
            .then((response) => {
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  });
              }
              return response;
            });
        })
    );
  }
});

// Background sync for analytics (if needed)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    // Handle offline analytics or other background tasks
  }
});

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});
