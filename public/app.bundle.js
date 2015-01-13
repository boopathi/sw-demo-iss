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

	var co = __webpack_require__(3),
		get = __webpack_require__(1),
		maps = __webpack_require__(2),
		updateTimeInterval = 1000,
		api = "https://api.wheretheiss.at/v1/satellites/25544",
		map, issmarker, issinfo, timer;

	document.addEventListener('DOMContentLoaded', function() {
		co(getLocationJSON)
			.then(initLocation)
			.then(addEvents)
			.then(startPolling)
			.catch(function(err) {
				console.log(err.stack);
				clearInterval(timer);
			})
	});

	function *getLocationJSON() {
		return yield get(api, 'json');
	}

	function initLocation(iss) {
		map = maps.Init(iss.latitude, iss.longitude);
		issmarker = maps.ISSMarker(map, iss);
		issinfo = maps.InfoWindow(map, iss);
		issinfo.open(map, issmarker);
		return iss;
	}

	function addEvents(iss) {
		google.maps.event.addListener(issmarker, 'click', function() {
			issinfo.open(map, issmarker);
		});
		return iss;
	}

	function startPolling(iss) {
		timer = setInterval(function() {
			co(getLocationJSON)
				.then(updateLocation)
				.catch(function(err) {
					clearInterval(timer);
					console.log(err.stack);
				});
		}, updateTimeInterval);
		return iss;
	}

	function updateLocation(iss) {
		var newContent = maps.FormatISSInfo(iss);
		if(issinfo.getContent !== newContent) issinfo.setContent(newContent);
		var center = new google.maps.LatLng(iss.latitude, iss.longitude);
		issmarker.setPosition(center);
		map.panTo(center);
	};

	if('serviceWorker' in navigator) {
		navigator.serviceWorker.register('sw.js', {
			scope: './'
		}).then(function(reg) {
				console.log("Service worker registered")
			}).catch(function(err) {
				console.log(err);
			});
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(url, type) {
		if(type == "jsonp") {
			return new Promise(function(resolve,reject) {
				var callbackName = 'jsonp_callback_' + Math.round(10000 * Math.random());
				window[callbackName] = function(data) {
					delete window[callbackName];
					document.body.removeChild(script);
					resolve(data);
				};
				var script = document.createElement('script');
				script.src = url + (url.indexOf('?') >=0 ? '&' : '?') + 'callback=' + callbackName;
				document.body.appendChild(script);
			});
		} else {
			return new Promise(function(resolve, reject) {
				var x = new window.XMLHttpRequest();
				x.onreadystatechange = function() {
					if(x.readyState == 4) {
						resolve(JSON.parse(x.responseText));
					}
				}
				x.open('GET', url);
				x.send();
			});
		}
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var GoogleMaps = {
		Init: function(lat, lng) {
			var mapOptions = {
				zoom: 5,
				center: new google.maps.LatLng(lat, lng),
				disableDefaultUI: true,
				zoomControl: true,
				zoomControlOptions: {
					style: google.maps.ZoomControlStyle.LARGE,
					position: google.maps.ControlPosition.LEFT_CENTER
				}
			};
			return new google.maps.Map(document.getElementById('map-container'), mapOptions);
		},
		InfoWindow: function(map, iss) { 
			return new google.maps.InfoWindow({
				content: GoogleMaps.FormatISSInfo(iss),
				maxWidth: 100
			});
		},
		ISSMarker: function(map, iss) {
			return new google.maps.Marker({
				position: map.getCenter(),
				icon: 'public/images/iss.png',
				map: map
			})
		},
		FormatISSInfo: function(iss) {
			var html = "<div>"
			html += "<b>Vel</b>: " + Math.round(iss.velocity) + " KM/H<br/>";
			html += "<b>Alt</b>: " + Math.round(iss.altitude) + " KM";
			html += "</div>";
			return html;
		}
	};

	module.exports = GoogleMaps;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * slice() reference.
	 */

	var slice = Array.prototype.slice;

	/**
	 * Expose `co`.
	 */

	module.exports = co['default'] = co.co = co;

	/**
	 * Wrap the given generator `fn` into a
	 * function that returns a promise.
	 * This is a separate function so that
	 * every `co()` call doesn't create a new,
	 * unnecessary closure.
	 *
	 * @param {GeneratorFunction} fn
	 * @return {Function}
	 * @api public
	 */

	co.wrap = function (fn) {
	  return function () {
	    return co.call(this, fn.apply(this, arguments));
	  };
	};

	/**
	 * Execute the generator function or a generator
	 * and return a promise.
	 *
	 * @param {Function} fn
	 * @return {Function}
	 * @api public
	 */

	function co(gen) {
	  var ctx = this;
	  if (typeof gen === 'function') gen = gen.call(this);
	  // we wrap everything in a promise to avoid promise chaining,
	  // which leads to memory leak errors.
	  // see https://github.com/tj/co/issues/180
	  return new Promise(function(resolve, reject) {
	    onFulfilled();

	    /**
	     * @param {Mixed} res
	     * @return {Promise}
	     * @api private
	     */

	    function onFulfilled(res) {
	      var ret;
	      try {
	        ret = gen.next(res);
	      } catch (e) {
	        return reject(e);
	      }
	      next(ret);
	    }

	    /**
	     * @param {Error} err
	     * @return {Promise}
	     * @api private
	     */

	    function onRejected(err) {
	      var ret;
	      try {
	        ret = gen.throw(err);
	      } catch (e) {
	        return reject(e);
	      }
	      next(ret);
	    }

	    /**
	     * Get the next value in the generator,
	     * return a promise.
	     *
	     * @param {Object} ret
	     * @return {Promise}
	     * @api private
	     */

	    function next(ret) {
	      if (ret.done) return resolve(ret.value);
	      var value = toPromise.call(ctx, ret.value);
	      if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
	      return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
	        + 'but the following object was passed: "' + String(ret.value) + '"'));
	    }
	  });
	}

	/**
	 * Convert a `yield`ed value into a promise.
	 *
	 * @param {Mixed} obj
	 * @return {Promise}
	 * @api private
	 */

	function toPromise(obj) {
	  if (!obj) return obj;
	  if (isPromise(obj)) return obj;
	  if (isGeneratorFunction(obj) || isGenerator(obj)) return co.call(this, obj);
	  if ('function' == typeof obj) return thunkToPromise.call(this, obj);
	  if (Array.isArray(obj)) return arrayToPromise.call(this, obj);
	  if (isObject(obj)) return objectToPromise.call(this, obj);
	  return obj;
	}

	/**
	 * Convert a thunk to a promise.
	 *
	 * @param {Function}
	 * @return {Promise}
	 * @api private
	 */

	function thunkToPromise(fn) {
	  var ctx = this;
	  return new Promise(function (resolve, reject) {
	    fn.call(ctx, function (err, res) {
	      if (err) return reject(err);
	      if (arguments.length > 2) res = slice.call(arguments, 1);
	      resolve(res);
	    });
	  });
	}

	/**
	 * Convert an array of "yieldables" to a promise.
	 * Uses `Promise.all()` internally.
	 *
	 * @param {Array} obj
	 * @return {Promise}
	 * @api private
	 */

	function arrayToPromise(obj) {
	  return Promise.all(obj.map(toPromise, this));
	}

	/**
	 * Convert an object of "yieldables" to a promise.
	 * Uses `Promise.all()` internally.
	 *
	 * @param {Object} obj
	 * @return {Promise}
	 * @api private
	 */

	function objectToPromise(obj){
	  var results = new obj.constructor();
	  var keys = Object.keys(obj);
	  var promises = [];
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    var promise = toPromise.call(this, obj[key]);
	    if (promise && isPromise(promise)) defer(promise, key);
	    else results[key] = obj[key];
	  }
	  return Promise.all(promises).then(function () {
	    return results;
	  });

	  function defer(promise, key) {
	    // predefine the key in the result
	    results[key] = undefined;
	    promises.push(promise.then(function (res) {
	      results[key] = res;
	    }));
	  }
	}

	/**
	 * Check if `obj` is a promise.
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */

	function isPromise(obj) {
	  return 'function' == typeof obj.then;
	}

	/**
	 * Check if `obj` is a generator.
	 *
	 * @param {Mixed} obj
	 * @return {Boolean}
	 * @api private
	 */

	function isGenerator(obj) {
	  return 'function' == typeof obj.next && 'function' == typeof obj.throw;
	}

	/**
	 * Check if `obj` is a generator function.
	 *
	 * @param {Mixed} obj
	 * @return {Boolean}
	 * @api private
	 */

	function isGeneratorFunction(obj) {
	  var constructor = obj.constructor;
	  return constructor && 'GeneratorFunction' == constructor.name;
	}

	/**
	 * Check for plain object.
	 *
	 * @param {Mixed} val
	 * @return {Boolean}
	 * @api private
	 */

	function isObject(val) {
	  return Object == val.constructor;
	}


/***/ }
/******/ ])))