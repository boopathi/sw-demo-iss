(function(e, a) { for(var i in a) e[i] = a[i]; }(this, /******/ (function(modules) { // webpackBootstrap
/******/ 	
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/ 		
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/ 		
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 		
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 		
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/ 	
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/ 	
/******/ 	
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var CACHE_NAME = "isstracker-cache-v1";

	var urlsToCache = [
		"index.html",
		"public/app.bundle.js",
		"public/sw.bundle.js",
		"public/serviceworker-cache-polyfill.js",
		"public/images/iss.png",
		new Request("https://maps.googleapis.com/maps/api/js", { mode: 'no-cors' }),
		new Request("https://api.wheretheiss.at/v1/satellites/25544", { mode: 'no-cors' }),
		new Request("https://maps.gstatic.com/maps-api-v3/api/js/19/5/common.js", { mode: 'no-cors' }),
		new Request("https://maps.gstatic.com/maps-api-v3/api/js/19/5/map.js", { mode: 'no-cors' }),
		new Request("https://maps.gstatic.com/maps-api-v3/api/js/19/5/util.js", { mode: 'no-cors' }),
		new Request("https://maps.gstatic.com/maps-api-v3/api/js/19/5/marker.js", { mode: 'no-cors' }),
		new Request("https://maps.gstatic.com/maps-api-v3/api/js/19/5/infowindow.js", { mode: 'no-cors' }),
		new Request("https://maps.googleapis.com/maps/api/js/StaticMapService.GetMapImage", { mode: 'no-cors' }),
		new Request("https://maps.gstatic.com/maps-api-v3/api/js/19/5/onion.js", { mode: 'no-cors' }),
		new Request("https://maps.gstatic.com/mapfiles/openhand_8_8.cur", { mode: 'no-cors' }),
		new Request("https://maps.gstatic.com/maps-api-v3/api/js/19/5/controls.js", { mode: 'no-cors' }),
		new Request("https://maps.gstatic.com/mapfiles/transparent.png", { mode: 'no-cors' }),
		new Request("https://fonts.googleapis.com/css", { mode: 'no-cors' }),
		new Request("https://maps.gstatic.com/maps-api-v3/api/js/19/5/stats.js", { mode: 'no-cors' }),
		new Request("https://mts0.googleapis.com/vt", { mode: 'no-cors' }),
		new Request("https://mts1.googleapis.com/vt", { mode: 'no-cors' }),
		new Request("https://mts2.googleapis.com/vt", { mode: 'no-cors' }),
		new Request("https://maps.gstatic.com/mapfiles/api-3/images/google_white2.png", { mode: 'no-cors' })
	];

	self.addEventListener('install', function(event) {
		console.log("installing...");
		event.waitUntil(
			caches.open(CACHE_NAME)
				.then(function(cache) {
					console.log('cached');
					return cache.addAll(urlsToCache);
				})
		);
	});

	self.addEventListener('fetch', function(event) {
		console.log('fetch happening...');
		event.respondWith(
			caches.match(event.request)
				.then(function(response) {
					if(response) return response;
					var fetchRequest = event.request.clone();
					return fetch(fetchRequest).then(function(response) {
						if(!response || response.status!==200 || response.type !== 'basic') {
							return response;
						}
						var responseToCache = response.clone();
						caches.open(CACHE_NAME)
							.then(function(cache) {
								console.log('new response saved to cache.');
								var cacheRequest = event.request.clone();
								cache.put(cacheRequest, responseToCache);
							});
						return response;
					});
				})
		);
	});

	self.addEventListener('activate', function(event) {
		console.log('activate event fired');
		var cacheWhiteList = [];
	});

/***/ }
/******/ ])))