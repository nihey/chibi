var webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    path = require('path');

var cssExtractTextPlugin = new ExtractTextPlugin('[name].css');
var htmlExtractTextPlugin = new ExtractTextPlugin('[name].html');
var images = require('./utils/images');

module.exports = {
  devServer: {
    port: 8000,
    historyApiFallback: true,
  },

  entry: {
    'script': './scripts/index.jsx',
    'style': './styles/index.scss',
  },

  module: {
    rules: [
      { test: /\.json$/, loader: 'json-loader'},
      { test: /\.jsx?$/, exclude: /(node_modules|bower_components)\//, loader: 'babel-loader'},
      { test: /\.(ttf.*|eot.*|woff.*|ogg|mp3)$/, loader: 'file-loader'},
      { test: /.(png|jpe?g|gif|svg.*)$/, loader: 'file-loader'},
      {
        test: /\.css$/,
        loader: cssExtractTextPlugin.extract('css-loader'),
      },
      {
        test: /\.scss$/,
        loader: cssExtractTextPlugin.extract('css-loader!sass-loader'),
      },
    ],
  },

  plugins: [
    htmlExtractTextPlugin,
    cssExtractTextPlugin,
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'default'),
      Environment: JSON.stringify(images),
    }),
  ],

  resolve: {
    extensions: ['.js', '.json', '.jsx'],
    modules: [
      path.resolve(__dirname, 'scripts'),
      path.resolve(__dirname, 'node_modules'),
    ],
    alias: {
      assets: path.resolve(__dirname, 'assets/'),
      config$: 'config/' + (process.env.NODE_ENV || 'default') + '.js',
    },
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
};
