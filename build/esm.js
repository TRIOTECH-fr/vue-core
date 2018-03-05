const fs = require('fs')
const rollup = require('rollup')
const path = require('path')

const config = {
  input: path.resolve('src/lib/core/app.js'),
  output: {
    format: 'es',
    file: path.resolve('dist/vue-core.esm.js')
  }
}

rollup.rollup(config).then(bundle => bundle.generate(config.output)).then(({ code }) => {
  fs.writeFileSync(config.output.file, code, 'utf8')
}).catch(console.error)
