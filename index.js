var co = require('co'),
	get = require('./src/GetRequest'),
	maps = require('./src/GoogleMaps'),
	updateTimeInterval = 1000,
	api = "https://api.wheretheiss.at/v1/satellites/25544",
	map, issmarker, issinfo;

var updateLocation = function() {
	return get(api, 'json')
		.then(function(resp){
			var newContent = maps.FormatISSInfo(resp);
			if(issinfo.getContent() !== newContent) issinfo.setContent(newContent);
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
		map = maps.Init(resp.latitude, resp.longitude);
		issmarker = maps.ISSMarker(map, resp);
		issinfo = maps.InfoWindow(map, resp);
		issinfo.open(map, issmarker);
		google.maps.event.addListener(issmarker, 'click', function() {
			issinfo.open(map, issmarker);
		})
		setTimeout(updateLocation, updateTimeInterval);
	}).catch(function(err) {
		console.log(err.stack);
	});
});

if('serviceWorker' in navigator) {
	navigator.serviceWorker.register('sw.js', {
		scope: './'
	}).then(function(reg) {
			console.log("Service worker registered")
		}).catch(function(err) {
			console.log(err);
		});
}