#!/usr/bin/env node

module.exports = (ctx) => {
  console.log('Running: Configuring android:windowSoftInputMode');

  const fs = ctx.requireCordovaModule('fs');
  const path = ctx.requireCordovaModule('path');
  const deferred = ctx.requireCordovaModule('q').defer();
  const manifestPath = path.join(ctx.opts.projectRoot, 'platforms/android', 'AndroidManifest.xml');

  if (fs.existsSync(manifestPath)) {
    const manifest = fs.readFileSync(manifestPath, 'utf8').replace(/(android:windowSoftInputMode=").*?(")/, '$1adjustPan|adjustResize$2');
    fs.writeFileSync(manifestPath, manifest, 'utf8');
    deferred.resolve();
  } else {
    deferred.reject(new Error('Could not find AndroidManifest to set android:windowSoftInputMode'));
  }

  return deferred.promise;
};
