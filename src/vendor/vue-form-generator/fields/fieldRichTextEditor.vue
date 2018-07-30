<template>
  <vue-editor
    v-model="vueEditorModel"
    :id="options.id"
    :use-custom-image-handler="options.useCustomImageHandler"
    :placeholder="options.placeholder"
    :disabled="options.disabled"
    :custom-modules="options.customModules"
    :editor-toolbar="options.editorToolbar"
    :editor-options="options.editorOptions"
    style="display: inline-grid;"
  />
</template>

<script>
  import {VueEditor/*, Quill*/} from 'vue2-editor';
  import abstractField from './abstractField';

  export default {
    components: {
      VueEditor,
    },
    mixins: [
      abstractField,
    ],
    data() {
      return {
        vueEditorModel: null,
      };
    },
    computed: {
      options() {
        return this._.extend({
          id: 'quill-container',
          useCustomImageHandler: false,
          placeholder: '',
          disabled: false,
          customModules: [],
          editorToolbar: VueEditor.data().modules.toolbar,
          editorOptions: {},
        }, this.schema.options);
      },
    },
    watch: {
      model() {
        this.vueEditorModel = this.value;
      },
      vueEditorModel(current) {
        if (!this._.isEmpty(current)) {
          this.setModelValueByPath(this.schema.model, current);
        }
      },
    },
    mounted() {
      this.vueEditorModel = this.value || '';
    },
  };
</script>
