const fs = require('fs')
const yaml = require('js-yaml')
const _ = require('lodash')

// TODO SyntaxError: Unexpected token export
// const Y = require('../src/lib/helper/y')

const Y = f => (...args) => f(Y(f))(...args)
const parametersDistPath = './config/parameters.yml.dist'
const parametersPath = parametersDistPath.replace('.dist', '')
const encoding = 'utf8'

const defaults = yaml.safeLoad(fs.readFileSync(parametersDistPath, encoding))
const exists = fs.existsSync(parametersPath)
const parameters = exists ? yaml.safeLoad(fs.readFileSync(parametersPath, encoding)) : {}

fs.writeFileSync(parametersPath, yaml.safeDump(_.merge(parameters, Y(f => (object, base) => _.transform(object, (result, value, key) => {
  if (!_.isEqual(value, base[key])) {
    result[key] = _.isObject(value) && _.isObject(base[key]) ? f(value, base[key]) : base[key] || value
  }
}))(defaults, parameters))))
