import Vue from 'vue';
import I18n from '@triotech/vue-core/src/lib/core/i18n';
import Router from '@triotech/vue-core/src/lib/core/router';
import Store from '@triotech/vue-core/src/lib/core/store';
import Env from '@triotech/vue-core/src/lib/core/env';
import App from '@/App';

Vue.config.productionTip = true;

const app = new Vue({
  i18n: I18n,
  router: Router,
  store: Store,
  env: Env,
  render: h => h(App),
  methods: {
    run(config = {}) {
      this.$mount(config.el || '#app');
    },
  },
});

export default app;
