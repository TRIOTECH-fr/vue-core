import Vue from 'vue';
import _ from 'lodash';
import moment from 'moment';
import Y from './y';

_.mixin({
  access: (object, key, defaults) => object[key] || _.extend(object, { [key]: defaults })[key],
  encode: string => encodeURIComponent(string),
  param(object) {
    return _.reduce(object, (carry, value, key) => `${carry}&${this.encode(key)}=${this.encode(value)}`, '').replace('&', '?');
  },
  args(array) {
    return _.reduce(array, (carry, arg, index, args) => _.extend(carry, index % 2 === 1 && { [args[index - 1]]: arg }), {});
  },
  isBlob: value => value instanceof Blob,
  expired: time => (moment() - time) / 1000 > 0,
  dataUriToBlob(string) {
    const [header, base64] = string.split(',');
    return this.base64ToBlob(base64, header.replace('data:', '').replace(';base64', ''));
  },
  stringToArrayBuffer(string) {
    const stringLength = string.length;
    const buffer = new ArrayBuffer(stringLength * 2);
    const view = new Uint16Array(buffer);

    for (let i = 0; i < stringLength; i += 1) {
      view[i] = string.charCodeAt(i);
    }

    return buffer;
  },
  arrayBufferToString(buffer) {
    let string = '';
    const view = new Uint16Array(buffer);

    for (let i = 0; i < view.length; i += 1) {
      string += String.fromCharCode(view[i]);
    }

    return string;
  },
  blobToBase64(blob) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  },
  base64ToBlob(string, type = 'image/jpeg') {
    const bytes = window.atob(string);
    const bytesLength = bytes.length;
    const view = new Uint8Array(new ArrayBuffer(bytesLength));

    for (let i = 0; i < bytesLength; i += 1) {
      view[i] = bytes.charCodeAt(i);
    }

    return new Blob([view], { type });
  },
  objectURL(string) {
    return window.URL.createObjectURL(string.slice(0, 5) === 'data:' ? this.dataUriToBlob(string) : this.base64ToBlob(string));
  },
  defaultsDeepObj(...args) {
    return Y(next => (object = {}, base = {}) => {
      _.map(base, (currentObj, key) => {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          if (_.isObject(currentObj) && !(currentObj instanceof Blob)) {
            // Do not simplify by object[key] == object[key] || {} !
            if (_.isNull(object[key])) {
              object[key] = {};
            }
            next(object[key], currentObj);
          }
        } else {
          object[key] = null;
        }
      });
      return object;
    })(...args);
  },
  differenceObj(baseObject = {}, baseBase = {}, keepIdentifier = false, identifier = 'id') {
    // eslint-disable-next-line arrow-body-style
    return Y(next => (object = {}, base = {}) => {
      return _.transform(object, (result, value, key) => {
        if (!_.isEqual(value, base[key]) || (keepIdentifier && key === identifier)) {
          result[key] = (_.isObject(value) && _.isObject(base[key] && !(value instanceof Blob)))
            ? next(value, base[key])
            : value;
        }
      });
    })(baseObject, baseBase);
  },
  clearModelForForm(baseModel = {}, baseSchema = {}, modelTemp = {}, keepId = true, idKey = 'id') {
    const format = (stack, key) => (stack ? `${stack}[${key}]` : key);
    const formFields = _.reduce(baseSchema, (carry, field) => {
      carry.push(field.model);
      return carry;
    }, keepId ? [idKey] : []);

    return Y(callback => (obj, models, stack = '') => {
      _.map(obj, (value, key) => {
        const keyName = format(stack, key);
        if (!formFields.includes(keyName)) {
          if (_.isObject(value) && !_.isArray(value)) {
            callback(value, models, keyName);
          } else {
            delete obj[key];
          }
        }
      });
      return obj;
    })(_.defaultsDeepObj(baseModel, modelTemp), formFields);
  },
  form($t, fields) {
    return _.each(fields, (field) => {
      // TODO https://github.com/vue-generators/vue-form-generator/issues/352
      field.label = $t(field.label);
      field.placeholder = $t(field.placeholder);

      if (field.hint) {
        field.hint = $t(field.hint);
      }

      if (field.type === 'radios') {
        _.each(field.values, (choice) => {
          choice.label = $t(choice.label);
        });
      }

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
  propsValidator(component, route) {
    const params = { ...route.params };
    return _.transform(params, (carry, prop, key) => {
      if (!_.isArray(component.props[key].type) && !(prop instanceof component.props[key].type)) {
        carry[key] = component.props[key].type(prop);
      }
      return carry;
    }, params);
  },
});

Vue.set(Vue.prototype, '_', _);

export default window._ = _;
