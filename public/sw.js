// Service Worker for The Ultimate Bible Quizzing Game
const CACHE_NAME = 'bible-quiz-v1';
const OFFLINE_URL = '/offline.html';

// Resources to cache
const RESOURCES_TO_CACHE = [
  '/',
  '/offline.html',
  '/dashboard',
  '/play',
  '/leaderboard',
  '/history',
  '/settings',
  '/guide',
  '/icon.svg',
  '/icon-192.svg',
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(RESOURCES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});

// Push notification event - display notification
self.addEventListener('push', (event) => {
  let data = {
    title: 'Bible Quiz',
    body: 'You have a new notification',
    icon: '/icon-192.svg',
    badge: '/icon-192.svg',
    data: { url: '/dashboard' },
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icon-192.svg',
    badge: data.badge || '/icon-192.svg',
    vibrate: [200, 100, 200],
    data: data.data || { url: '/dashboard' },
    actions: [
      {
        action: 'open',
        title: 'Open App',
      },
      {
        action: 'close',
        title: 'Close',
      },
    ],
    requireInteraction: false,
    tag: data.tag || 'bible-quiz-notification',
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event - handle user interaction
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window if none found
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Background sync event - sync data when online
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-scores') {
    event.waitUntil(syncScores());
  }
});

async function syncScores() {
  // Placeholder for syncing scores when back online
  console.log('Syncing scores...');
}

// Periodic sync event - regular background updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-leaderboard') {
    event.waitUntil(updateLeaderboard());
  }
});

async function updateLeaderboard() {
  // Placeholder for updating leaderboard in background
  console.log('Updating leaderboard...');
}