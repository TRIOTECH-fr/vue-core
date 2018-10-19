'use strict'
const path = require('path');

exports.root = function (filename, fallback = {}) {
  let data = null;

  try {
    data = require(path.resolve(process.cwd(), filename))
  } catch (err) {
    data = fallback;
  }
  return data;
}
