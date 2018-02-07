import Vue from 'vue';

const Window = new Vue({
  methods: {
    scrollY: () => window.pageYOffset || (document.documentElement || document.body).scrollTop,
    maxScrollY: () => document.body.scrollHeight - window.innerHeight,
  },
});

window.addEventListener('message', (event) => {
  if (_.isString(event.data) && event.data.indexOf('webpackHotUpdate') === 0) {
    // eslint-disable-next-line no-console
    console.clear();
  }
});

window.onload = () => {

};

window.onunload = () => {

};

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

export default Window;
