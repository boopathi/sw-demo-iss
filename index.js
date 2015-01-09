var Sync = require('./src/Sync'),
	get = require('./src/GetRequest'),
	mapInit = require('./src/GoogleMaps.js'),
	updateTimeInterval = 1000,
	map, issmarker;

var UpdateLocation = function() {
	var p = new Promise(function(resolve, reject) {
		Sync(function *(resume) {
			var respStr = yield get('/api/location', resume);
			var resp = JSON.parse(respStr);
			var center = new google.maps.LatLng(resp.iss_position.latitude,resp.iss_position.longitude);
			map.panTo(center);
			issmarker.setPosition(center);
			resolve();
		});
	});
	p.then(function() {
		setTimeout(UpdateLocation, updateTimeInterval);
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
	setTimeout(UpdateLocation, updateTimeInterval);
});