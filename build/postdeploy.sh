#!/bin/bash
clear
echo "Starting Postdeploy Script :"
echo "- Updating config/parameters.yml file..."
node node_modules/@triotech/vue-core/build/parameters.js
echo "- Building application..."
node node_modules/@triotech/vue-core/build/build.js
echo "- Copying .web folder in tmp folder..."
rsync -r .web/ tmp
echo "- Moving web folder to old folder..."
mv web old
echo "- Moving tmp folder to web folder..."
mv tmp web
echo "- Removing old folder..."
rm -rf old
echo "Successfully ran Postdeploy script !"
