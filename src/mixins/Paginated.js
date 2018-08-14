import PaginationLinks from '../components/PaginationLinks.vue';

export default {
  components: {
    PaginationLinks,
  },
  computed: {
    page() {
      return this.$route.query.page || 1;
    },
  },
};
