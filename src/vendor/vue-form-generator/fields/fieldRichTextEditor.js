import Vue from 'vue';
import { VueEditor/*, Quill*/ } from 'vue2-editor';
import Mixins from './mixins';

Vue.component('fieldRichTextEditor', {
  components: {
    VueEditor,
  },
  mixins: Mixins,
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
        editorToolbar: null,
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
  methods: {
    onVueEditorTextChange() {
      const { vueEditorHidden } = this.$refs;
      if (vueEditorHidden) {
        vueEditorHidden.value = this.vueEditorModel.length > 0 ? 'true' : '';
      }
    },
  },
  mounted() {
    this.vueEditorModel = this.value || '';
    this.onVueEditorTextChange();
  },
  template: `
    <div>
      <input
        type="text"
        ref="vueEditorHidden"
        required="options.required"
        tabindex="-1"
        style="position: absolute; outline: none; border: 0; z-index: -1; height: 0; font-size: 1px;"
      />
      <vue-editor
        v-model="vueEditorModel"
        :id="options.id"
        :use-custom-image-handler="options.useCustomImageHandler"
        :placeholder="options.placeholder"
        :disabled="options.disabled"
        :custom-modules="options.customModules"
        :editor-toolbar="options.editorToolbar"
        :editor-options="options.editorOptions"
        @text-change="onVueEditorTextChange"
        style="display: inline-grid;"
      />
    </div>
  `,
});