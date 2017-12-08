import Lodash from 'lodash';

Lodash.mixin({
  encode: string => encodeURIComponent(string),
  param(object) {
    return _.reduce(object, (carry, value, key) => `${carry}&${this.encode(key)}=${this.encode(value)}`, '').replace('&', '?');
    // return object && `?${Object.keys(object)
    //   .map(key => `${this.encode(key)}=${this.encode(object[key])}`)
    //   .join('&')}`;
  },
});

export default window._ = Lodash;
