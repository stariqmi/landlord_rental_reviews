var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './public/js/main.js',
  output: {
    // publicPath: 'http://localhost:8080/assets/',
    path: __dirname + '/public/js/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  watch: true
};
