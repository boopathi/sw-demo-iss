module.exports = {
	entry: {
		app: './index.js',
		//sw: './sw.js'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader?experimental&optional=selfContained'
			}
		]
	},
	output: {
		path: './public',
		filename: '[name].bundle.js',
		libraryTarget: 'this'
	},
	externals: {
		google: "google"
	},
	noInfo: true,
	colors: true
};