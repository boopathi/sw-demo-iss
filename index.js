var Sync = require('./src/Sync'),
	get = require('./src/GetRequest'),
	mapInit = require('./src/GoogleMaps.js'),
	updateTimeInterval = 1000,
	map, issmarker;

var UpdateLocation = function() {
	new Promise(function(resolve, reject) {
		Sync(function *(resume) {
			var respStr = yield get('/api/location', resume);
			var resp = JSON.parse(respStr);
			var center = new google.maps.LatLng(resp.iss_position.latitude,resp.iss_position.longitude);
			map.panTo(center);
			issmarker.setPosition(center);
			resolve();
		});
	}).then(function() {
		window.latestTimer = setTimeout(UpdateLocation, updateTimeInterval);
	}).catch(function(err) {
		console.log(err);
	});
};

Sync(function *(resume) {
	console.log("Request open-notify API for current ISS Location");
	var respStr = yield get("/api/location", resume);
	var resp = JSON.parse(respStr);
	map = mapInit(resp.iss_position.latitude,resp.iss_position.longitude);
	issmarker = new google.maps.Marker({
		position: map.getCenter(),
		icon: 'images/iss.png',
		map: map
	});
	window.latestTimer = setTimeout(UpdateLocation, updateTimeInterval);
});

if('serviceWorker' in navigator) {
	navigator.serviceWorker.register('sw.bundle.js', {
		scope: 'isstracker'
	}).then(function(reg) {
		console.log("Service worker registered")
	}).catch(function(err) {
		console.log(err);
	});
}