import PaginationLinks from '../components/PaginationLinks';

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
