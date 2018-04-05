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
      value() {
        return this.filter.value || null;
      },
      options() {
        return this.filter.options || [];
      },
      updateStoreOptions() {
        return this.updateStore.bind(this, 'options');
      },
      updateStoreValue() {
        return this.updateStore.bind(this, 'value');
      },
      ...mapState({
        filter(state) {
          return state.filters[this.name] || {};
        },
      }),
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
        let { choices } = filter;

        if (!choices) {
          return;
        } else if (this._.isObject(choices)) {
          choices = this._.toArray(choices);
        }

        this.updateStoreOptions(this._.each(choices, (choice) => {
          choice.name = this.name;
        }));

        if (this.enumeration) {
          if (this.$enum.enums.length > 0) {
            this.update();
          } else {
            this.$bus.$once('enums', this.update);
          }
        }
      },
      update() {
        this.updateStoreOptions(this._.each(this.options, (choice) => {
          const enumeration = this.enumeration === true ? this.enum : this.enumeration;
          choice.label = this.$enum.trans(choice.value, enumeration);
        }));
      },
      onSelect() {
        this.$nextTick(this.$parent.$emit.bind(this.$parent, this.event('update')));
      },
      updateStore(key, value) {
        const { filters } = this.get();
        const filter = this._.access(filters, this.name, {});
        // TODO fix vuex mutation error
        filter[key] = value;
        this.set({ filters });
      },
    },
  };
</script>
