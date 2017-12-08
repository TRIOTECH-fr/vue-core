#!/bin/bash
clear
echo "Starting Postdeploy Script :"
echo "- Building app..."
node node_modules/@triotech/vue-core/build/build.js
echo "- Copying .web in tmp..."
rsync -r .web/ tmp
echo "- Moving web to old..."
mv web old
echo "- Moving tmp to web..."
mv tmp web
echo "- Removing old..."
rm -rf old
echo "Successfully ran Postdeploy script !"
