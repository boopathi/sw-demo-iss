var ejs = require('ejs'),
	fs = require('fs'),
	renderOpts = require('./render.opts');

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')
	});

	// Task to generate content for gh-pages
	grunt.registerTask('publish', function() {
		renderOpts
		var index = ejs.render(fs.readFileSync('./views/index.html').toString(), renderOpts);
		fs.writeFileSync('./index.html', index);
	});

}