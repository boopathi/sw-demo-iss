var ejs = require('ejs'),
	fs = require('fs');

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')
	});

	// Task to generate content for gh-pages
	grunt.registerTask('publish', function() {
		renderOpts
		var index = ejs.render(fs.readFileSync('./views/index.html').toString(), {
			scripts: [
			    "//maps.googleapis.com/maps/api/js?key=" + process.env.SW_DEMO_ISS_GMAPS_API,
			    "app.bundle.js"
			]
		});
		fs.writeFileSync('./index.html', index);
	});

}