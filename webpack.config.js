module.exports = {
	entry: {
		app: './index.js',
		sw: './sw.js'
	},
	output: {
		path: 'build',
		filename: '[name].bundle.js',
		libraryTarget: 'this'
	},
	externals: {
		google: "google"
	},
	noInfo: true,
	colors: true
};