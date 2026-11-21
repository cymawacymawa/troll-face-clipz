// Troll Face Clipz Online (phone web app): shows chat notifications, even when it's closed.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch { d = {body: e.data ? e.data.text() : ''}; }
  e.waitUntil(self.registration.showNotification(d.title || 'Clipz chat', {
    body: d.body || 'New message',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    tag: d.tag || 'tfc-chat',
    renotify: true,
    data: {url: d.url || './index.html?chat'},
  }));
});

// Tap the notification: open the app (or switch to it) on the chat.
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || './index.html?chat', self.registration.scope).href;
  e.waitUntil((async () => {
    const wins = await self.clients.matchAll({type: 'window', includeUncontrolled: true});
    for (const w of wins) {
      if (w.url.startsWith(self.registration.scope)) {
        w.postMessage('tfc-open-chat');
        return w.focus();
      }
    }
    return self.clients.openWindow(url);
  })());
});
