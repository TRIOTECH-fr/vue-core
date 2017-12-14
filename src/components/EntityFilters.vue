<template>
  <section class="filters-container">
    <b-container fluid>
      <b-row>
        <b-col :sm="12 / items.length" v-for="item, key in items" :key="key">
          <entity-filter :name="item.name" :enumeration="item.enumeration" />
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
  import Api from '@triotech/vue-core/src/lib/http/api';
  import EntityFilter from '@triotech/vue-core/src/components/EntityFilter';

  export default {
    name: 'EntityFiltersComponent',
    components: { EntityFilter },
    props: {
      entity: { type: String, required: true },
      items: { type: Array, default: () => [] },
      row_items: { type: Number, default: 4 },
      filter_template: { type: String, default: 'filters[<%= name %>]' },
      uri_prefix: { type: String, default: 'public' },
      uri_suffix: { type: String, default: 'filters' },
      uri_separator: { type: String, default: '/' },
    },
    computed: {
      uri() { return [this.uri_prefix, this.entity, this.uri_suffix].join(this.uri_separator); },
      filter() { return _.template(this.filter_template); },
    },
    methods: {
      event(name) { return [this.entity, name].join('.'); },
      fetch() {
        const state = this.$store.state;
        const entity = this.entity;
        if (!state[entity]) {
          state[entity] = {};
        }
        if (state[entity].filters === true) {
          return Promise.resolve();
        }
        this.$set(state[entity], this.uri_suffix, true);
        return Api
          .get(this.uri)
          .then((data) => {
            this.$set(state[entity], this.uri_suffix, data);
            this.$bus.$emit(this.event('filters.data'), data);
          })
        ;
      },
      filters() {
        return _.reduce(this.$store.state.filters, (carry, filter, name) => {
          if (filter.value) {
            carry[this.filter({ name })] = filter.value.value;
          }
          return carry;
        }, {});
      },
      update() {
        this.$bus.$emit(this.event('fetch'), _.param(this.filters()));
      },
    },
    mounted() {
      this.fetch().then(this.update);
      this.$on(this.event('update'), this.update);
    },
  };
</script>
