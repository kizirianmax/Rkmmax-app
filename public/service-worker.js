// /public/service-worker.js
const VERSION = "v1.1";
const STATIC_CACHE = `rkmmax-static-${VERSION}`;
const RUNTIME_CACHE = `rkmmax-runtime-${VERSION}`;

const ASSETS = [
  "/",                 // SPA shell
  "/index.html",
  "/manifest.json",
  "/avatars/serginho-192.png",
  "/avatars/serginho-512.png"
];

// Instala e pré-cacheia os assets essenciais
self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(STATIC_CACHE);
    await cache.addAll(ASSETS);
  })());
  self.skipWaiting();
});

// Ativa e remove caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(k => k !== STATIC_CACHE && k !== RUNTIME_CACHE)
        .map(k => caches.delete(k))
    );
  })());
  self.clients.claim();
});

// Estratégias:
// - Navegação (SPA): network-first (cai pro index.html se offline)
// - Assets estáticos (img/script/css/font/manifest): stale-while-revalidate
// - Demais GETs (mesma origem): cache-first com atualização em background
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // ignore POST/PUT/PATCH/DELETE
  if (req.method !== "GET") return;

  const sameOrigin = new URL(req.url).origin === self.location.origin;

  // Navegação da SPA
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        return fresh;
      } catch {
        // offline fallback
        return (await caches.match("/index.html")) || Response.error();
      }
    })());
    return;
  }

  // Assets estáticos
  if (
    sameOrigin &&
    ["style", "script", "image", "font", "manifest"].includes(req.destination)
  ) {
    event.respondWith((async () => {
      const cached = await caches.match(req);
      const fetchAndUpdate = fetch(req).then(async (res) => {
        const copy = res.clone();
        const cache = await caches.open(STATIC_CACHE);
        cache.put(req, copy);
        return res;
      }).catch(() => null);
      return cached || (await fetchAndUpdate) || Response.error();
    })());
    return;
  }

  // Outros GETs da mesma origem: cache-first com atualização
  if (sameOrigin) {
    event.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) {
        // atualiza em background
        event.waitUntil((async () => {
          try {
            const fresh = await fetch(req);
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(req, fresh.clone());
          } catch {}
        })());
        return cached;
      }
      // primeira vez: busca e guarda
      try {
        const res = await fetch(req);
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(req, res.clone());
        return res;
      } catch {
        return Response.error();
      }
    })());
  }
});
