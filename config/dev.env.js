const merge = require('webpack-merge')
const path = require('path')
const requires = require('../build/requires')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
}, requires.root(path.join('config', path.basename(__filename))))
