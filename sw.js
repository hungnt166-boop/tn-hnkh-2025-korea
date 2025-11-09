const CACHE = 'tn-hnkh-2025-korea-v1';
const ASSETS = ['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e=>{
  const req = e.request;
  if(req.method !== 'GET') return;
  e.respondWith((async()=>{
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req);
    if(hit) { return hit; }
    try{
      const net = await fetch(req);
      cache.put(req, net.clone());
      return net;
    }catch(err){
      return cache.match('./index.html');
    }
  })());
});