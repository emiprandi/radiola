'use strict';

var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var PATHS = {
  src: path.resolve(__dirname, 'src'),
  build: path.resolve(__dirname, 'build')
};

var config = {
  entry: PATHS.src + '/App.js',
  output: {
    path: PATHS.build,
    filename: 'js/radiola.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: PATHS.src + '/index.html',
      hash: true
    }),
    new HtmlWebpackPlugin({
      filename: 'callback.html',
      template: PATHS.src + '/callback.html',
      inject: false
    }),
    new ExtractTextPlugin('css/radiola.css', {
      allChunks: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]')
      },
      {
        test: /\.png$/,
        loader: 'url-loader?mimetype=image/png'
      }
    ]
  }
};

module.exports = config;
