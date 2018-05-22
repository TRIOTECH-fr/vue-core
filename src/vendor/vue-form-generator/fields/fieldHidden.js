import Vue from 'vue';
import VueFormGenerator from 'vue-form-generator';
import Mixins from './mixins';

const parent = _.clone(VueFormGenerator.component.components.fieldInput);

Vue.component('fieldHidden', _.merge({}, parent, {
  mixins: Mixins,
}));

