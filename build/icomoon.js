const fs = require('fs-extra')
const path = require('path')
const pipeline = require('icomoon-cli')
const {
  argv
} = require('yargs')
const rimraf = require('rimraf')

const log = (...args) => console.log('[icomoon]', ...args)
const icomoon = argv.d || argv.directory || 'icomoon'
const tmp = argv.t || argv.tmp || 'tmp'
const outputFontDir = argv.ofd || argv.outputFontDir || 'static/fonts'
const outputScssDir = argv.osd || argv.outputScssDir || 'src/scss'
const outputScssFile = argv.osf || argv.outputScssFile || '_icons.scss'
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
  whenFinished() {
    const name = selectionParameters.preferences.fontPref.metadata.fontFamily
    if (!fs.existsSync(outputFontDir)) {
      fs.mkdirSync(outputFontDir)
    }
    ['eot', 'svg', 'ttf', 'woff'].forEach((ext) => {
      fs.copyFileSync(`${tmp}/fonts/${name}.${ext}`, `${outputFontDir}/${name}.${ext}`)
    })
    log(`Successfully imported icomoon fonts in ${outputFontDir} folder`)

    if (!fs.existsSync(outputScssDir)) {
      fs.mkdirSync(outputScssDir)
    }
    const outputScssFilePath = path.join(outputScssDir, outputScssFile);
    fs.copyFileSync(`${tmp}/style.css`, outputScssFilePath);
    const outputScssFileContents = fs.readFileSync(outputScssFilePath, 'utf8');
    fs.writeFileSync(outputScssFilePath, outputScssFileContents.replace(/fonts/g, `/${outputFontDir}`), 'utf8');
    log(`Successfully imported icomoon stylesheet in ${outputScssFilePath} file`)

    rimraf.sync(tmp)
  }
})
