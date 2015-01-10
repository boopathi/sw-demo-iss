var co = require('co'),
	get = require('./src/GetRequest'),
	mapInit = require('./src/GoogleMaps.js'),
	updateTimeInterval = 1000,
	api = "http://api.open-notify.org/iss-now.json",
	map, issmarker;

var updateLocation = function() {
	return get(api, 'jsonp')
		.then(function(resp){
			var center = new google.maps.LatLng(resp.iss_position.latitude, resp.iss_position.longitude);
			issmarker.setPosition(center);
			map.panTo(center);
			setTimeout(updateLocation, updateTimeInterval);
		})
		.catch(function(err) {
			console.log(err.stack);
		});
};

document.addEventListener('DOMContentLoaded', function() {
	co(function *() {
		return yield get(api, 'jsonp');
	}).then(function(resp) {
		map = mapInit(resp.iss_position.latitude, resp.iss_position.longitude);
		issmarker = new google.maps.Marker({
			position: map.getCenter(),
			icon: 'images/iss.png',
			map: map
		});
		setTimeout(updateLocation, updateTimeInterval);
	}).catch(function(err) {
		console.log(err.stack);
	});
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