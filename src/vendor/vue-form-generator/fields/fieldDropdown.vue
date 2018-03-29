<template>
  <multiselect
    v-model="multiselectModel"
    :multiple="multiple"
    :options="schema.choices"
    :select-label="$t('vms.select')"
    :selected-label="$t('vms.selected')"
    :deselect-label="$t('vms.deselect')"
    :placeholder="$t('vms.placeholder')"
    :tag-placeholder="$t('vms.tag_placeholder')"
    label="label"
    track-by="id"
    @input="onChange"
  >
    <slot name="noResult">$t('vms.no_result')</slot>
    <slot name="maxElements">$t('vms.max_elements')</slot>
  </multiselect>
</template>

<script>
  import Multiselect from '../../vue-multiselect';
  import abstractField from './abstractField';

  export default {
    components: {
      Multiselect,
    },
    mixins: [
      abstractField,
    ],
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

          return this._.isNaN(parseInt(this.multiselectModel.id, 10))
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
      multiselectModel(newValue, oldValue) {
        if (!this._.isUndefined(newValue) && newValue !== oldValue) {
          this.setModelValueByPath(this.schema.model, this.value);
        }
        this.setRequired(this._.size(newValue));
      },
    },
    mounted() {
      const initialValue = this.modelNameToProperty(this.schema.model, this.model);
      if (this.schema.required) {
        this.setRequired();
      }
      if (initialValue) {
        const findOrFilter = (value, current) => String(current.id) === String((this._.isObject(value) ? value.id : value));
        if (!this.multiple) {
          this.multiselectModel = this.schema.choices.find(findOrFilter.bind(this._, initialValue));
        } else {
          this.multiselectModel = this._.transform(initialValue, (carry, value) => {
            carry.push(...this.schema.choices.filter(findOrFilter.bind(this._, value)));
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
  };
</script>
