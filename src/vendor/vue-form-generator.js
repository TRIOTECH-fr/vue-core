import VueFormGenerator from 'vue-form-generator';
import autoload from '../lib/core/autoload';
import './vue-autosize';
import '../scss/_vfg.scss';

const fields = autoload(require.context('./vue-form-generator/fields', false, /^\.\/field[\w-_]+\.vue$/));

Object.entries(fields).forEach(([name, module]) => {
  VueFormGenerator.component.components[name] = module.default;
});

export default VueFormGenerator;
