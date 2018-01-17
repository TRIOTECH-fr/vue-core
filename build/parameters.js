'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const _ = require('lodash');

const defaults = yaml.safeLoad(fs.readFileSync('./config/parameters.yml.dist', 'utf8'));
const exists = fs.existsSync('./config/parameters.yml');
let parameters = exists ? yaml.safeLoad(fs.readFileSync('./config/parameters.yml', 'utf8')) : {};

// derived from https://gist.github.com/Yimiprod/7ee176597fef230d1451
const Y = f => (...args) => f(Y(f))(...args);
const diff = Y(f => (object, base) => {
  return _.transform(object, (result, value, key) => {
    if (!_.isEqual(value, base[key])) {
      if (_.isObject(value) && _.isObject(base[key])) {
        result[key] = f(value, base[key]);
      } else {
        result[key] = base[key] || value;
      }
    }
  });
});

fs.writeFileSync('./config/parameters.yml', yaml.safeDump(_.merge(parameters, diff(defaults, parameters))));
