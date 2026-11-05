/* InfoScroll service worker: lets the app open offline and keeps pictures you have seen.
   Put this file next to index.html (same folder). Change VERSION whenever you update the app. */
const VERSION="v2",SHELL="infoscroll-shell-"+VERSION,IMG="infoscroll-img-v1",MAXIMG=200;
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(SHELL).then(c=>c.addAll(["./","manifest.webmanifest","icon-192.png","icon-512.png"])).catch(()=>{}))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("infoscroll-shell-")&&k!==SHELL).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
async function trim(c){const ks=await c.keys();for(let i=0;i<ks.length-MAXIMG;i++)await c.delete(ks[i])}
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
  if(r.mode==="navigate"){
    e.respondWith(fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(SHELL).then(ca=>ca.put(r,c))}return res})
      .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match("./"))));return}
  if(u.origin===location.origin){e.respondWith(caches.match(r).then(m=>m||fetch(r)));return}
  if(u.hostname==="upload.wikimedia.org"&&r.destination==="image"){
    e.respondWith(caches.open(IMG).then(async ca=>{const hit=await ca.match(r);if(hit)return hit;
      try{const res=await fetch(r);if(res.ok)ca.put(r,res.clone()).then(()=>trim(ca));return res}catch(err){return Response.error()}}))}
});
