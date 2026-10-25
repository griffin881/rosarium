const CACHE = "rosarium-v4";
const ASSETS = ["./","index.html","manifest.webmanifest","fonts/fell.woff2","fonts/fell-italic.woff2","fonts/fell-sc.woff2","fonts/fraktur.woff2",
  "icons/icon-192.png","icons/icon-512.png","icons/apple-touch-icon.png","icons/favicon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  if (e.request.mode === "navigate"){
    e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put("index.html", cp)); return r; })
      .catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(e.request).then(m => m || fetch(e.request).then(r => {
    const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r;
  })));
});
