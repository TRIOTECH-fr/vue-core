const fs = require('fs-extra')
const path = require('path')
const pipeline = require('icomoon-cli')
const { argv } = require('yargs')
const rimraf = require('rimraf')

const log = (...args) => console.log('[icomoon]', ...args)
const icomoon = argv.d || argv.directory || 'icomoon'
const tmp = argv.t || argv.tmp || 'tmp'
const outputFont = argv.o || argv.output || 'static/fonts'
const outputScss = argv.o || argv.output || 'src/scss'
const selection = argv.s || argv.selection || 'selection.json'
const visible = argv.v || argv.visible || false
const options = {
  icons: [],
  names: [],
  selectionPath: `${icomoon}/${selection}`,
  outputDir: tmp,
  visible,
  forceOverride: true
}
const absoluteSelectionPath = path.resolve(process.env.PWD, options.selectionPath)
const selectionParameters = fs.readJSONSync(absoluteSelectionPath)

;((directory) => {
  fs.readdirSync(directory).forEach((file) => {
    const matches = file.match(/(.*)\.svg$/)
    if (matches !== null) {
      options.icons.push(`${directory.replace(/\/$/, '')}/${file}`)
      options.names.push(matches[1])
    }
  })
})(icomoon)

log(`Detected ${options.icons.length} icon(s) from ${icomoon} folder`)

pipeline({
  ...options,
  whenFinished (result) {
    const name = selectionParameters.preferences.fontPref.metadata.fontFamily
    if (!fs.existsSync(outputFont)) {
      fs.mkdirSync(outputFont)
    }
    ['eot', 'svg', 'ttf', 'woff'].forEach((ext) => {
      fs.copyFileSync(`${tmp}/fonts/${name}.${ext}`, `${outputFont}/${name}.${ext}`)
    })
    log(`Successfully imported icomoon fonts in ${outputFont} folder`)

    if (!fs.existsSync(outputScss)) {
      fs.mkdirSync(outputScss)
    }
    fs.copyFileSync(`${tmp}/style.css`, `${outputScss}/_icons.scss`)
    log(`Successfully imported icomoon style in ${outputScss} folder`)

    rimraf.sync(tmp)
  }
})
