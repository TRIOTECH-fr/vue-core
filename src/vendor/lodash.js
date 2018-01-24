import Vue from 'vue';
import _ from 'lodash';

Vue.set(Vue.prototype, '_', _);

_.mixin({
  encode: string => encodeURIComponent(string),
  param(object) {
    return _.reduce(object, (carry, value, key) => `${carry}&${this.encode(key)}=${this.encode(value)}`, '').replace('&', '?');
  },
  args(array) {
    return _.reduce(array, (carry, arg, index, args) => _.extend(carry, index % 2 === 1 && {[args[index - 1]]: arg}), {});
  },
  form($t, fields) {
    return _.each(fields, (field) => {
      // TODO https://github.com/vue-generators/vue-form-generator/issues/352
      field.label = $t(field.label);
      field.placeholder = $t(field.placeholder);

      if (field.choices !== undefined) {
        _.each(field.choices, (choice) => {
          if (choice.label !== undefined) {
            choice.label = $t(choice.label);
          }
          if (choice.name !== undefined) {
            choice.name = $t(choice.name);
          }
        });
      }
    });
  },
});

export default window._ = _;
