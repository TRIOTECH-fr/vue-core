const fs = require('fs');
const _ = require('lodash');
const pipeline = require('icomoon-cli');

const args = _.reduce(process.argv.slice(2), (carry, arg, index, args) => _.extend(carry, index % 2 === 1 && { [args[index - 1]]: arg }), {});
const icomoon = args['-d'] || args['-directory'] || 'icomoon';
const tmp = args['-t'] || args['-output'] || 'tmp';
const selection = args['-s'] || args['-selection'] || 'selection.json';
const options = {
  icons: [],
  names: [],
  selectionPath: `${icomoon}/${selection}`,
  outputDir: tmp,
  forceOverride: true,
};

((directory) => {
  fs.readdirSync(directory).forEach((file) => {
    if ((matches = file.match(/(.*)\.svg$/)) !== null) {
      options.icons.push(`${directory.replace(/\/$/, '')}/${file}`);
      options.names.push(matches[1]);
    }
  });
})(icomoon);

console.log(`[icomoon] Detected ${options.icons.length} icon(s) from ${icomoon} folder`);

pipeline({
  ...options,
  whenFinished(result) {
    ['eot', 'svg', 'ttf', 'woff'].forEach((ext) => {
      fs.copyFileSync(`${tmp}/fonts/icomoon.${ext}`, `static/fonts/icomoon.${ext}`);
    });
    fs.copyFileSync(`${tmp}/style.css`, 'src/scss/_icons.scss');
    fs.unlinkSync(tmp);
  },
});
