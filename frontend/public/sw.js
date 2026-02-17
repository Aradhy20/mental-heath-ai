// Service Worker for Push Notifications
// This enables background notifications and offline capabilities

const CACHE_NAME = 'mindful-ai-v1'
const urlsToCache = [
    '/',
    '/offline.html'
]

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    )
    self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName)
                    }
                })
            )
        })
    )
    self.clients.claim()
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request)
            })
            .catch(() => {
                return caches.match('/offline.html')
            })
    )
})

// Push notification event
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'New notification from MindfulAI',
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Open App',
                icon: '/check.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/cross.png'
            }
        ]
    }

    event.waitUntil(
        self.registration.showNotification('MindfulAI', options)
    )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
    event.notification.close()

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        )
    }
})

// Background sync for offline data
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-mood-data') {
        event.waitUntil(syncMoodData())
    }
})

async function syncMoodData() {
    // Sync any pending mood entries when back online
    const cache = await caches.open('mood-data')
    const requests = await cache.keys()

    for (const request of requests) {
        try {
            await fetch(request)
            await cache.delete(request)
        } catch (error) {
            console.error('Sync failed:', error)
        }
    }
}
