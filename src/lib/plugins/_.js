import Vue from 'vue';
import _ from 'lodash';

import alias from '../../vendor/lodash/alias';
import base from '../../vendor/lodash/base';
import router from '../../vendor/lodash/router';
import transforms from '../../vendor/lodash/transforms';
import types from '../../vendor/lodash/types';

const Y = f => (...args) => f(Y(f))(...args);

_.mixin({
  ...alias,
  ...base,
  ...router,
  ...transforms,
  ...types,
  Y,
});

Vue.set(Vue.prototype, '_', _);

export default _;
