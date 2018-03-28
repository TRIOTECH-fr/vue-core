import Vue from 'vue';
import _ from 'lodash';
import moment from 'moment';
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
  propsValidator(component, route) {
    const params = { ...route.params };
    return _.transform(params, (carry, prop, key) => {
      if (!_.isArray(component.props[key].type) && !(prop instanceof component.props[key].type)) {
        carry[key] = component.props[key].type(prop);
      }
      return carry;
    }, params);
  },
  ...transforms,
  ...types,
  Y,
});

Vue.set(Vue.prototype, '_', _);

export default window._ = _;
