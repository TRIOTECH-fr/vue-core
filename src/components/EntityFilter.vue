<template>
  <multiselect
    :id="name"
    :value="value"
    :options="options"
    :placeholder="$t(`placeholders.${name}.${multiple ? 'multiple' : 'single'}`)"
    :preserve-search="true"
    @input="updateFilterAction"
    @select="select"
    @remove="remove"
    label="label"
    :multiple="multiple"
    selectLabel=""
    selectedLabel=""
    deselectLabel="" />
    <!-- :v-model="filter.value" -->
    <!-- :hide-selected="true" -->
    <!-- :clear-on-select="false" -->
    <!-- :close-on-select="false" -->
</template>

<script>
  import Multiselect from 'vue-multiselect';
  import { mapActions } from 'vuex';
  import voca from 'voca';
  import Enum from '@triotech/vue-core/src/lib/http/enum';

  export default {
    name: 'EntityFilterComponent',
    components: {
      Multiselect,
    },
    props: {
      name: { type: String, required: true },
      data: { type: Object, default: () => {} },
      multiple: { type: Boolean, default: false },
      persistant: { type: Boolean, default: true },
      enumeration: { type: [Boolean, String], default: false },
      id_prefix: { type: String, default: 'filters_' },
      enum_suffix: { type: String, default: 'Enum' },
      options_key: { type: String, default: 'options' },
    },
    data() {
      return {
        options: [],
      };
    },
    computed: {
      id() { return this.id_prefix + this.name; },
      entity() { return this.$parent.entity; },
      stored() {
        if (!this.$store.state.filters[this.name]) {
          this.$store.state.filters[this.name] = {};
        }
        return this.$store.state.filters[this.name];
      },
      enum() { return voca(this.name).camelCase().capitalize() + this.enum_suffix; },
      value() {
        const value = _.extend(this.data, this.stored);
        return value && value.value;
      },
    },
    methods: {
      event(name) { return this.$parent.event(name); },
      sync(filters) {
        const filter = _.find(filters, { id: this.id }) || {};
        let choices = filter.choices;

        if (!choices) {
          return;
        } else if (_.isObject(choices)) {
          choices = _.toArray(choices);
        }

        this.options = this.$set(this.stored, this.options_key, _.each(choices, (choice) => {
          choice.name = this.name;
          if (this.enumeration) {
            const enumeration = this.enumeration === true ? this.enum : this.enumeration;
            choice.label = Enum.trans(choice.value, enumeration);
          }
        }));
      },
      remove(data) {
        // TODO workaround for @input null value on @remove
        data.value = null;
        this.updateFilterAction(data).then(this.select);
      },
      select() {
        // TODO replace nextTick workaround : @input is called before @select and @remove
        this.$nextTick(() => {
          this.$parent.$emit(this.event('update'));
        });
      },
      ...mapActions(['updateFilterAction']),
    },
    mounted() {
      const filters = this.$store.state.projectFilters;
      if (!_.isEmpty(filters)) {
        this.sync(filters);
      } else {
        this.$bus.$once(this.event('filters.data'), this.sync);
      }
    },
  };
</script>
