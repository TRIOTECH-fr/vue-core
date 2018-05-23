import Vue from 'vue';
import Mixins from './mixins';

Vue.component('fieldCustomTextArea', {
  mixins: Mixins,
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
      if (this.textAreaModel !== '') {
        this.setModelValueByPath(this.schema.model, newValue);
      }
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
      :maxlength="schema.max"
      v-model="textAreaModel"
      class="form-control"
    >
    </textarea>
  `,
});
