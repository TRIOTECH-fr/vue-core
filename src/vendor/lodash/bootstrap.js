import _ from 'lodash';

export default {
  sortCompare(elementA, elementB, key) {
    const valueA = _.get(elementA, key);
    const valueB = _.get(elementB, key);

    if (_.isNumber(valueA) && _.isNumber(valueB)) {
      return valueA < valueB ? -1 : (valueA > valueB ? 1 : 0);
    } else if (_.isString(valueA) && _.isString(valueB)) {
      return valueA.localeCompare(valueB, undefined, {
        numeric: true,
        sensitivity: 'base',
      });
    } else {
      return toString(valueA).localeCompare(toString(valueB), undefined, {
        numeric: true,
        sensitivity: 'base',
      });
    }
  },
};
