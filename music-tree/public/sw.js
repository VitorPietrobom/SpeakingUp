/* Music Tree service worker — offline-first app shell.
   Cache-first for same-origin GETs; network fills the cache as you browse,
   so the sky, criteria and queue stay usable offline (YouTube embeds are
   network-only and the UI shows an "offline — open later" note instead). */
const CACHE = 'music-tree-v1'
const SHELL = ['/', '/index.html', '/manifest.webmanifest', '/icon.svg']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url)
  if (e.request.method !== 'GET' || url.origin !== location.origin) return
  e.respondWith(
    caches.match(e.request).then((hit) => {
      if (hit) return hit
      return fetch(e.request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone()
            caches.open(CACHE).then((c) => c.put(e.request, copy))
          }
          return res
        })
        // Navigation while offline falls back to the cached shell
        .catch(() => (e.request.mode === 'navigate' ? caches.match('/index.html') : undefined))
    })
  )
})
