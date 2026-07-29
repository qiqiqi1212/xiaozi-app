// 小紫同学 PWA Service Worker —— 离线缓存
const CACHE = 'xiaozi-v10';
const ASSETS = [
  'index.html',
  'manifest.webmanifest',
  'css/style.css',
  'js/content.js',
  'js/db.js',
  'js/sync.js',
  'js/app_a.js', 'js/app_b.js', 'js/app_c.js', 'js/app_d.js',
  'assets/icon.svg',
  'assets/icon-192.png',
  'assets/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // 天气等外部 API 不缓存，走网络优先
  if (url.origin !== location.origin) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then((hit) => {
      const fetchPromise = fetch(e.request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      }).catch(() => hit);
      return hit || fetchPromise;
    })
  );
});
