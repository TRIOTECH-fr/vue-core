const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
// eslint-disable-next-line import/no-extraneous-dependencies
const portfinder = require('portfinder')

const utils = require('./utils')
const requires = require('./requires')
const babelLoader = require('./babel-loader')
const baseWebpackConfig = require('./webpack.base.conf')
const config = require('./config')

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  cache: true,
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap
    })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-source-map',
  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    hot: true,
    host: process.env.HOST || config.dev.host,
    port: process.env.PORT || config.dev.port,
    disableHostCheck: true,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay ? {
      warnings: false,
      errors: true
    } : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: process.env.POLL || config.dev.poll
    },
    historyApiFallback: {
      index: config.dev.assetsPublicPath,
      disableDotRule: true
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      title: config.title,
      filename: 'index.html',
      template: 'index.html',
      serviceWorkerLoader: `<script>${babelLoader(path.join(__dirname, 'service-worker-dev.js'))}</script>`
    })
  ]
}, requires.root(path.join('build', path.basename(__filename))))

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${require(path.join(process.cwd(), 'package.json')).name}.localhost:${port}`]
        },
        onErrors: config.dev.notifyOnErrors
          ? utils.createNotifierCallback() : console.log
      }))

      resolve(devWebpackConfig)
    }
  })
})
