var co = require('co'),
	get = require('./src/GetRequest'),
	mapInit = require('./src/GoogleMaps.js'),
	updateTimeInterval = 1000,
	map, issmarker;

var updateLocation = function() {
	get('/api/location')
		.then(function(respStr){
			var resp = JSON.parse(respStr),
				center = new google.maps.LatLng(resp.iss_position.latitude, resp.iss_position.longitude);
			issmarker.setPosition(center);
			map.panTo(center);
			setTimeout(updateLocation, updateTimeInterval);
		})
		.catch(function(err) {
			console.log(err.stack);
		});
};

co(function *() {
	var respStr = yield get('/api/location');
	return JSON.parse(respStr);
}).then(function(resp) {
	map = mapInit(resp.iss_position.latitude, resp.iss_position.longitude);
	issmarker = new google.maps.Marker({
		position: map.getCenter(),
		icon: 'images/iss.png',
		map: map
	});
	setTimeout(updateLocation, updateTimeInterval);
}).catch(function(err) {
	console.log("Something went wrong :", err);
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