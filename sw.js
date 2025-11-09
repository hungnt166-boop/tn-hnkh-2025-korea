const CACHE = 'tn-hnkh-2025-korea-v3';
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
  if(e.request.method!=='GET') return;
  e.respondWith((async()=>{
    const cache = await caches.open(CACHE);
    const hit = await cache.match(e.request);
    if(hit) return hit;
    try{
      const net = await fetch(e.request);
      cache.put(e.request, net.clone());
      return net;
    }catch(err){
      return cache.match('./index.html');
    }
  })());
});