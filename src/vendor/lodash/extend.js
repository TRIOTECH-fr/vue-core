import _ from 'lodash';

const arrayDifference = _.difference;

export default {
  difference(collection, values) {
    if (this.isArrayLikeObject(collection)) {
      return arrayDifference(collection, values);
    }
    if (!values) {
      return collection;
    }
    return this.transform(collection, (result, value, key) => {
      if (!this.isEqual(value, values[key])) {
        result[key] = this.isObject(value) && this.isObject(values[key]) ? this.difference(value, values[key]) : value;
      }
    });
  },
};
