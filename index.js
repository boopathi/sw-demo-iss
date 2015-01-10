var co = require('co'),
	get = require('./src/GetRequest'),
	mapInit = require('./src/GoogleMaps.js'),
	updateTimeInterval = 1000,
	api = "https://api.wheretheiss.at/v1/satellites/25544",
	map, issmarker;

var updateLocation = function() {
	return get(api, 'json')
		.then(function(resp){
			var center = new google.maps.LatLng(resp.latitude, resp.longitude);
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
		return yield get(api, 'json');
	}).then(function(resp) {
		map = mapInit(resp.latitude, resp.longitude);
		issmarker = new google.maps.Marker({
			position: map.getCenter(),
			icon: 'public/images/iss.png',
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