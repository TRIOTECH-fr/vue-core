import Vue from 'vue';
import I18n from '@triotech/vue-core/src/lib/core/i18n';
import Router from '@triotech/vue-core/src/lib/core/router';
import Store from '@triotech/vue-core/src/lib/core/store';
import Env from '@triotech/vue-core/src/lib/core/env';
import Voca from '@triotech/vue-core/src/lib/core/voca';
import Bus from '@triotech/vue-core/src/lib/event/bus';
import Ajax from '@triotech/vue-core/src/lib/http/ajax';
import App from '@/App';
import { mapActions } from 'vuex';

Vue.config.performance = true;
Vue.config.productionTip = false;

Vue.mixin({
  // https://github.com/declandewet/vue-meta
  metaInfo() {
    const name = this.$options.name;
    let metaInfo = {};
    const regex = new RegExp(/(index|show|edit|delete)?page$/i);
    if (name && name.match(regex)) {
      const page = Voca(name.replace(regex, '')).snakeCase().lowerCase().value();
      metaInfo = {
        title: this.$t(`pages.${page}.meta.title`),
        meta: [{
          name: 'description',
          content: this.$t(`pages.${page}.meta.description`),
        }],
      };
    }
    return metaInfo;
  },
  methods: {
    ...mapActions(['setKeyValueAction']),
  },
});

export default new Vue({
  methods: {
    run(options = {}) {
      const app = new Vue(_.merge({
        el: '#app',
        i18n: I18n,
        router: Router,
        store: Store,
        env: Env,
        ajax: Ajax,
        voca: Voca,
        bus: Bus,
        render: h => h(App),
      }, options));

      window.app = app;

      return app;
    },
  },
});
