#!/bin/bash
clear
echo "Postdeploy start."
echo "Dependency update."
yarn
echo "Build static file in tmp folder."
yarn build
echo "Copy .web in tmp"
cp -R .web tmp
echo "Move web to old"
mv web old
echo "Move tmp to web"
mv tmp web
echo "Remove old"
rm -rf old
echo "Postdeploy success."
