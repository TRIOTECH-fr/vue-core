import Vue from 'vue';
import Mixins from './mixins';

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
      btnText: null,
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
    data(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.setModelValueByPath(this.schema.model, newValue);
      }
    },
  },
  mounted() {
    this.updateButtonText();
  },
  updated() {
    this.resetInputNode();
    this.updateButtonText();
  },
  methods: {
    resetInputNode() {
      const initialValue = this.modelNameToProperty(this.schema.model, this.model);

      if (!initialValue && this.$refs.file) {
        this.$refs.file.value = '';
      }
    },
    updateButtonText() {
      const initialValue = this.modelNameToProperty(this.schema.model, this.model);

      const buttonText = initialValue ? (_.get(initialValue, 'name') || _.get(initialValue, 'original_filename') || _.get(initialValue, 'file_name')) : this.$t('actions.choose_file');
      if (this.btnText !== buttonText) {
        this.btnText = buttonText;
      }
    },
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
        v-attributes="'input'"
        ref="file"
        :multiple="schema.multiple"
        :required="schema.required"
        :accept="mimeConstraint"
        :id="getFieldID(schema)"
        :lang="$i18n.locale"
        type="file"
        class="custom-file-input"
        @change="onValueChange"
      >
      <label class="custom-file-label" :id="getFieldID(schema)">{{ btnText }}</label>
    </div>
  `,
});
