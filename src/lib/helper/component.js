import Vue from 'vue';

Vue.mixin({
  mounted() {
    if (this.$env.dev) {
      if (!window.components) {
        window.components = {};
      }
      // eslint-disable-next-line no-underscore-dangle
      const name = this._name.replace(/[<>]+/g, '');
      window.components[name] = this;
      window.component = this;
    }
  },
});
