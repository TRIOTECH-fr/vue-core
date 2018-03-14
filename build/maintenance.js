const fs = require('fs')
const os = require('os')
const path = require('path')
const readline = require('readline')

const file = path.join(__dirname, '..', 'web/.htaccess')
const maintenance = process.argv.length > 2 ? process.argv[2].toLowerCase() === 'on' : true
const reader = readline.createInterface({
  input: fs.createReadStream(file)
})

let found = false
let htaccess = ''

reader.on('line', (line) => {
  if (line.indexOf('End Maintenance') !== -1) {
    found = false
  }
  if (found) {
    line = line.substr(0, 2) + (maintenance ? ' ' : '#') + line.substr(3)
  }
  if (line.indexOf('Start Maintenance') !== -1) {
    found = true
  }
  htaccess += line + os.EOL
}).on('close', () => {
  fs.writeFileSync(file, htaccess)
})
