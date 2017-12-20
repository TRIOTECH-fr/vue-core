import Lodash from 'lodash';

Lodash.mixin({
  encode: string => encodeURIComponent(string),
  param(object) {
    return _.reduce(object, (carry, value, key) => `${carry}&${this.encode(key)}=${this.encode(value)}`, '').replace('&', '?');
  },
});

export default window._ = Lodash;
