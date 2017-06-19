var fs = require('fs');
var gracefulFs = require('graceful-fs');
gracefulFs.gracefulify(fs);

var path = require('path');
var webpack = require('webpack');

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractHTML = new ExtractTextPlugin('index.html');
var extractCSS = new ExtractTextPlugin('style.css');

let readDir = function(dirPath) {
  return fs.readdirSync('assets/images/creator/' + dirPath).map(f => f.split('.')[0]);
};

let parseDir = function(dirPath) {
  files = readDir(dirPath);
  let parsed = {};
  files.forEach(function(file) {
    let key = file.replace(/_back|_front/g, '');
    parsed[key] = parsed[key] || {};

    // Back part
    if (file.match(/_back/)) {
      parsed[key].back = file;
      return;
    }

    parsed[key].front = file;
  });

  return Object.keys(parsed).map(k => parsed[k]);
};

var config = {
  devServer: {
    port: 8000,
    historyApiFallback: true,
  },

  resolve: {
    modules: [path.resolve(__dirname, 'scripts'), path.resolve(__dirname, 'node_modules')],
    extensions: ['.js', '.json', '.jsx'],
    alias: {
      assets: path.resolve(__dirname, 'assets/'),
      config$: 'config/' + (process.env.NODE_ENV || 'default') + '.js',
    },
  },

  entry: {
    'script': path.resolve(__dirname, 'scripts/index.jsx'),
    'style': path.resolve(__dirname, 'styles/index.scss'),
    'index': path.resolve(__dirname, 'index.html'),
  },

  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.html$/,
        use: extractHTML.extract({
          use: ['html-loader?attrs=link:href'],
        }),
      },
      {
        test: /\.scss$/,
        use: extractCSS.extract({
          use: ['css-loader', 'sass-loader'],
        }),
      },
      {
        test: /\.css$/,
        use: extractCSS.extract({
          use: ['css-loader'],
        }),
      },
      {
        test: /\.jsx$/,
        use: ['babel-loader'],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)\//,
        use: ['babel-loader'],
      },
      {
        test: /\.json$/,
        use: ['json-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg.*)$/,
        use: [{
          loader: 'file-loader',
          query: {useRelativePath: false},
        }],
      },
      {
        test: /\.(ttf.*|eot.*|woff.*|ogg|mp3)$/,
        use: [{
          loader: 'file-loader',
          query: {useRelativePath: false},
        }],
      },
    ],
  },

  plugins: [
    extractHTML,
    extractCSS,
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'default'),
      Environment: JSON.stringify({
        base: {
          male: parseDir('base/male'),
          female: parseDir('base/female'),
        },
        hair: {
          male: parseDir('hair/male'),
          female: parseDir('hair/female'),
        },
        'hair-front': {
          male: parseDir('hair-front/male'),
          female: parseDir('hair-front/female'),
        },
        'hair-back': {
          male: parseDir('hair-back/male'),
          female: parseDir('hair-back/female'),
        },
        body: {
          male: parseDir('body/male'),
          female: parseDir('body/female'),
        },
        armor: {
          unissex: parseDir('armor/unissex'),
        },
        accessory: {
          unissex: parseDir('accessory/unissex'),
          male: parseDir('accessory/male'),
          female: parseDir('accessory/female'),
        },
        mantle: {
          unissex: parseDir('mantle/unissex'),
        },
        wing: {
          unissex: parseDir('wing/unissex'),
        },
      }),
    }),
  ],
};

if (process.env.NODE_ENV !== 'production') {
  config['devtool'] = 'source-map';
}

module.exports = config;
