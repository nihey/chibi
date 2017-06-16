# Webpack Single Page Boilerplate

A boilerplate for a single page app using [webpack][webpack_link]

[![Build Status](https://travis-ci.org/nihey/react-single-page-boilerplate.svg?branch=master)](https://travis-ci.org/nihey/react-single-page-boilerplate)
[![Dependency Status](https://david-dm.org/nihey/react-single-page-boilerplate.png)](https://david-dm.org/nihey/react-single-page-boilerplate)

# Why should I use it

So far, this is the best way I found to build files like `index.html` into
[webpack][webpack_link]. This boilerplate handles Javascript, CSS and HTML
bundling using only [webpack][webpack_link].

# Usage

The general directory structure is:

```
.
├── assets
│   └── images
│       └── favicon.png
├── index.html
├── package.json
├── scripts
│   ├── config
│   │   ├── default.js
│   │   └── production.js
│   └── index.js
├── styles
│   └── index.scss
└── webpack.config.js
```

- Your javascript entry point is `scripts/index.js`
- Your style entry point is `styles/index.scss`
- `scripts/config` is the only folder that behaves in a different way:
```javascript
// Imports the content from 'config/default.js' by default.
// When running webpack with `NODE_ENV=production` it will import
// 'config/production.js'.
import Config from 'config';
```

# Commands

- `npm test` - Run ESLint tests
- `npm run watch` - Run a `webpack-dev-server`, serving the project under `http://localhost:8000`
- `npm run build` - Builds the project and output it to `dist/`
- `npm run production` - Builds the project on production mode and output it to `dist/`

# About

This boilerplate includes the following loaders:

  - `babel-loader`: Enable ES6 features.
  - `file-loader`: Call `require` for binary files.
  - `img-loader`: Optimize image compression.
  - `json-loader`: Call `require` for `json` files.
  - `sass-loader`: Style your pages with [Sass](http://sass-lang.com/).
  - `css-loader`: Enables importing of CSS files

It also includes the following plugins:

  - `extract-text-webpack-plugin`: Extract CSS and HTML text from bundled styles and HTML.

# License

This code is released under
[CC0](http://creativecommons.org/publicdomain/zero/1.0/) (Public Domain)

[webpack_link]: http://webpack.js.org/
