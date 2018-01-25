import Vue from 'vue';
import Ajax from '@triotech/vue-core/src/lib/http/ajax';
import Bus from '@triotech/vue-core/src/lib/core/bus';
import I18n from '@triotech/vue-core/src/lib/core/i18n';
import Router from '@triotech/vue-core/src/lib/core/router';
import Store from '@triotech/vue-core/src/lib/core/store';
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
      const page = this.$voca(name.replace(regex, '')).snakeCase().lowerCase().value();
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
    ...mapActions(['setKeyValueAction', 'addKeyValueAction']),
  },
});

export default new Vue({
  methods: {
    run(options = {}) {
      return window.app = new Vue({
        el: '#app',
        ajax: Ajax,
        bus: Bus,
        i18n: I18n,
        router: Router,
        store: Store,
        render: h => h(App),
        ...options,
      });
    },
  },
});
