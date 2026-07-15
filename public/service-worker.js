// service-worker.js — Taximota PWA
// Estratégia: App Shell + Cache First para estáticos, Network First
// com fallback para cache em chamadas de API (bairros, taxistas, empresas).

const APP_SHELL_CACHE = "taximota-shell-v1";
const DATA_CACHE = "taximota-data-v1";

const APP_SHELL_FILES = [
  "/",
  "/index.html",
  "/manifest.json",
  "/static/css/app.css",
  "/static/js/app.js",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/offline.html", // página exibida quando não há shell nem cache disponível
];

// URLs de API que devem ser servidas com estratégia Network First + cache
const API_PATTERNS = [
  /\/api\/bairros/,
  /\/api\/taxistas/,
  /\/api\/empresas/,
  /\/api\/favoritos/,
  /\/api\/historico/,
  /\/api\/alertas/,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== APP_SHELL_CACHE && key !== DATA_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

function isApiRequest(url) {
  return API_PATTERNS.some((pattern) => pattern.test(url));
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1) Chamadas de API: Network First, com fallback para cache (offline)
  if (isApiRequest(url.pathname)) {
    event.respondWith(networkFirstWithCache(request));
    return;
  }

  // 2) Recursos estáticos / App Shell: Cache First
  if (request.method === "GET") {
    event.respondWith(cacheFirstWithNetworkFallback(request));
  }
});

async function networkFirstWithCache(request) {
  const cache = await caches.open(DATA_CACHE);
  try {
    const networkResponse = await fetch(request);
    // Só armazena respostas válidas de GET
    if (request.method === "GET" && networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    // Sem internet e sem cache: devolve resposta vazia estruturada
    return new Response(
      JSON.stringify({ offline: true, message: "Sem conexão e sem dados salvos para este pedido." }),
      { headers: { "Content-Type": "application/json" }, status: 503 }
    );
  }
}

async function cacheFirstWithNetworkFallback(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    const cache = await caches.open(APP_SHELL_CACHE);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    if (request.mode === "navigate") {
      return caches.match("/offline.html");
    }
    return Response.error();
  }
}

// Background Sync: dispara quando a conexão volta, para sincronizar
// avaliações, denúncias e favoritos criados offline.
self.addEventListener("sync", (event) => {
  if (event.tag === "taximota-sync-outbox") {
    event.waitUntil(syncOutbox());
  }
});

async function syncOutbox() {
  const clientsList = await self.clients.matchAll();
  clientsList.forEach((client) => client.postMessage({ type: "SYNC_OUTBOX_START" }));
  // A lógica real de leitura/gravação usa IndexedDB (ver offline-db.js e sync.js)
  // Este service worker apenas avisa a aplicação para processar a fila local.
  clientsList.forEach((client) => client.postMessage({ type: "SYNC_OUTBOX_TRIGGER" }));
}
