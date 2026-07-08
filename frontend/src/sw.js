// frontend/src/sw.js
const CACHE_NAME = "naruto-api-v2"; // ← Mudei a versão!

const urlsToCache = [
  "/",
  "/css/style.css",
  "/js/app.js",
  "/js/config.js",
  "/js/services/apiClient.js",
  "/js/utils/imageUtils.js",
  "/js/utils/domUtils.js",
  "/images/jiraiya.png",
  "/manifest.json",
];

// Instalação
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("📦 Cache aberto");
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error("❌ Erro ao cachear:", error);
      }),
  );
});

// Ativação - Limpa caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("🗑️ Removendo cache antigo:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

// Interceptação de requisições
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).catch(() => {
        // Fallback offline
        return caches.match("/offline.html");
      });
    }),
  );
});
