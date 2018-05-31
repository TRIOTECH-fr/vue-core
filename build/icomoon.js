const fs = require('fs')
const pipeline = require('icomoon-cli')
const { argv } = require('yargs')

const icomoon = argv.d || argv.directory || 'icomoon'
const tmp = argv.t || argv.output || 'tmp'
const selection = argv.s || argv.selection || 'selection.json'
const visible = argv.v || argv.visible || false
const options = {
  icons: [],
  names: [],
  selectionPath: `${icomoon}/${selection}`,
  outputDir: tmp,
  visible,
  forceOverride: true
};

((directory) => {
  fs.readdirSync(directory).forEach((file) => {
    const matches = file.match(/(.*)\.svg$/)
    if (matches !== null) {
      options.icons.push(`${directory.replace(/\/$/, '')}/${file}`)
      options.names.push(matches[1])
    }
  })
})(icomoon)

console.log(`[icomoon] Detected ${options.icons.length} icon(s) from ${icomoon} folder`)

pipeline({
  ...options,
  whenFinished (result) {
    ['eot', 'svg', 'ttf', 'woff'].forEach((ext) => {
      fs.copyFileSync(`${tmp}/fonts/icomoon.${ext}`, `static/fonts/icomoon.${ext}`)
    })
    fs.copyFileSync(`${tmp}/style.css`, 'src/scss/_icons.scss')
    fs.unlinkSync(tmp)
  }
})
