import { abstractField } from 'vue-form-generator';
import _ from 'lodash';

abstractField.methods.modelNameToProperty = (modelName, model) => modelName
  .replace(/\[(\w+)\]/g, '.$1')
  .replace(/^\./, '')
  .split('.')
  .map(_.snakeCase)
  .reduce((a, b) => (a && {}.hasOwnProperty.call(a, b) ? a[b] : null), model);

export default abstractField;
