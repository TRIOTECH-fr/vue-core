<template>
  <section class="filters-container">
    <b-container fluid>
      <b-row>
        <b-col v-for="(item, idx) in items" :key="idx" :sm="12 / rows">
          <ajax-filter
            :name="item.name"
            :enumeration="item.enumeration"
            :show-all="item.show_all"
            @change="onChange"
          />
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
  import AjaxFilter from './AjaxFilter';

  export default {
    name: 'AjaxFiltersComponent',
    components: { AjaxFilter },
    props: {
      entity: {
        type: String,
        required: true,
      },
      items: {
        type: Array,
        default: () => [],
      },
      rows: {
        type: Number,
        default: 4,
      },
      filterTemplate: {
        type: String,
        default: 'filters[<%= name %>]',
      },
      uriPrefix: {
        type: String,
        default: 'public',
      },
      uriSuffix: {
        type: String,
        default: 'filters',
      },
      uriSeparator: {
        type: String,
        default: '/',
      },
    },
    computed: {
      uri() {
        return [this.uriPrefix, this.entity, this.uriSuffix].join(this.uriSeparator);
      },
      filter() {
        return this._.template(this.filterTemplate);
      },
      computedFilters() {
        return this._.reduce(this.filters, (carry, filter, name) => {
          if (this._.get(filter, 'value')) {
            carry[this.filter({ name })] = filter.value;
          }
          return carry;
        }, {});
      },
    },
    data() {
      return {
        filters: {},
      };
    },
    mounted() {
      this.fetch().then(this.update);
      this.$on(this.event('update'), this.update);
    },
    destroyed() {
      this.$off(this.event('update'));
    },
    methods: {
      event(name) {
        return [this.entity, name].join('.');
      },
      fetch() {
        return this.$ajax.get(this.uri).then((data) => {
          this.$bus.$emit(this.event('filters.data'), data);
        });
      },
      update() {
        this.$bus.$emit(this.event('fetch'), this._.param(this.computedFilters));
      },
      onChange(name, value) {
        this.$set(this.filters, name, value);
      },
    },
  };
</script>
