// see http://vuejs-templates.github.io/webpack for documentation.
const path = require('path');

module.exports = {
  dev: {
    host: '0.0.0.0', // can be overwritten by process.env.HOST
    port: 3000, // can be overwritten by process.env.HOST, if port is in use, a free one will be determined

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},

    // Various Dev Server settings
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: true, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warings will be shown in the console.
    useEslint: true,

    // If true, eslint errors and warings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
  },
  build: {
    // Template for index.html
    index: path.resolve(process.cwd(), 'tmp/index.html'),

    // Paths
    assetsRoot: path.resolve(process.cwd(), 'tmp'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report === 'true',
  },
};
