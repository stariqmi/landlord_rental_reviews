var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    search: './public/js/main.js',
    reviews: './public/js/reviews.js'
  },
  output: {
    path: __dirname + '/public/js/',
    filename: '[name].bundle.js'
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
