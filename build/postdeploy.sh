#!/bin/bash
clear
echo "Starting Postdeploy Script :"
#TODO instead of simple copy, handle differences
echo "- Copying parameters.yml.dist to parameters.yml"
cp config/parameters.yml.dist config/parameters.yml
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
