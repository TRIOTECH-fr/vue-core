<template>
  <vue-multiselect
    :id="name"
    :value="value"
    :options="options"
    :placeholder="$t(`placeholders.${name}.${multiple ? 'multiple' : 'single'}`)"
    :preserve-search="true"
    :multiple="multiple"
    :close-on-select="true"
    :hide-selected="false"
    :clear-on-select="true"
    :allow-empty="!showAll"
    label="label"
    select-label=""
    selected-label=""
    deselect-label=""
    track-by="value"
    @input="updateStoreValue"
    @remove="onSelect"
    @select="onSelect"
  />
</template>

<script>
  import VueMultiselect from 'vue-multiselect';
  import { mapState } from 'vuex';

  export default {
    name: 'AjaxFilterComponent',
    components: {
      VueMultiselect,
    },
    props: {
      name: {
        type: String,
        required: true,
      },
      data: {
        type: Object,
        default: () => ({}),
      },
      multiple: {
        type: Boolean,
        default: false,
      },
      persistant: {
        type: Boolean,
        default: true,
      },
      enumeration: {
        type: [Boolean, String],
        default: false,
      },
      idPrefix: {
        type: String,
        default: 'filters_',
      },
      enumSuffix: {
        type: String,
        default: 'Enum',
      },
      optionsKey: {
        type: String,
        default: 'options',
      },
      showAll: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        options: [],
        value: null,
      };
    },
    computed: {
      id() {
        return this.idPrefix + this.name;
      },
      entity() {
        return this.$parent.entity;
      },
      enum() {
        return this._.upperFirst(this._.camelCase(this.name)) + this.enumSuffix;
      },
      updateStoreOptions() {
        return this.updateStore.bind(this, 'options');
      },
      updateStoreValue(value) {
        return this.updateStore.bind(this, 'value');
      },
      emptyValue() {
        return { label: this.$t('form.show_all'), value: null };
      },
    },
    created() {
      if (this.showAll) {
        this.value = this.emptyValue;
      }
    },
    mounted() {
      this.$bus.$once(this.event('filters.data'), this.sync);
    },
    methods: {
      event(name) {
        return this.$parent.event(name);
      },
      sync(filters) {
        const { id } = this;
        const filter = this._.find(filters, { id }) || {};
        let options = filter.choices;

        if (!options) {
          return;
        } else if (this._.isObject(options)) {
          options = this._.toArray(options);
        }

        if (this.showAll) {
          options.unshift(this.emptyValue);
        }

        this.options = this._.map(options, (option) => this._.extend(option, { name: this.name }));

        if (this.enumeration) {
          if (this.$enum.enums.length > 0) {
            this.update();
          } else {
            this.$bus.$once('enums', this.update);
          }
        }
      },
      update() {
        this.options = this._.map(this.options, (option) => {
          const enumeration = this.enumeration === true ? this.enum : this.enumeration;
          if (option.value) {
            option.label = this.$enum.trans(option.value, enumeration);
          }
          return option;
        })
      },
      onSelect() {
        this.$nextTick(this.$parent.$emit.bind(this.$parent, this.event('update')));
      },
      updateStore(key, value) {
        if (key === 'value') {
          this.value = value;
        }
        this.$emit('change', this.name, value);
      },
    },
  };
</script>
