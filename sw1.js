(function() {
    "use strict";

    const shouldCacheResponse = function(url) {
            return url.match(/^((?!(digx|\/\?module\=|index\.html|home\.html|build\.fingerprint|extension\.json|manifest\.json)).)*$/);
        },
        CACHE_NAME = "obdx-cache",
        crucialResources = [],
        enabledCachePolicy = "staleWhileRevalidate",
        cachePolicies = {
            default: function(event) {
                event.respondWith(
                    caches.match(event.request).then(function(response) {
                        // Cache hit - return response
                        if (response) {
                            return response;
                        }

                        // IMPORTANT: Clone the request. A request is a stream and
                        // can only be consumed once. Since we are consuming this
                        // once by cache and once by the browser for fetch, we need
                        // to clone the response.
                        const fetchRequest = event.request.clone();

                        return fetch(fetchRequest).then(function(response) {
                            // Check if we received a valid response
                            if (!response || (response.type === "basic" && response.status !== 200)) {
                                return response;
                            }

                            // IMPORTANT: Clone the response. A response is a stream
                            // and because we want the browser to consume the response
                            // as well as the cache consuming the response, we need
                            // to clone it so we have two streams.
                            if (shouldCacheResponse(event.request.url)) {
                                const responseToCache = response.clone();

                                caches.open(CACHE_NAME).then(function(cache) {
                                    cache.put(event.request, responseToCache);
                                });
                            }

                            return response;
                        });
                    })
                );
            },
            staleWhileRevalidate: function(event) {
                event.respondWith(
                    caches.open(CACHE_NAME).then(function(cache) {
                        return cache.match(event.request).then(function(response) {
                            const fetchPromise = fetch(event.request).then(function(networkResponse) {
                                if (!networkResponse || (networkResponse.type === "basic" && networkResponse.status !== 200)) {
                                    return networkResponse;
                                }

                                if (shouldCacheResponse(event.request.url)) {
                                    cache.put(event.request, networkResponse.clone());
                                }

                                return networkResponse;
                            });

                            return response || fetchPromise;
                        });
                    })
                );
            }
        };

    // Wait for installation until all the crucial resources are loaded and fetched
    self.addEventListener("install", function(event) {
        event.waitUntil(caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(crucialResources);
        }));
    });

    self.addEventListener("fetch", cachePolicies[enabledCachePolicy]);

    // Delete the existing caches on activation of new version of service worker.
    self.addEventListener("activate", function(event) {
        event.waitUntil(caches.keys().then(function(cacheNames) {
            return Promise.all(cacheNames.map(function(cacheName) {
                return caches.delete(cacheName);
            }));
        }));
    });
})();