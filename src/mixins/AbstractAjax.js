export default {
  methods: {
    catchHandler(error) {
      const { status, data } = error.response;
      let text = status === 400 ? _.reduce(_.transform(data.errors.children, (carry, value, key) => {
        if (value.errors) {
          carry[key] = value.errors;
        }
        return carry;
      }), (carry, errors, field) => {
        carry.push(`${this.$t(`flashes.${this.name}.error_${status}.${field}`)} : ${errors.join()}`);
        return carry;
      }, []).join('\n') : this.$t(`flashes.${this.name}.error_${status}`);

      if (_.isEmpty(text)) {
        text = `${this.$t(`flashes.${this.name}.error_${status}.extra`)} : ${data.errors.errors.join('\n')}`;
      }

      this.$notify({
        title: this.$t(`flashes.${this.name}.error_${status}_title`),
        text,
        type: status === 500 ? 'error' : 'warning',
      });
    },
  },
};
