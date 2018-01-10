import Vue from 'vue';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import Multiselect from 'vue-multiselect';
import VueFormGenerator from 'vue-form-generator';

// delete Multiselect.props.value;
// TODO fix vue warn

Vue.component('multiselect', {
  ...Multiselect,
  mounted() {
    this.$on('input', (value) => {
      this.value = value;
    });
  },
});
