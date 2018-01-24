import Vue from 'vue';
import VueFormGenerator from 'vue-form-generator';

Vue.component('fieldFileUpload', {
  template: '<input @change="onValueChange" type="file" class="form-control-file" :id="getFieldID(schema)">',
  components: {
  },
  data() {
    return {
      data: null,
    };
  },
  mixins: [VueFormGenerator.abstractField],
  mounted() {
    const initialValue = this.modelNameToProperty(this.schema.model);
    if (!_.isNull(initialValue)) {
      console.log(initialValue);
    }
  },
  methods: {
    onValueChange(evt) {
      if (evt.target.files.length > 0) {
        this.data = evt.target.files[0];
      }
    },
    modelNameToProperty(modelName) {
      return modelName
        .replace(/\[(\w+)\]/g, '.$1')
        .replace(/^\./, '')
        .split('.')
        .map(x => _.snakeCase(x))
        .reduce((a, b) => (a && {}.hasOwnProperty.call(a, b) ? a[b] : null), this.model);
    },
  },
  watch: {
    data(newValue, OldValue) {
      if (newValue !== OldValue) {
        this.setModelValueByPath(this.schema.model, newValue);
      }
    },
  },
  computed: {
    value: {
      get() {
        return this.data;
      },
    },
  },
});
