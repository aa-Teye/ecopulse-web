const CACHE_NAME = 'ecopulse-shell-v2'
const APP_SHELL = ['/manifest.json', '/icons/icon-192.png', '/icons/icon-512.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Network-first for navigations (the page itself) and cross-origin API
// calls, so a new deploy is always picked up instead of a frozen snapshot
// being served forever. Cache-first only for same-origin static assets —
// safe because Vite content-hashes filenames, so an old cached hash is
// simply never requested again once a new deploy ships a new one.
self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const isNavigation = request.mode === 'navigate'
  const isCrossOrigin = new URL(request.url).origin !== self.location.origin

  if (isNavigation || isCrossOrigin) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (isNavigation) {
            const copy = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
          }
          return response
        })
        .catch(() => caches.match(request))
    )
    return
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request).then((response) => {
        const copy = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
        return response
      })
    })
  )
})
