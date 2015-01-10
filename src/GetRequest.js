module.exports = function(url) {
	return new Promise(function(resolve, reject) {
		var x = new window.XMLHttpRequest();
		x.onreadystatechange = function() {
			if(x.readyState == 4) {
				resolve(x.responseText);
			}
		}
		x.open('GET', url);
		x.send();
	});
};