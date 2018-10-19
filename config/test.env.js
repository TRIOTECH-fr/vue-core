const merge = require('webpack-merge')
const path = require('path')
const requires = require('../build/requires')
const devEnv = require('./dev.env');

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
}, requires.root(path.join('config', path.basename(__filename))))
