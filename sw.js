const CACHE_NAME = 'cafe-branding-v2';
const IMAGE_CACHE_NAME = 'perkly-images-v1';
const urlsToCache = ['/', '/index.html', '/manifest.json'];

const isFirebaseStorageImageRequest = (request) => {
  if (!request || request.method !== 'GET') return false;

  const url = new URL(request.url);
  const isStorageHost = url.hostname.includes('firebasestorage.googleapis.com') || url.hostname.includes('storage.googleapis.com');
  return request.destination === 'image' && isStorageHost && url.pathname.includes('/o/');
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (isFirebaseStorageImageRequest(request)) {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME)
        .then(async (imageCache) => {
          const cachedResponse = await imageCache.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }

          try {
            const networkResponse = await fetch(request);

            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }

            try {
              await imageCache.put(request, networkResponse.clone());
            } catch (cacheError) {
              console.warn('Image cache write failed:', cacheError);
            }

            return networkResponse;
          } catch (error) {
            console.warn('Firebase Storage image request failed:', error);
            return Response.error();
          }
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(request);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME, IMAGE_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
