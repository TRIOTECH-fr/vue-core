import Vue from 'vue';
import VueFormGenerator from 'vue-form-generator';

Vue.component('fieldCustomTextArea', {
  ...VueFormGenerator.component.components.formGroup.components.fieldTextArea,
});
