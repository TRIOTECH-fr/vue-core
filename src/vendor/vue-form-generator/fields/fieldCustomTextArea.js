import Vue from 'vue';
import Mixins from './mixins';
import VueFormGenerator from 'vue-form-generator';

Vue.component('fieldCustomTextArea', {
  ...VueFormGenerator.component.components.formGroup.components.fieldTextArea,
});
