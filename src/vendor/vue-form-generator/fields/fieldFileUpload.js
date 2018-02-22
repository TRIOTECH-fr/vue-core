import Vue from 'vue';
import VueFormGenerator from 'vue-form-generator';

Vue.component('fieldFileUpload', {
  template:
    `<div class="custom-file">
      <input
        :multiple="schema.multiple"
        :accept="mimeConstraint"
        @change="onValueChange"
        type="file"
        class="custom-file-input"
        :id="getFieldID(schema)"
        :lang="lang"
      >
      <label class="custom-file-label" :id="getFieldID(schema)">{{ btnText }}</label>
    </div>`,
  components: {
  },
  props: {
    lang: {
      type: String,
      default: 'fr',
    },
  },
  data() {
    return {
      data: null,
      btnText: this.$t('actions.choose_file'),
    };
  },
  mixins: [VueFormGenerator.abstractField],
  mounted() {
    // security issue, input type file is in read-only mode ...
  },
  methods: {
    onValueChange(evt) {
      if (evt.target.files.length > 0) {
        this.btnText = '';
        _.each(evt.target.files, (file) => {
          this.btnText = `${this.btnText} ${file.name}`;
        });

        if (this.schema.multiple) {
          this.data = evt.target.files;
        } else {
          this.data = evt.target.files[0];
        }
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
    mimeConstraint() {
      return _.join(this.schema.mimeType, ', ');
    },
    value: {
      get() {
        return this.data;
      },
    },
  },
});
