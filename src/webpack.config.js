const path = require('path');
const AssetsPlugin = require('assets-webpack-plugin');

module.exports = {
	entry: {
		app: './js/main.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			}
		]
	},

	output: {
		path: path.join(__dirname, './../static/dist'),
		filename: 'js/[name].[chunkhash].js'
	},

	resolve: {
		modules: [path.resolve(__dirname, 'src'), 'node_modules']
	},

	plugins: [
		new AssetsPlugin({
			filename: 'webpack_assets.json',
			path: path.join(__dirname, '../data'),
			prettyPrint: true
		})
	]
};