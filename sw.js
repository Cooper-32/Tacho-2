var V='tacho-v1',SHELL=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(SHELL)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==V&&k!=='tacho-tiles'}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  var h=new URL(e.request.url).host;
  if(/tile\.openstreetmap\.org|arcgisonline\.com/.test(h)){
    e.respondWith(caches.open('tacho-tiles').then(function(c){return c.match(e.request).then(function(r){
      return r||fetch(e.request).then(function(n){c.put(e.request,n.clone());return n}).catch(function(){return Response.error()})})}));
  }else{
    e.respondWith(caches.match(e.request).then(function(r){return r||fetch(e.request)}));
  }
});
