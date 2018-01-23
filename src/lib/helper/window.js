import Vue from 'vue';
import Env from '@triotech/vue-core/src/lib/helper/env';

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

const Window = new Vue({
  methods: {
    scrollY: () => window.pageYOffset || (document.documentElement || document.body).scrollTop,
    maxScrollY: () => document.body.scrollHeight - window.innerHeight,
  },
});

if (Env.dev) {
  window.components = {};

  Vue.mixin({
    mounted() {
      window.components[this._name] = this;
    },
  });
}

export default Window;
