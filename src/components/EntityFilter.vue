<template>
  <multiselect
    :id="name"
    :value="value"
    :options="options"
    :placeholder="$t(`placeholders.${name}.${multiple ? 'multiple' : 'single'}`)"
    :preserve-search="true"
    :multiple="multiple"
    label="label"
    select-label=""
    selected-label=""
    deselect-label=""
    track-by="value"
    @input="updateFilterAction"
    @select="onSelect"
    @remove="onRemove"
  />
  <!-- TODO finish props binding -->
  <!-- :v-model="filter.value" -->
  <!-- :hide-selected="true" -->
  <!-- :clear-on-select="false" -->
  <!-- :close-on-select="false" -->
</template>

<script>
  import Multiselect from 'vue-multiselect';
  import { mapActions } from 'vuex';
  import Voca from 'voca';

  export default {
    name: 'EntityFilterComponent',
    components: {
      Multiselect,
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
      id_prefix: {
        type: String,
        default: 'filters_',
      },
      enum_suffix: {
        type: String,
        default: 'Enum',
      },
      options_key: {
        type: String,
        default: 'options',
      },
    },
    data() {
      return {
        options: [],
      };
    },
    computed: {
      id() {
        return this.id_prefix + this.name;
      },
      entity() {
        return this.$parent.entity;
      },
      stored() {
        if (!this.$store.state.filters[this.name]) {
          this.$store.state.filters[this.name] = {};
        }
        return this.$store.state.filters[this.name];
      },
      enum() {
        return Voca(this.name).camelCase().capitalize().value() + this.enum_suffix;
      },
      value() {
        const value = _.extend(this.data, this.stored);
        return value && value.value;
      },
    },
    mounted() {
      const state = this.$store.state[this.$parent.entity];
      const filters = state && state.filters;
      if (!_.isEmpty(filters)) {
        this.sync(filters);
      } else {
        this.$bus.$once(this.event('filters.data'), this.sync);
      }
    },
    methods: {
      event(name) {
        return this.$parent.event(name);
      },
      sync(filters) {
        const filter = _.find(filters, { id: this.id }) || {};
        let { choices } = filter;

        if (!choices) {
          return;
        } else if (_.isObject(choices)) {
          choices = _.toArray(choices);
        }

        this.options = this.$set(this.stored, this.options_key, _.each(choices, (choice) => {
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
        this.options = this.$set(this.stored, this.options_key, _.each(this.options, (choice) => {
          const enumeration = this.enumeration === true ? this.enum : this.enumeration;
          choice.label = this.$enum.trans(choice.value, enumeration);
        }));
      },
      onRemove(data) {
        // TODO workaround for @input null value on @remove
        data.value = null;
        this.updateFilterAction(data).then(this.select);
      },
      onSelect() {
        // TODO replace nextTick workaround : @input is called before @select and @remove
        this.$nextTick(() => {
          this.$parent.$emit(this.event('update'));
        });
      },
      ...mapActions(['updateFilterAction']),
    },
  };
</script>
