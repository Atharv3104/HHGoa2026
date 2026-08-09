/**
 * FrameInGoa - Service Worker for PWA Offline Support & Vercel Compatibility
 */

const CACHE_NAME = 'frameingoa-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/styles.css',
  './js/config.js',
  './js/utils/heicConverter.js',
  './js/utils/qrCodeGenerator.js',
  './js/engines/faceDetectionEngine.js',
  './js/engines/ruleEngine.js',
  './js/engines/canvasEngine.js',
  './js/views/landingView.js',
  './js/views/generatorView.js',
  './js/app.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        ASSETS_TO_CACHE.map(url => cache.add(url).catch(e => console.log('SW cache skip:', url)))
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
