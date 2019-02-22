#!/bin/bash
clear
echo "Starting Postdeploy Script :"
echo "- Checking vendor dependencies..."
test -f node_modules/jpegtran-bin/vendor/jpegtran || node node_modules/jpegtran-bin/lib/install.js || exit 10
echo "- Updating config/parameters.yml file..."
node node_modules/@triotech/vue-core/build/parameters.js || exit 1
echo "- Building application..."
node node_modules/@triotech/vue-core/build/build.js || exit 2
echo "- Copying .web folder in tmp folder..."
rsync -r .web/ tmp || exit 3
[[ -d web ]] && (echo "- Moving web folder to old folder..." && mv web old || exit 4)
echo "- Moving tmp folder to web folder..."
mv tmp web || exit 5
[[ -d old ]] && (echo "- Removing old folder..." && rm -rf old || exit 6)
echo "Successfully ran Postdeploy script !"
