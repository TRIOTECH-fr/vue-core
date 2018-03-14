const fs = require('fs')
const yaml = require('js-yaml')
const _ = require('lodash')
const Y = require('../src/lib/helper/y')

const defaults = yaml.safeLoad(fs.readFileSync('./config/parameters.yml.dist', 'utf8'))
const exists = fs.existsSync('./config/parameters.yml')
const parameters = exists ? yaml.safeLoad(fs.readFileSync('./config/parameters.yml', 'utf8')) : {}

// derived from https://gist.github.com/Yimiprod/7ee176597fef230d1451
const diff = Y(f => (object, base) => _.transform(object, (result, value, key) => {
  if (!_.isEqual(value, base[key])) {
    if (_.isObject(value) && _.isObject(base[key])) {
      result[key] = f(value, base[key])
    } else {
      result[key] = base[key] || value
    }
  }
}))

fs.writeFileSync('./config/parameters.yml', yaml.safeDump(_.merge(parameters, diff(defaults, parameters))))
