import Vue from 'vue';
import Env from '@triotech/vue-core/src/lib/helper/env';

const Window = new Vue({
  methods: {
    scrollY: () => window.pageYOffset || (document.documentElement || document.body).scrollTop,
    maxScrollY: () => document.body.scrollHeight - window.innerHeight,
  },
});

window.addEventListener('message', (event) => {
  if (_.isString(event.data) && event.data.indexOf('webpackHotUpdate') === 0) {
    /* eslint-disable no-console */
    console.clear();
  }
});

window.onload = () => {

};

window.onunload = () => {

};

if (Env.dev) {
  window.components = {};

  Vue.mixin({
    mounted() {
      /* eslint-disable-lint no-underscore-dangle */
      const name = this._name.replace(/[<>]+/g, '');
      window.components[name] = this;
      window.component = this;
    },
  });
}

export default Window;
