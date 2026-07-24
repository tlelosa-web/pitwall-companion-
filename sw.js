/* F1 Clash Resource Sheet - service worker
 * Precache everything needed to run offline, cache-first with an
 * index.html network fallback. Bump CACHE_VERSION whenever a cached
 * file changes so clients pick up the new assets. */
const CACHE_VERSION = "f1sheet-v11";

// Relative URLs so the app works under /<repo>/ on GitHub Pages.
const PRECACHE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const isNavigation = req.mode === "navigate" ||
    (req.destination === "document");

  if (isNavigation) {
    // Network-first for the page shell so updates appear on a normal reload;
    // fall back to the cached index.html when offline.
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok && new URL(req.url).origin === self.location.origin) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put("./index.html", copy));
          }
          return res;
        })
        .catch(() => caches.match(req).then((c) => c || caches.match("./index.html")))
    );
    return;
  }

  // Cache-first for static assets (icons, manifest, etc.).
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res && res.ok && new URL(req.url).origin === self.location.origin) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => new Response("", { status: 504, statusText: "Offline" }));
    })
  );
});
