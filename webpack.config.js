var webpack = require('webpack');
var path = require('path');
//const HtmlWebpackPlugin = require('html-webpack-plugin');
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
		libraryTarget: 'umd'
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
		  plugins: [],
		externals: {
			lodash: {
			  commonjs: 'lodash',
			  commonjs2: 'lodash',
			  amd: 'lodash',
			  root: '_',
			  var: '_'
			}
		  },
  entry:
    './src/index.js',
  output: {
    filename: 'charterflight.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'CharterFlight',
    umdNamedDefine: true
  },
    module: {
        rules: [
            {
              test: /\.js$/,
              exclude: [/node_modules/],
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env']
                }
              }
            }
        ]
    }
};

	