const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// eslint-disable-next-line import/no-extraneous-dependencies
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCssnanoPlugin = require('@intervolga/optimize-cssnano-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const PrerenderSpaPlugin = require('prerender-spa-plugin')

const utils = require('./utils')
const requires = require('./requires')
const loadMinified = require('./load-minified')
const baseWebpackConfig = require('./webpack.base.conf')
const config = require('./config')
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

const env = process.env.NODE_ENV === 'testing' ?
  require('../config/test.env') :
  require('../config/prod.env')

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js')
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: config.build.productionSourceMap,
        terserOptions: {
          mangle: {
            safari10: true
          }
        },
        extractComments: true
      }),
      new OptimizeCssnanoPlugin({
        sourceMap: config.build.productionSourceMap,
        cssnanoOptions: {
          preset: 'default',
          discardComments: {
            removeAll: true
          }
        }
      })
    ]
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // extract css into its own file
    new MiniCSSExtractPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      title: config.title,
      filename: process.env.NODE_ENV === 'testing' ? 'index.html' : config.build.index,
      template: 'index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency',
      serviceWorkerLoader: `<script>${loadMinified(path.join(__dirname,
        'service-worker-prod.js'))}</script>`
    }),
    // copy custom static assets
    new CopyWebpackPlugin([{
      from: path.resolve(process.cwd(), config.build.assetsSubDirectory),
      to: config.build.assetsSubDirectory,
      ignore: ['.*']
    }, {
      from: path.join(__dirname, './service-worker-extra.js'),
      to: path.join(config.build.assetsSubDirectory, 'js'),
    }]),
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i
    }),
    // service worker caching
    new SWPrecacheWebpackPlugin({
      cacheId: 'vue-core',
      dontCacheBustUrlsMatching: /\.(\w{7}|\w{20})\./,
      mergeStaticsConfig: true,
      staticFileGlobsIgnorePatterns: [/\.map$/],
      maximumFileSizeToCacheInBytes: 5242880,
      minify: true,
      stripPrefix: 'web/',
      importScripts: [
        path.join(config.build.assetsSubDirectory, 'js', 'service-worker-extra.js'),
      ],
    })
    // modules intermediate caching step
    // new HardSourceWebpackPlugin()
  ]
}, requires.root(path.join('build', path.basename(__filename))))

const routes = config.prerender || []
if (process.env.NO_PRERENDER === undefined && routes.length > 0) {
  webpackConfig.plugins.push(
    // seo prerending
    new PrerenderSpaPlugin({
      staticDir: config.build.assetsRoot,
      routes
    })
  )
}

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      algorithm: 'gzip',
      test: new RegExp(`\\.(${config.build.productionGzipExtensions.join('|')})$`),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const {
    BundleAnalyzerPlugin
  } = require('webpack-bundle-analyzer')
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
