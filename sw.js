const CACHE_NAME = 'ab-hosq-v1';

const CORE_ASSETS = [
  './',
  './index.html',
  './style.css',
  './stars.js',
  './math-bg.js',
  './nature-bg.js',
  './python-bg.js',
  './file-viewer.js',
  './Class10.html',
  './Class10-AB.html',
  './Class10-Hanrahashiv.html',
  './Class10-Python.html',
  './Class11.html',
  './Class11-AB.html',
  './Class11-Hanrahashiv.html',
  './Class11-Python.html',
  './Class12.html',
  './Class12-AB.html',
  './Class12-Hanrahashiv.html',
  './Class12-Python.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(CORE_ASSETS).catch(() => {
        // if any single asset 404s, cache the rest individually instead of failing install
        return Promise.all(
          CORE_ASSETS.map((url) => cache.add(url).catch(() => {}))
        );
      })
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Only handle the app shell (html/css/js/icons) offline.
// Big study materials (pdf/pptx/docx) are left to the network / file-viewer.js as-is.
const SHELL_EXTENSIONS = ['.html', '.css', '.js', '.json', '.png', '.ico'];

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isShellAsset =
    url.origin === self.location.origin &&
    SHELL_EXTENSIONS.some((ext) => url.pathname.endsWith(ext));

  if (!isShellAsset) return; // let the browser handle materials normally

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    })
  );
});
