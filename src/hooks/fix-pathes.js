#!/usr/bin/env node

const searchAndReplaceFileInDirectory = (fs, dirPath, matching, search, replace) => new Promise((resolve, reject) => {
  fs.readdir(dirPath, (readdirError, files) => {
    if (readdirError) {
      reject(readdirError);
    } else {
      files.forEach((file) => {
        if (file.match(new RegExp(matching))) {
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
        }
      });
    }
  });
});

module.exports = (ctx) => {
  const fs = ctx.requireCordovaModule('fs');
  const path = ctx.requireCordovaModule('path');
  const deferred = ctx.requireCordovaModule('q').defer();
  const projectRoot = ctx.opts.projectRoot;

  Promise.all([
    searchAndReplaceFileInDirectory(fs, path.join(projectRoot, 'www'), 'index\\.html', '=/', '='),
    searchAndReplaceFileInDirectory(fs, path.join(projectRoot, 'www/static/js'), 'app\\.[\\w]*\\.js$', '/static/', 'static/'),
    searchAndReplaceFileInDirectory(fs, path.join(projectRoot, 'www/static/css'), 'app\\.[\\w]*\\.css$', '/static/', '../'),
  ]).then(deferred.resolve).catch(deferred.reject);

  return deferred.promise;
};
