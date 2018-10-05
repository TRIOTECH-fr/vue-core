import VueFormGenerator from 'vue-form-generator';
import Autoload from '../helpers/autoload';
import './vue-autosize';
import '../scss/_vfg.scss';

const fields = Autoload(require.context('./vue-form-generator/fields', false, /^\.\/field[\w-_]+\.vue$/));

Object.entries(fields).forEach(([name, module]) => {
  VueFormGenerator.component.components[name] = module.default;
});

export default VueFormGenerator;
