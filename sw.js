// Constantes
const VERSION = "01.00.004";
const CACHE_NAME_STATIC = "static-" + VERSION;
const CACHE_NAME_DYNAMIC = "dynamic-" + VERSION;
const urlsToCache = [ 
        "/",
        "/index.html",
        "/src/index.js",
        "/src/style.css", 
        "/src/script.js",
        "/fonts/fa-solid-900.ttf",
        "/fonts/Spartan-Black.ttf", 
        '/fonts/Spartan-Light.ttf',
        "/images/astro.png",
        "/images/astrochinois.png",
        "/images/Fleche.png",
        "/images/gateau.png",
        "/manifest.json"];

// Install SW
self.addEventListener("install", event => {
    console.log('[Service Worker] Installing Service Worker...');
    event.waitUntil(
        caches.open(CACHE_NAME_STATIC).then(cache => {
            console.log('[Service Worker] Precaching App Shell');
            return cache.addAll(urlsToCache);
        }).catch(error => {})
    );
});

// Listen for request
self.addEventListener("fetch", event => {
    console.log('[Service Worker] Fetching something : ', event.request.url);
    event.respondWith(
        caches.match(event.request.url).then(response => {
            if (response) {
                return response;
            }
            else {
                return fetch(event.request).then(response => {
                    caches.open(CACHE_NAME_DYNAMIC).then(cache => {
                        cache.put(event.request.url, response.clone());
                        return response;
                    })
                }).catch(error => {
                    //TODO offline.html
                });
            }
        })
    );
});

// Activate SW
self.addEventListener("activate", event => {
    console.log('[Service Worker] Activating Service Worker...');
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map(key => {
                if (key !== CACHE_NAME_STATIC && key !== CACHE_NAME_DYNAMIC) {
                    console.log('[Service Worker] Removing old cache : ', key);
                    return caches.delete(key);
                }
            }));
        })
    )
});

// Réveil du SW lors de la réception de l'évenement 'periodicSync'
// Lancement de la notification.
self.addEventListener('periodicsync', event => {
    console.log('[Service Worker] PeriodicSync : ', event)
});