import Vue from 'vue';
import Multiselect from '../../vue-multiselect';
import Mixins from './mixins';

Vue.component('fieldDropdown', {
  components: {
    Multiselect,
  },
  mixins: Mixins,
  data() {
    return {
      multiselectModel: null,
    };
  },
  computed: {
    multiple() {
      return this.schema.selectOptions.multiple || false;
    },
    value: {
      get() {
        if (this.multiselectModel === null || typeof this.multiselectModel === 'undefined') {
          return this.multiselectModel;
        }

        if (this.multiple) {
          return this.multiselectModel.map(x => parseInt(x.id, 10));
        }

        return _.isNaN(parseInt(this.multiselectModel.id, 10))
          ? this.multiselectModel.id
          : parseInt(this.multiselectModel.id, 10);
      },
    },
  },
  watch: {
    model(newValue) {
      if (Object.keys(newValue).length < 1) {
        this.multiselectModel = null;
      }
    },
    multiselectModel(newValue, OldValue) {
      if (newValue !== OldValue) {
        this.setModelValueByPath(this.schema.model, this.value);
      }
      this.setRequired(_.size(newValue));
    },
  },
  mounted() {
    const initialValue = this.modelNameToProperty(this.schema.model, this.model);
    if (this.schema.required) {
      this.setRequired();
    }
    if (initialValue) {
      const findOrFilter = (value, current) => Number(current.id) === Number(_.isObject(value) ? value.id : value);
      if (!this.multiple) {
        this.multiselectModel = this.schema.choices.find(findOrFilter.bind(_, initialValue));
      } else {
        this.multiselectModel = _.transform(initialValue, (carry, value) => {
          carry.push(...this.schema.choices.filter(findOrFilter.bind(_, value)));
          return carry;
        });
      }
    }
  },
  methods: {
    setRequired(value = 0) {
      if (this.schema.required) {
        this.$el.children[1].children[2].required = value > 0 ? '' : 'required';
      }
    },
    onChange() {
      this.$nextTick(this.$bus.$emit.bind(this.$bus, 't-event.multiselect-change'));
    },
  },
  template: `
    <multiselect
      label="label"
      track-by="id"
      v-model="multiselectModel"
      :multiple="multiple"
      :options="schema.choices"
      :selectLabel="$t('vms.select')"
      :selectedLabel="$t('vms.selected')"
      :deselectLabel="$t('vms.deselect')"
      :placeholder="$t('vms.placeholder')"
      :tagPlaceholder="$t('vms.tag_placeholder')"
      @input="onChange"
    >
      <slot name="noResult">$t('vms.no_result')</slot>
      <slot name="maxElements">$t('vms.max_elements')</slot>
    </multiselect>
  `,
});
