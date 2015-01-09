module.exports = {
	entry: './index.js',
	output: {
		path: 'build',
		filename: 'bundle.js',
		libraryTarget: 'this'
	},
	externals: {
		google: "google"
	},
	noInfo: true,
	colors: true
};