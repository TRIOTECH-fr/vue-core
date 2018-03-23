#!/usr/bin/env node

function isAndroidStudioProject(root, fs, path) {
  const eclipseFiles = ['AndroidManifest.xml', 'libs', 'res'];
  const androidStudioFiles = ['app', 'app/src/main'];

  let isEclipse = false;
  let isAS = true;

  if (!fs.existsSync(root)) {
    throw new Error(`AndroidStudio.js:inAndroidStudioProject root does not exist: ${root}`);
  }

  eclipseFiles.forEach((file) => {
    if (fs.existsSync(path.join(root, file))) {
      isEclipse = true;
    }
  });

  if (!isEclipse) {
    androidStudioFiles.forEach((file) => {
      if (!fs.existsSync(path.join(root, file))) {
        isAS = false;
      }
    });
  }

  return (!isEclipse && isAS);
}

module.exports = (ctx) => {
  console.log('Running: Configuring android:windowSoftInputMode');

  const fs = ctx.requireCordovaModule('fs');
  const path = ctx.requireCordovaModule('path');
  const deferred = ctx.requireCordovaModule('q').defer();
  const projectRoot = path.join(ctx.opts.projectRoot, 'platforms/android');
  const manifestPath = path.join(projectRoot, isAndroidStudioProject(projectRoot, fs, path) ? 'app/src/main/' : '', 'AndroidManifest.xml');

  if (fs.existsSync(manifestPath)) {
    const manifest = fs.readFileSync(manifestPath, 'utf8').replace(/(android:windowSoftInputMode=").*?(")/, '$1stateHidden|adjustResize$2');
    fs.writeFileSync(manifestPath, manifest, 'utf8');
    deferred.resolve();
  } else {
    deferred.reject(new Error('Could not find AndroidManifest to set android:windowSoftInputMode'));
  }

  return deferred.promise;
};
