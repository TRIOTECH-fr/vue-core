import Vue from 'vue';
import _ from 'lodash';
import moment from 'moment';

import router from '../../vendor/lodash/router';
import transforms from '../../vendor/lodash/transforms';
import types from '../../vendor/lodash/types';

const Y = f => (...args) => f(Y(f))(...args);

_.mixin({
  access: (object, key, defaults) => object[key] || _.extend(object, { [key]: defaults })[key],
  encode: string => window.encodeURIComponent(string),
  expired: time => (moment() - time) / 1000 > 0,
  param(object) {
    return _.reduce(object, (carry, value, key) => `${carry}&${this.encode(key)}=${this.encode(value)}`, '').replace('&', '?');
  },
  args(array) {
    return _.reduce(array, (carry, arg, index, args) => _.extend(carry, index % 2 === 1 && { [args[index - 1]]: arg }), {});
  },
  flatTree(tree = [], key = 'id') {
    const stack = tree;
    const array = [];
    const hashMap = {};
    while (stack.length > 0) {
      const node = stack.pop();
      if (!hashMap[node[key]]) {
        hashMap[node[key]] = true;
        array.push(node);
      }
      if (node.children.length > 0) {
        for (let i = node.children.length - 1; i >= 0; i -= 1) {
          stack.push(node.children[i]);
        }
      }
    }

    return array;
  },
  ...router,
  ...transforms,
  ...types,
  Y,
}).noConflict();

Vue.set(Vue.prototype, '_', _);

export default _;
