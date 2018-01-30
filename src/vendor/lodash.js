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
  defaultsDeepObj(baseObject = {}, baseBase = {}) {
    // eslint-disable-next-line arrow-body-style
    const addValue = (object = {}, base = {}) => {
      _.map(base, (currentObj, key) => {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          if (_.isObject(currentObj) && !(currentObj instanceof Blob)) {
            // Do not simplify by object[key] == object[key] || {} !
            if (_.isNull(object[key])) {
              object[key] = {};
            }
            addValue(object[key], currentObj);
          }
        } else {
          object[key] = null;
        }
      });
      return object;
    };
    return addValue(baseObject, baseBase);
  },
  differenceObj(baseObject = {}, baseBase = {}, keepIdentifier = false, identifier = 'id') {
    // eslint-disable-next-line arrow-body-style
    const changes = (object, base) => {
      return _.transform(object, (result, value, key) => {
        if (!_.isEqual(value, base[key]) || (keepIdentifier && key === identifier)) {
          result[key] = (_.isObject(value) && _.isObject(base[key] && !(value instanceof Blob)))
            ? changes(value, base[key])
            : value;
        }
      });
    };
    return changes(baseObject, baseBase);
  },
  clearModelForForm(baseModel = {}, BaseSchema = {}, modelTemp = {}, keepId = true, idKey = 'id') {
    const formatKey = (stack, key) => (stack ? `${stack}[${key}]` : key);
    let data = _.defaultsDeepObj(baseModel, modelTemp);
    const formFields = _.reduce(BaseSchema, (carry, field) => {
      carry.push(field.model);
      return carry;
    }, []);

    const clear = (obj, models, stack = '') => {
      _.map(obj, (value, key) => {
        const keyName = formatKey(stack, key);
        if (!formFields.includes(keyName) && (keepId && key !== idKey)) {
          if (_.isObject(value) && !_.isArray(value)) {
            clear(value, models, keyName);
          } else {
            delete obj[key];
          }
        }
      });
      return obj;
    };

    data = clear(data, formFields);
    return data;
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
