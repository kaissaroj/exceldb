const version = 20190227;
const cachePrefix = 'exceldb-';
const staticCacheName = `${cachePrefix}static-${version}`;
const expectedCaches = [staticCacheName];

const cacheFiles = [
    './',
    './res/bootstrap.min.css',
    'https://fonts.googleapis.com/css?family=Inconsolata',
    './files/file-spreadsheet.svg',
    './files/magic.webp'
];

addEventListener('install', event => {
    event.waitUntil((async () => {
      const cache = await caches.open(staticCacheName);
      await cache.addAll(cacheFiles);
      self.skipWaiting();
    })());
  });
  addEventListener('activate', event => {
    event.waitUntil((async () => {
      for (const cacheName of await caches.keys()) {
        if (!cacheName.startsWith(cachePrefix)) continue;
        if (!expectedCaches.includes(cacheName)) await caches.delete(cacheName);
      }
    })());
  });
  
  addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    event.respondWith(
      caches.match(event.request).then(r => r || fetch(event.request))
    );
  });