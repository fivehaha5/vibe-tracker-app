const SW_VERSION = '1.4.9';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const path = url.pathname;
  const bustCache = path.endsWith('/') ||
    path.endsWith('/index.html') ||
    path.endsWith('/version.json') ||
    path.endsWith('/sw.js') ||
    path.endsWith('/manifest.json');
  if (!bustCache) return;
  event.respondWith(
    fetch(new Request(req, { cache: 'no-store' })).catch(() => fetch(req))
  );
});
