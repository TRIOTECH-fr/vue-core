import Vue from 'vue';
import AbstractField from './abstractField';

Vue.component('fieldCustomTextArea', {
  mixins: [
    AbstractField,
  ],
  data() {
    return {
      textAreaModel: '',
    };
  },
  computed: {
    value() {
      return this.textAreaModel;
    },
  },
  watch: {
    model(newValue) {
      if (Object.keys(newValue).length < 1) {
        this.textAreaModel = null;
      }
    },
    textAreaModel(newValue, oldValue) {
      this.textAreaModel = this._.isNull(newValue) ? '' : newValue;
      this.setModelValueByPath(this.schema.model, newValue);
    },
  },
  mounted() {
    this.textAreaModel = this.modelNameToProperty(this.schema.model, this.model);
  },
  template: `
    <textarea
      :placeholder="schema.placeholder"
      :required="schema.required"
      :rows="schema.rows"
      :hint="schema.hint"
      :max="schema.max"
      v-model="textAreaModel"
      class="form-control"
    >
    </textarea>
  `,
});
