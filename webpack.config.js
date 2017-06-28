var path = require('path');

module.exports = {
  entry: [
    './src/index.js',
    './src/array.js',
    './src/barchart.js',
    './src/blurb.js',
    './src/linechart.js',
    './src/sanitize.js'
  ],
  output: {
    filename: 'charterflight.js',
    path: path.resolve(__dirname, 'dist')
  }
};
