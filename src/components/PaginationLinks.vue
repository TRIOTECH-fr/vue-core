<template>
  <b-pagination-nav
    :value="page"
    :limit="limit"
    :number-of-pages="pages"
    :total-rows="total"
    :per-page="perPage"
    :align="align"
    :first-text="first"
    :prev-text="prev"
    :next-text="next"
    :last-text="last"
    :use-router="true"
    :ellipsis-text="ellipsis"
    :hide-goto-end-buttons="hideGotoEndButtons"
    :link-gen="generateLink"
    @input="$emit('input', $event)"
    @change="$emit('change', $event)"
  />
</template>

<script>
  export default {
    name: 'PaginationLinksComponent',
    props: {
      pagination: {
        type: Object,
        default: () => ({
          limit: 10,
          page: 1,
          pages: 0,
          total: 0,
        }),
      },
      to: {
        type: [Object, String],
        default: '',
      },
      limit: {
        type: Number,
        default: 5,
      },
      align: {
        type: String,
        default: 'right',
      },
      first: {
        type: String,
        default: '&laquo;',
      },
      prev: {
        type: String,
        default: '&lsaquo;',
      },
      next: {
        type: String,
        default: '&rsaquo;',
      },
      last: {
        type: String,
        default: '&raquo;',
      },
      ellipsis: {
        type: String,
        default: '...',
      },
      hideGotoEndButtons: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      perPage() {
        return this.pagination.limit;
      },
      page() {
        return this.pagination.page;
      },
      pages() {
        return this.pagination.pages;
      },
      total() {
        return this.pagination.total;
      },
    },
    created() {
      this.internalPage = this.page;
    },
    methods: {
      generateLink(page) {
        let { to } = this;

        if (this._.isString(to)) {
          to = { to }
        }

        return this._.merge({}, to, { query: { page } });
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '~@/scss/vars';

  /deep/ {
    .page-item {
      &.active {
        .page-link {
          font-weight: bold !important;
        }
      }
      .page-link {
        border: 0 !important;
        background-color: transparent !important;
        color: $grey !important;
      }
    }
  }
</style>
