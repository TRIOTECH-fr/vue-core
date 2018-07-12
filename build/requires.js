'use strict'

exports.rootBuild = function (filename, fallback = {}) {
  let build = null;
  try {
    build = require(`../../../../build/${filename}`)
  } catch (err) {
    build = fallback;
  }
  return build;
}
