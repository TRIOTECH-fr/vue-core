import Vue from 'vue';
import Mixins from './mixins';

window.Mixins = Mixins;

Vue.component('fieldFileUpload', {
  mixins: Mixins,
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
  computed: {
    mimeConstraint() {
      return _.join(this.schema.mimeType, ', ');
    },
    value() {
      return this.data;
    },
  },
  watch: {
    data(newValue, OldValue) {
      if (newValue !== OldValue) {
        this.setModelValueByPath(this.schema.model, newValue);
      }
    },
  },
  mounted() {
    const initialValue = this.modelNameToProperty(this.schema.model, this.model);
    if (initialValue) {
      this.btnText = _.isObject(initialValue) ? initialValue.name : initialValue;
    }
  },
  methods: {
    onValueChange(evt) {
      if (evt.target.files.length > 0) {
        this.btnText = _.reduce(evt.target.files, (carry, file) => `${carry} ${file.name}`, '').trim();

        if (this.schema.multiple) {
          this.data = evt.target.files;
        } else {
          [this.data] = evt.target.files;
        }
      } else {
        this.btnText = '';
      }
    },
  },
  template: `
    <div class="custom-file">
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
    </div>
  `,
});
