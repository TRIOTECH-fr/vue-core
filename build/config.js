const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const config = require('../config')

module.exports = ['config/config.yml', 'config/parameters.yml'].reduce((carry, file) => {
  const filePath = path.join(process.cwd(), file)
  const data = fs.existsSync(filePath) ? yaml.safeLoad(fs.readFileSync(filePath, 'utf8')) : {}
  return Object.assign(carry, data)
}, config)
