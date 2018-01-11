import Vue from 'vue';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import Multiselect from 'vue-multiselect';
import VueFormGenerator from 'vue-form-generator';

Vue.component('fieldDropdown', {
  template: '<multiselect label="label" track-by="id" v-model="multiselect_model" :options="schema.choice"></multiselect>',
  components: {
    Multiselect,
  },
  mixins: [VueFormGenerator.abstractField],
  data() {
    return {
      multiselect_model: null,
    };
  },
  watch: {
    multiselect_model(newValue, OldValue) {
      if (this.newValue !== OldValue) {
        this.setModelValueByPath(this.schema.model, this.value);
      }
    },
  },
  computed: {
    value: {
      get() {
        return this.multiselect_model !== null ? this.multiselect_model.id : this.multiselect_model;
      },
      set(newValue) {
        this.multiselect_model = this.schema.choice.filter(x => x.id === newValue);
      },
    },
  },
});
