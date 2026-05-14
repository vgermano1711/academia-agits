// ============================================================
// FIO SOB MEDIDA — Service Worker
// Offline-first strategy for PWA
// ============================================================

const CACHE_NAME = 'fio-sob-medida-v1';

const STATIC_ASSETS = [
  '/fio-sob-medida/',
  '/fio-sob-medida/index.html',
  '/fio-sob-medida/manifest.json',
  '/fio-sob-medida/css/style.css',
  '/fio-sob-medida/js/app.js',
  '/fio-sob-medida/js/chatbot.js',
  '/fio-sob-medida/js/marketplace.js',
  '/fio-sob-medida/js/dashboard.js',
  '/fio-sob-medida/js/data.js',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap',
];

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS.filter(url => !url.startsWith('https://fonts')));
    }).then(() => self.skipWaiting())
  );
});

// Activate: remove old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first for static, network-first for API
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests except fonts
  const isSameOrigin = url.origin === self.location.origin;
  const isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  const isImage = url.hostname === 'images.unsplash.com' || url.pathname.includes('dicebear');

  if (!isSameOrigin && !isFont && !isImage) return;

  // Cache-first for static assets
  if (isSameOrigin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        }).catch(() => {
          if (request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/fio-sob-medida/index.html');
          }
        });
      })
    );
    return;
  }

  // Stale-while-revalidate for external resources (fonts, images)
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(request).then((cached) => {
        const networkFetch = fetch(request).then((response) => {
          if (response.ok) cache.put(request, response.clone());
          return response;
        }).catch(() => cached);
        return cached || networkFetch;
      })
    )
  );
});
