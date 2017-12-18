import Vue from 'vue';
import Env from '@triotech/vue-core/src/lib/core/env';
import App from '@triotech/vue-core/src/lib/core/app';
import Store from '@triotech/vue-core/src/lib/core/store';
import Router from '@triotech/vue-core/src/lib/core/router';
import Ajax from '@triotech/vue-core/src/lib/http/ajax';
import Voca from 'voca';

/* eslint-disable no-console */
window.addEventListener('message', (event) => {
  if (_.isString(event.data) && event.data.indexOf('webpackHotUpdate') === 0) {
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
  window.env = Env;
  window.app = App;
  window.store = Store;
  window.router = Router;
  window.ajax = Ajax;
  window.win = Window;
  window.voca = Voca;
}

export default Window;
