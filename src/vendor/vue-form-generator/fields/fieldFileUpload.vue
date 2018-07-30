<template>
  <div class="custom-file">
    <input
      ref="file"
      :multiple="schema.multiple"
      :accept="mimeConstraint"
      :id="getFieldID(schema)"
      :lang="lang"
      type="file"
      class="custom-file-input"
      @change="onValueChange"
    >
    <label :id="getFieldID(schema)" class="custom-file-label">{{ btnText }}</label>
  </div>
</template>

<script>
  import abstractField from './abstractField';

  export default {
    mixins: [
      abstractField,
    ],
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
        return this._.join(this.schema.mimeType, ', ');
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
        const buttonText = initialValue ? (this._.get(initialValue, 'name') || this._.get(initialValue, 'original_filename') || this._.get(initialValue, 'file_name')) : this.$t('actions.choose_file');
        if (this.btnText !== buttonText) {
          this.btnText = buttonText;
        }
      },
      onValueChange(evt) {
        if (evt.target.files.length > 0) {
          this.btnText = this._.reduce(evt.target.files, (carry, file) => `${carry} ${file.name}`, '').trim();

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
  };
</script>
