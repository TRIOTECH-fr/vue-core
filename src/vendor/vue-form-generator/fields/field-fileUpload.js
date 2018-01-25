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
    // security issue, input type file is in read-only mode ...
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
    model(newValue) {
      if (Object.keys(newValue).length < 1) {
        document.getElementById(this.getFieldID(this.schema)).value = '';
      }
    },
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
