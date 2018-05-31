const UglifyJS = require('uglify-es')
const babel = require('babel-core')

module.exports = function (filePath) {
  const { code } = babel.transformFileSync(filePath)
  const result = UglifyJS.minify(code)
  if (result.error) return ''
  return result.code
}
