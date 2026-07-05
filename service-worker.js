const CACHE_NAME = "puppy-walk-v7";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css?v=20260705-5",
  "./script.js?v=20260705-5",
  "./questions.json",
  "./manifest.json",
  "./assets/icons/icon.svg",
  "./assets/dog/dog-base.svg",
  "./assets/dog/dog-happy.svg",
  "./assets/dog/dog-thinking.svg",
  "./assets/dog/dog-celebrate.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).catch(() => caches.match("./index.html")))
  );
});
