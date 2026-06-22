const CACHE_NAME = 'despesas-pwa-v1';
const STATIC_ASSETS = [
  './index.html',
  './style.css',
  './app.js',
  './Icone.png',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js'
];

// Instalação do Service Worker e cache dos recursos estáticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching estáticos...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Ativação do Service Worker e limpeza de caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Limpando cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercepção de requisições de rede
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // Ignorar requisições POST ou requisições para a API do Google Sheets (script.google.com)
  if (event.request.method !== 'GET' || requestUrl.hostname.includes('script.google.com')) {
    return;
  }

  // Estratégia Stale-While-Revalidate para recursos locais e CDNs
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(err => {
        console.log('Fetch falhou (offline), servindo do cache se disponível.');
      });

      return cachedResponse || fetchPromise;
    })
  );
});
