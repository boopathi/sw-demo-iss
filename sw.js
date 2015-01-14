importScripts("public/serviceworker-cache-polyfill.js");

var CACHE_NAME = "isstracker-cache-v1";

var urlsToCache = [
	// "index.html",
	// "public/app.bundle.js",
	// "public/sw.bundle.js",
	// "public/serviceworker-cache-polyfill.js",
	// "public/images/iss.png",
	new Request("//api.wheretheiss.at/v1/satellites/25544", { mode: 'no-cors' }),
	new Request("//maps.gstatic.com/maps-api-v3/api/js/19/5/common.js", { mode: 'no-cors' }),
	new Request("//maps.gstatic.com/maps-api-v3/api/js/19/5/map.js", { mode: 'no-cors' }),
	new Request("//maps.gstatic.com/maps-api-v3/api/js/19/5/util.js", { mode: 'no-cors' }),
	new Request("//maps.gstatic.com/maps-api-v3/api/js/19/5/marker.js", { mode: 'no-cors' }),
	new Request("//maps.gstatic.com/maps-api-v3/api/js/19/5/infowindow.js", { mode: 'no-cors' }),
	new Request("//maps.gstatic.com/maps-api-v3/api/js/19/5/onion.js", { mode: 'no-cors' }),
	new Request("//maps.gstatic.com/mapfiles/openhand_8_8.cur", { mode: 'no-cors' }),
	new Request("//maps.gstatic.com/maps-api-v3/api/js/19/5/controls.js", { mode: 'no-cors' }),
	new Request("//maps.gstatic.com/mapfiles/transparent.png", { mode: 'no-cors' }),
	new Request("//maps.gstatic.com/maps-api-v3/api/js/19/5/stats.js", { mode: 'no-cors' }),
	new Request("//maps.gstatic.com/mapfiles/api-3/images/google_white2.png", { mode: 'no-cors' })
];

self.addEventListener('install', function(event) {
	console.log("installing...");
	console.log(event);
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(function(cache) {
				console.log('cached');
				return cache.addAll(urlsToCache);
			})
	);
});

self.addEventListener('activate', function(event) {
	console.log('activation');
	console.log(event);
	var cacheWhiteList = [];
});

// self.addEventListener('fetch', function(event) {
// 	console.log('fetch happening...');
// 	event.respondWith(
// 		caches.match(event.request)
// 			.then(function(response) {
// 				if(response) return response;
// 				var fetchRequest = event.request.clone();
// 				return fetch(fetchRequest).then(function(response) {
// 					if(!response || response.status!==200 || response.type !== 'basic') {
// 						return response;
// 					}
// 					var responseToCache = response.clone();
// 					caches.open(CACHE_NAME)
// 						.then(function(cache) {
// 							console.log('new response saved to cache.');
// 							var cacheRequest = event.request.clone();
// 							cache.put(cacheRequest, responseToCache);
// 						});
// 					return response;
// 				});
// 			})
// 	);
// });
