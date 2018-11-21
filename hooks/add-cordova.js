#!/usr/bin/env node

module.exports = (ctx) => {
  console.log('Running: Adding root cordova script'); // eslint-disable-line no-console

  const fs = ctx.requireCordovaModule('fs');
  const path = ctx.requireCordovaModule('path');
  const deferred = ctx.requireCordovaModule('q').defer();
  const indexPath = path.join(ctx.opts.projectRoot, 'www/index.html');
  const cordovaScript = '</script><script type="text/javascript" src="cordova.js"></script>';

  fs.readFile(indexPath, 'utf-8', (readError, indexData) => {
    if (readError) {
      deferred.reject(readError);
    } else {
      if (indexData.indexOf(cordovaScript) === -1) {
        fs.writeFile(indexPath, indexData.replace(/<\/script>/, cordovaScript), 'utf-8', (writeError) => {
          if (writeError) {
            deferred.reject(writeError);
          } else {
            deferred.resolve();
          }
        });
      } else {
        deferred.resolve();
      }
    }
  });

  return deferred.promise;
};
