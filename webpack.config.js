var path = require('path');

module.exports = {
  entry:
    './src/index.js',
  output: {
    filename: 'charterflight.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'CharterFlight',
    libraryTarget: 'umd',
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
                  presets: ['es2015']
                }
              }
            }
        ]
    }
};
