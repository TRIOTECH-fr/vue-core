import Vue from 'vue';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import Multiselect from 'vue-multiselect';
import VueFormGenerator from 'vue-form-generator';

Vue.component('fieldDropdown', {
  template: '<multiselect label="label" track-by="id" v-model="multiselect_model" :multiple="multiple" :options="schema.choices"></multiselect>',
  components: {
    Multiselect,
  },
  mixins: [VueFormGenerator.abstractField],
  data() {
    return {
      multiselect_model: null,
    };
  },
  mounted() {
    // TODO make this for multiselect multiple
    if (!this.multiple) {
      const initialValue = this.modelNameToProperty(this.schema.model);
      if (initialValue) {
        this.multiselect_model = this.schema.choices.find(x => x.label === initialValue.toString());
      }
    }
  },
  methods: {
    modelNameToProperty(modelName) {
      return modelName
        .replace(/\[(\w+)\]/g, '.$1')
        .replace(/^\./, '')
        .split('.')
        .map(x => _.snakeCase(x))
        .reduce((a, b) => (a && a.hasOwnProperty(b) ? a[b] : null), this.model);
    },
  },
  watch: {
    multiselect_model(newValue, OldValue) {
      if (this.newValue !== OldValue) {
        this.setModelValueByPath(this.schema.model, this.value);
      }
    },
  },
  computed: {
    multiple() {
      return this.schema.selectOptions.multiple || false;
    },
    value: {
      get() {
        if (this.multiselect_model === null || typeof this.multiselect_model === 'undefined') {
          return this.multiselect_model;
        }

        if (this.multiple) {
          return this.multiselect_model.map(x => parseInt(x.id, 10));
        }
        return this.multiselect_model.id;
      },
    },
  },
});
