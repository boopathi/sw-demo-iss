module.exports = function(url, callback) {
	var x = new window.XMLHttpRequest();

	x.onreadystatechange = function() {
		if(x.readyState == 4) {
			callback(null, x.responseText);
		}
	};
	x.open('GET', url);
	x.send();
};