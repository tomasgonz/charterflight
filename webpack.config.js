var webpack = require('webpack');
var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var libraryName = 'charterflight';
var outputFile = libraryName + '.js';

module.exports = {
	mode: "development", // "production" | "development" | "none",
  	// Chosen mode tells webpack to use its built-in optimizations accordingly.
		entry: './src/index.js',
		devtool: 'source-map',
  	output: {
    	filename: outputFile,
			path: path.resolve(__dirname, 'dist'),
			library: libraryName,
			libraryTarget: 'umd',
			umdNamedDefine: true
	  },
	  module: {
		rules: [{
				test: /\.js$/,
				use: [{loader:'babel-loader'}],
				include: [
					path.resolve('.')
				],
					exclude: /node_modules/
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			}],
		},
		resolve: {
			extensions: ['.js']
		  },
		  plugins: [
			new HtmlWebpackPlugin()
		],
		externals: {
			lodash: {
			  commonjs: 'lodash',
			  commonjs2: 'lodash',
			  amd: 'lodash',
			  root: '_'
			}
		  }
};

	