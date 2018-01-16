#!/usr/bin/env node

module.exports = (ctx) => {
  console.log('Running: Fixing publicPath by removing leading slash');

  const fs = ctx.requireCordovaModule('fs');
  const path = ctx.requireCordovaModule('path');
  const deferred = ctx.requireCordovaModule('q').defer();
  const indexPath = path.join(ctx.opts.projectRoot, 'www/index.html');

  fs.readFile(indexPath, 'utf-8', (readError, indexData) => {
    if (readError) {
      deferred.reject(readError);
    }
    fs.writeFile(indexPath, indexData.replace(/=\//g, '='), 'utf-8', (writeError) => {
      if (writeError) {
        deferred.reject(writeError);
      } else {
        deferred.resolve();
      }
    });
  });

  return deferred.promise;
};
