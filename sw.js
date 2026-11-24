const scope = self.registration.scope;
const prefix = "ednovera-secretary-shell:" + scope + ":";
const cacheName = prefix + "680f2e5163eaf899";
const files = ["index.html","assets/index-DsApoN0r.js","assets/index-DImKcXur.css","manifest.webmanifest","icon-192.png","icon-512.png"].map(file => new URL(file, scope).href);
const index = new URL("index.html", scope).href;

self.addEventListener("install", event => {
  event.waitUntil(caches.open(cacheName).then(cache =>
    cache.addAll(files.map(url => new Request(url, { cache: "reload" }))),
  ));
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) {
      if (name.startsWith(prefix) && name !== cacheName) await caches.delete(name);
    }
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const { url, mode, method } = event.request;
  if (method !== "GET" || !url.startsWith(scope)) return;
  if (mode === "navigate" || files.includes(url)) {
    event.respondWith((async () => {
      const cache = await caches.open(cacheName);
      return (await cache.match(mode === "navigate" ? index : url)) ?? Response.error();
    })());
  }
});
