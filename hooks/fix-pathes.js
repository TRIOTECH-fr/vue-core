#!/usr/bin/env node

const searchAndReplace = (fs, dirPath, search, replace, file) => new Promise((resolve, reject) => {
  const filePath = `${dirPath}/${file}`;
  console.log(`Running: Replacing ${search} with ${replace} in ${filePath}`);
  fs.readFile(filePath, 'utf-8', (readError, data) => {
    if (readError) {
      reject(readError);
    }
    fs.writeFile(filePath, data.replace(new RegExp(search, 'g'), replace), 'utf-8', (writeError) => {
      if (writeError) {
        reject(writeError);
      } else {
        resolve();
      }
    });
  });
});

const searchAndReplaceFileInDirectory = (fs, dirPath, matching, search, replace) => new Promise((resolve, reject) => {
  fs.readdir(dirPath, (readdirError, files) => {
    if (readdirError) {
      reject(readdirError);
    } else {
      const matchingFiles = files.filter(file => file.match(new RegExp(matching)));
      if (matchingFiles.length === 0) {
        resolve();
      } else {
        const promises = matchingFiles.map(searchAndReplace.bind(null, fs, dirPath, search, replace));
        Promise.all(promises).then(resolve).catch(reject);
      }
    }
  });
});

module.exports = (ctx) => {
  const fs = ctx.requireCordovaModule('fs');
  const path = ctx.requireCordovaModule('path');
  const deferred = ctx.requireCordovaModule('q').defer();
  const { projectRoot } = ctx.opts;

  Promise.all([
    searchAndReplaceFileInDirectory(fs, path.join(projectRoot, 'www'), 'index\\.html', '=/', '='),
    searchAndReplaceFileInDirectory(fs, path.join(projectRoot, 'www/static/js'), '(app|vendor)\\.[\\w]*\\.js$', '/static/', 'static/'),
    searchAndReplaceFileInDirectory(fs, path.join(projectRoot, 'www/static/css'), '(app|vendor)\\.[\\w]*\\.css$', '/static/', '../'),
  ]).then(deferred.resolve).catch(deferred.reject);

  return deferred.promise;
};
