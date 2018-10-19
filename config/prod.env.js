const merge = require('webpack-merge')
const path = require('path')
const requires = require('../build/requires')

module.exports = merge({
  NODE_ENV: '"production"',
}, requires.root(path.join('config', path.basename(__filename))))
