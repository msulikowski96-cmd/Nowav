const CACHE_NAME = 'cv-optimizer-v3';
const urlsToCache = [
    '/',
    '/static/css/custom.css',
    '/static/css/modern-premium.css', 
    '/static/js/main.js',
    '/static/icons/icon-192x192.png',
    '/static/icons/icon-512x512.png',
    '/static/icons/upload-96x96.png',
    '/static/icons/premium-96x96.png',
    '/manifest.json'
];

self.addEventListener('install', function(event) {
    console.log('SW installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('SW caching files');
                return cache.addAll(urlsToCache);
            })
            .catch(function(error) {
                console.log('SW install failed:', error);
            })
    );
});

self.addEventListener('fetch', function(event) {
    // Only handle GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
            .catch(function(error) {
                console.log('SW fetch failed:', error);
                // Provide offline fallback
                if (event.request.destination === 'document') {
                    return caches.match('/');
                }
                return new Response('Offline - sprawdź połączenie internetowe', {
                    status: 503,
                    statusText: 'Service Unavailable'
                });
            })
    );
});

self.addEventListener('activate', function(event) {
    console.log('SW activated');
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('SW deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Background Sync
self.addEventListener('sync', function(event) {
    if (event.tag === 'cv-upload-sync') {
        console.log('SW: Background sync - CV upload');
        event.waitUntil(
            // Handle background CV upload sync
            Promise.resolve()
        );
    }
});

// Push Notifications
self.addEventListener('push', function(event) {
    console.log('SW: Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'CV Optimizer Pro notification',
        icon: '/static/icons/icon-192x192.png',
        badge: '/static/icons/icon-96x96.svg',
        tag: 'cv-optimizer-notification',
        requireInteraction: false,
        actions: [
            {
                action: 'open',
                title: 'Otwórz aplikację'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('CV Optimizer Pro', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', function(event) {
    console.log('SW: Notification clicked');
    event.notification.close();

    event.waitUntil(
        clients.openWindow('/')
    );
});

// Periodic Background Sync
self.addEventListener('periodicsync', function(event) {
    if (event.tag === 'cv-status-sync') {
        console.log('SW: Periodic sync - CV status update');
        event.waitUntil(
            // Handle periodic sync
            Promise.resolve()
        );
    }
});