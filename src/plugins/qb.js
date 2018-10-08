import Vue from '@triotech/vue-core/src/vendor/vue';

const QueryBuilder = new Vue({
  data() {
    return {
      queryString: null,
    };
  },
  created() {
    this.reset();
  },
  methods: {
    get(embedded = true) {
      const {
        queryString,
      } = this;
      const computed = embedded ? {
        queryString,
      } : queryString;
      this.reset();
      return computed;
    },
    add(queryString) {
      this._.merge(this.queryString, queryString);
      return this;
    },
    reset() {
      this.queryString = {};
    },
    addCriteria(criteria) {
      this.add({
        criteria,
      });
      return this;
    },
    addLimit(limit) {
      this.add({
        limit,
      });
      return this;
    },
    addPage(page) {
      this.add({
        page,
      });
      return this;
    },
    addSorting(sorting) {
      this.add({
        sorting,
      });
      return this;
    },
  },
});

Vue.set(Vue.prototype, '$qb', QueryBuilder);

export default QueryBuilder;
