module.exports = function(lat, lng) {
	var mapOptions = {
        zoom: 5,
        center: new google.maps.LatLng(lat, lng),
        disableDefaultUI: true
    };
	return new google.maps.Map(document.getElementById('map-container'), mapOptions);
}