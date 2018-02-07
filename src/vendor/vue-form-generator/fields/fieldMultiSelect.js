import Vue from 'vue';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import Multiselect from 'vue-multiselect';
import VueFormGenerator from 'vue-form-generator';

Vue.component('fieldDropdown', {
  template: `<multiselect
    label="label"
    track-by="id"
    v-model="multiselect_model"
    :multiple="multiple"
    :options="schema.choices"
    :selectLabel="$t('vms.select')"
    :selectedLabel="$t('vms.selected')"
    :deselectLabel="$t('vms.deselect')"
    :placeholder="$t('vms.placeholder')"
    :tagPlaceholder="$t('vms.tag_placeholder')"
  >
    <slot name="noResult">$t('vms.no_result')</slot>
    <slot name="maxElements">$t('vms.max_elements')</slot>
  </multiselect>`,
  components: {
    Multiselect,
  },
  mixins: [VueFormGenerator.abstractField],
  data() {
    return {
      multiselect_model: null,
    };
  },
  mounted() {
    const initialValue = this.modelNameToProperty(this.schema.model);
    if (this.schema.required) {
      this.$el.children[1].children[2].required = 'required';
    }
    if (initialValue) {
      if (!this.multiple) {
        if (typeof initialValue === 'object') {
          // eslint-disable-next-line max-len
          this.multiselect_model = this.schema.choices.find(x => x.id.toString() === initialValue.id.toString());
        } else {
          // eslint-disable-next-line max-len
          this.multiselect_model = this.schema.choices.find(x => x.id === initialValue);
        }
      } else {
        const data = [];
        initialValue.forEach((value) => {
          const temp = this.schema.choices.filter(x => x.id === value.id.toString());
          data.push(...temp);
        });
        this.multiselect_model = data;
      }
    }
  },
  methods: {
    modelNameToProperty(modelName) {
      return modelName
        .replace(/\[(\w+)\]/g, '.$1')
        .replace(/^\./, '')
        .split('.')
        .map(x => _.snakeCase(x))
        // eslint-disable-next-line no-prototype-builtins
        .reduce((a, b) => (a && a.hasOwnProperty(b) ? a[b] : null), this.model);
    },
  },
  watch: {
    model(newValue) {
      if (Object.keys(newValue).length < 1) {
        this.multiselect_model = null;
      }
    },
    multiselect_model(newValue, OldValue) {
      if (this.newValue !== OldValue) {
        this.setModelValueByPath(this.schema.model, this.value);
      }
    },
  },
  computed: {
    multiple() {
      return this.schema.selectOptions.multiple || false;
    },
    value: {
      get() {
        if (this.multiselect_model === null || typeof this.multiselect_model === 'undefined') {
          return this.multiselect_model;
        }

        if (this.multiple) {
          return this.multiselect_model.map(x => parseInt(x.id, 10));
        }

        return _.isNaN(parseInt(this.multiselect_model.id, 10))
          ? this.multiselect_model.id
          : parseInt(this.multiselect_model.id, 10);
      },
    },
  },
});
